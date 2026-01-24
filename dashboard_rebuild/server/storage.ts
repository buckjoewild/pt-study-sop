import {
  users, sessions, calendarEvents, tasks, proposals, chatMessages, notes,
  courses, studyWheelState, studyStreak, weaknessQueue,
  scheduleEvents, modules, learningObjectives, loSessions,
  type User, type InsertUser,
  type Session, type InsertSession,
  type CalendarEvent, type InsertCalendarEvent,
  type Task, type InsertTask,
  type Proposal, type InsertProposal,
  type ChatMessage, type InsertChatMessage,
  type Note, type InsertNote,
  type Course, type InsertCourse,
  type ScheduleEvent, type InsertScheduleEvent,
  type Module, type InsertModule,
  type LearningObjective, type InsertLearningObjective,
  type LoSession, type InsertLoSession
} from "../schema";
import { asc, sql } from "drizzle-orm";
import { db } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Sessions
  getAllSessions(): Promise<Session[]>;
  getSession(id: number): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(id: number, session: Partial<InsertSession>): Promise<Session | undefined>;
  deleteSession(id: number): Promise<boolean>;
  getSessionStats(): Promise<{ total: number; avgErrors: number; totalCards: number }>;

  // Calendar Events
  getAllEvents(): Promise<CalendarEvent[]>;
  getEvent(id: number): Promise<CalendarEvent | undefined>;
  createEvent(event: InsertCalendarEvent): Promise<CalendarEvent>;
  updateEvent(id: number, event: Partial<InsertCalendarEvent>): Promise<CalendarEvent | undefined>;
  deleteEvent(id: number): Promise<boolean>;

  // Tasks
  getAllTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;

  // Proposals
  getAllProposals(): Promise<Proposal[]>;
  getProposal(id: number): Promise<Proposal | undefined>;
  createProposal(proposal: InsertProposal): Promise<Proposal>;
  updateProposal(id: number, proposal: Partial<InsertProposal>): Promise<Proposal | undefined>;
  deleteProposal(id: number): Promise<boolean>;

  // Chat Messages
  getMessagesBySession(sessionId: string): Promise<ChatMessage[]>;
  createMessage(message: InsertChatMessage): Promise<ChatMessage>;

  // Notes
  getAllNotes(): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: number, note: Partial<InsertNote>): Promise<Note | undefined>;
  deleteNote(id: number): Promise<boolean>;
  reorderNotes(noteIds: number[]): Promise<void>;

  // Courses (Study Wheel)
  getAllCourses(): Promise<Course[]>;
  getActiveCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course | undefined>;
  deleteCourse(id: number): Promise<boolean>;

  // Study Wheel - round-robin rotation logic
  getCurrentCourse(): Promise<Course | undefined>;
  rotateToNextCourse(): Promise<Course | undefined>;
  
  // Session with minutes - updates course stats
  createSessionWithMinutes(courseId: number, minutes: number, mode?: string): Promise<Session>;
  getTodaysSessions(): Promise<Session[]>;

  // Streak tracking
  getStreak(): Promise<{ currentStreak: number; longestStreak: number; lastStudyDate: Date | null }>;
  updateStreakOnSession(): Promise<void>;

  // Weakness Queue (read-only from dashboard)
  getWeaknessQueue(): Promise<{ id: number; topic: string; reason: string | null }[]>;

  // Brain Analytics - Derived Metrics from WRAP fields
  getBrainMetrics(): Promise<{
    sessionsPerCourse: { course: string; count: number; minutes: number }[];
    modeDistribution: { mode: string; count: number; minutes: number }[];
    recentConfusions: { text: string; count: number; course: string }[];
    recentWeakAnchors: { text: string; count: number; course: string }[];
    conceptFrequency: { concept: string; count: number }[];
    issuesLog: { issue: string; count: number; course: string }[];
    totalMinutes: number;
    totalSessions: number;
    totalCards: number;
  }>;

  // Schedule Events
  getScheduleEventsByCourse(courseId: number): Promise<ScheduleEvent[]>;
  createScheduleEvent(event: InsertScheduleEvent): Promise<ScheduleEvent>;
  createScheduleEventsBulk(events: InsertScheduleEvent[]): Promise<ScheduleEvent[]>;
  updateScheduleEvent(id: number, event: Partial<InsertScheduleEvent>): Promise<ScheduleEvent | undefined>;
  deleteScheduleEvent(id: number): Promise<boolean>;

  // Modules
  getModulesByCourse(courseId: number): Promise<Module[]>;
  getModule(id: number): Promise<Module | undefined>;
  createModule(module: InsertModule): Promise<Module>;
  createModulesBulk(modules: InsertModule[]): Promise<Module[]>;
  updateModule(id: number, module: Partial<InsertModule>): Promise<Module | undefined>;
  deleteModule(id: number): Promise<boolean>;

  // Learning Objectives
  getLearningObjectivesByCourse(courseId: number): Promise<LearningObjective[]>;
  getLearningObjectivesByModule(moduleId: number): Promise<LearningObjective[]>;
  getLearningObjective(id: number): Promise<LearningObjective | undefined>;
  createLearningObjective(lo: InsertLearningObjective): Promise<LearningObjective>;
  createLearningObjectivesBulk(los: InsertLearningObjective[]): Promise<LearningObjective[]>;
  updateLearningObjective(id: number, lo: Partial<InsertLearningObjective>): Promise<LearningObjective | undefined>;
  deleteLearningObjective(id: number): Promise<boolean>;

  // LO Sessions
  createLoSession(loSession: InsertLoSession): Promise<LoSession>;
  getLoSessionsByLo(loId: number): Promise<LoSession[]>;
  getLoSessionsBySession(sessionId: number): Promise<LoSession[]>;

  // Session Context
  getLastSessionContext(courseId?: number): Promise<{
    lastSession: Session | null;
    course: Course | null;
    recentLos: LearningObjective[];
  }>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Sessions
  async getAllSessions(): Promise<Session[]> {
    return await db.select().from(sessions).orderBy(desc(sessions.date));
  }

  async getSession(id: number): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions).where(eq(sessions.id, id));
    return session || undefined;
  }

  async createSession(session: InsertSession): Promise<Session> {
    const [newSession] = await db.insert(sessions).values(session).returning();
    return newSession;
  }

  async updateSession(id: number, session: Partial<InsertSession>): Promise<Session | undefined> {
    const [updated] = await db.update(sessions).set(session).where(eq(sessions.id, id)).returning();
    return updated || undefined;
  }

  async deleteSession(id: number): Promise<boolean> {
    const result = await db.delete(sessions).where(eq(sessions.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getSessionStats(): Promise<{ total: number; avgErrors: number; totalCards: number }> {
    const allSessions = await db.select().from(sessions);
    const total = allSessions.length;
    const totalErrors = allSessions.reduce((sum, s) => sum + s.errors, 0);
    const totalCards = allSessions.reduce((sum, s) => sum + s.cards, 0);
    return {
      total,
      avgErrors: total > 0 ? Math.round(totalErrors / total) : 0,
      totalCards,
    };
  }

  // Calendar Events
  async getAllEvents(): Promise<CalendarEvent[]> {
    return await db.select().from(calendarEvents).orderBy(desc(calendarEvents.date));
  }

  async getEvent(id: number): Promise<CalendarEvent | undefined> {
    const [event] = await db.select().from(calendarEvents).where(eq(calendarEvents.id, id));
    return event || undefined;
  }

  async createEvent(event: InsertCalendarEvent): Promise<CalendarEvent> {
    const [newEvent] = await db.insert(calendarEvents).values(event).returning();
    return newEvent;
  }

  async updateEvent(id: number, event: Partial<InsertCalendarEvent>): Promise<CalendarEvent | undefined> {
    const [updated] = await db.update(calendarEvents).set(event).where(eq(calendarEvents.id, id)).returning();
    return updated || undefined;
  }

  async deleteEvent(id: number): Promise<boolean> {
    const result = await db.delete(calendarEvents).where(eq(calendarEvents.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Tasks
  async getAllTasks(): Promise<Task[]> {
    return await db.select().from(tasks).orderBy(desc(tasks.createdAt));
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined> {
    const [updated] = await db.update(tasks).set(task).where(eq(tasks.id, id)).returning();
    return updated || undefined;
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Proposals
  async getAllProposals(): Promise<Proposal[]> {
    return await db.select().from(proposals).orderBy(desc(proposals.createdAt));
  }

  async getProposal(id: number): Promise<Proposal | undefined> {
    const [proposal] = await db.select().from(proposals).where(eq(proposals.id, id));
    return proposal || undefined;
  }

  async createProposal(proposal: InsertProposal): Promise<Proposal> {
    const [newProposal] = await db.insert(proposals).values(proposal).returning();
    return newProposal;
  }

  async updateProposal(id: number, proposal: Partial<InsertProposal>): Promise<Proposal | undefined> {
    const [updated] = await db.update(proposals).set(proposal).where(eq(proposals.id, id)).returning();
    return updated || undefined;
  }

  async deleteProposal(id: number): Promise<boolean> {
    const result = await db.delete(proposals).where(eq(proposals.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Chat Messages
  async getMessagesBySession(sessionId: string): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(chatMessages.createdAt);
  }

  async createMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    return newMessage;
  }

  // Notes
  async getAllNotes(): Promise<Note[]> {
    return await db.select().from(notes).orderBy(asc(notes.position));
  }

  async createNote(note: InsertNote): Promise<Note> {
    const allNotes = await this.getAllNotes();
    const maxPosition = allNotes.length > 0 ? Math.max(...allNotes.map(n => n.position)) : -1;
    const [newNote] = await db.insert(notes).values({ ...note, position: maxPosition + 1 }).returning();
    return newNote;
  }

  async updateNote(id: number, note: Partial<InsertNote>): Promise<Note | undefined> {
    const [updated] = await db.update(notes).set(note).where(eq(notes.id, id)).returning();
    return updated || undefined;
  }

  async deleteNote(id: number): Promise<boolean> {
    const result = await db.delete(notes).where(eq(notes.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async reorderNotes(noteIds: number[]): Promise<void> {
    for (let i = 0; i < noteIds.length; i++) {
      await db.update(notes).set({ position: i }).where(eq(notes.id, noteIds[i]));
    }
  }

  // ===== COURSES (Study Wheel) =====
  async getAllCourses(): Promise<Course[]> {
    return await db.select().from(courses).orderBy(asc(courses.position));
  }

  async getActiveCourses(): Promise<Course[]> {
    return await db.select().from(courses)
      .where(eq(courses.active, true))
      .orderBy(asc(courses.position));
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || undefined;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const allCourses = await this.getAllCourses();
    const maxPosition = allCourses.length > 0 ? Math.max(...allCourses.map(c => c.position)) : -1;
    const [newCourse] = await db.insert(courses)
      .values({ ...course, position: maxPosition + 1 })
      .returning();
    return newCourse;
  }

  async updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course | undefined> {
    const [updated] = await db.update(courses).set(course).where(eq(courses.id, id)).returning();
    return updated || undefined;
  }

  async deleteCourse(id: number): Promise<boolean> {
    const result = await db.delete(courses).where(eq(courses.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // ===== STUDY WHEEL - Round-Robin Rotation =====
  // Logic: Get current course from wheel state, or first active course if none set
  async getCurrentCourse(): Promise<Course | undefined> {
    const [state] = await db.select().from(studyWheelState);
    const activeCourses = await this.getActiveCourses();
    
    if (activeCourses.length === 0) return undefined;
    
    if (!state || !state.currentCourseId) {
      // No state yet, return first active course
      return activeCourses[0];
    }
    
    // Find current course in active list
    const current = activeCourses.find(c => c.id === state.currentCourseId);
    return current || activeCourses[0];
  }

  // Rotate to next course in round-robin order
  async rotateToNextCourse(): Promise<Course | undefined> {
    const activeCourses = await this.getActiveCourses();
    if (activeCourses.length === 0) return undefined;
    
    const [state] = await db.select().from(studyWheelState);
    
    let nextCourse: Course;
    if (!state || !state.currentCourseId) {
      // Start with first course
      nextCourse = activeCourses[0];
    } else {
      // Find current index and rotate to next
      const currentIndex = activeCourses.findIndex(c => c.id === state.currentCourseId);
      const nextIndex = (currentIndex + 1) % activeCourses.length;
      nextCourse = activeCourses[nextIndex];
    }
    
    // Update or insert wheel state
    if (state) {
      await db.update(studyWheelState)
        .set({ currentCourseId: nextCourse.id, lastUpdated: new Date() })
        .where(eq(studyWheelState.id, state.id));
    } else {
      await db.insert(studyWheelState)
        .values({ currentCourseId: nextCourse.id });
    }
    
    return nextCourse;
  }

  // ===== SESSION WITH MINUTES =====
  // Creates session, updates course stats, rotates wheel
  async createSessionWithMinutes(courseId: number, minutes: number, mode: string = "study"): Promise<Session> {
    const course = await this.getCourse(courseId);
    if (!course) throw new Error("Course not found");
    
    // Create session
    const [newSession] = await db.insert(sessions).values({
      date: new Date(),
      topic: course.name,
      courseId: courseId,
      mode: mode,
      duration: `${minutes} min`,
      minutes: minutes,
      errors: 0,
      cards: 0,
    }).returning();
    
    // Update course stats
    await db.update(courses).set({
      totalSessions: course.totalSessions + 1,
      totalMinutes: course.totalMinutes + minutes,
    }).where(eq(courses.id, courseId));
    
    // Update streak
    await this.updateStreakOnSession();
    
    // Rotate to next course
    await this.rotateToNextCourse();
    
    return newSession;
  }

  async getTodaysSessions(): Promise<Session[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return await db.select().from(sessions)
      .where(and(
        gte(sessions.date, today),
        lte(sessions.date, tomorrow)
      ))
      .orderBy(desc(sessions.date));
  }

  // ===== STREAK TRACKING =====
  // Day is successful if >= 1 session logged
  async getStreak(): Promise<{ currentStreak: number; longestStreak: number; lastStudyDate: Date | null }> {
    const [streak] = await db.select().from(studyStreak);
    if (!streak) {
      return { currentStreak: 0, longestStreak: 0, lastStudyDate: null };
    }
    return {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastStudyDate: streak.lastStudyDate,
    };
  }

  async updateStreakOnSession(): Promise<void> {
    const [existing] = await db.select().from(studyStreak);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!existing) {
      // First ever session
      await db.insert(studyStreak).values({
        currentStreak: 1,
        longestStreak: 1,
        lastStudyDate: new Date(),
      });
      return;
    }
    
    const lastDate = existing.lastStudyDate ? new Date(existing.lastStudyDate) : null;
    if (lastDate) {
      lastDate.setHours(0, 0, 0, 0);
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let newStreak = existing.currentStreak;
    
    if (lastDate && lastDate.getTime() === today.getTime()) {
      // Already studied today, no change to streak
    } else if (lastDate && lastDate.getTime() === yesterday.getTime()) {
      // Consecutive day, increment streak
      newStreak = existing.currentStreak + 1;
    } else {
      // Streak broken or first day, reset to 1
      newStreak = 1;
    }
    
    const newLongest = Math.max(newStreak, existing.longestStreak);
    
    await db.update(studyStreak).set({
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastStudyDate: new Date(),
      updatedAt: new Date(),
    }).where(eq(studyStreak.id, existing.id));
  }

  // ===== WEAKNESS QUEUE (Read-Only) =====
  async getWeaknessQueue(): Promise<{ id: number; topic: string; reason: string | null }[]> {
    const items = await db.select().from(weaknessQueue).orderBy(desc(weaknessQueue.flaggedAt));
    return items.map(item => ({
      id: item.id,
      topic: item.topic,
      reason: item.reason,
    }));
  }

  // ===== BRAIN ANALYTICS =====
  // Derives all metrics from WRAP session fields
  async getBrainMetrics(): Promise<{
    sessionsPerCourse: { course: string; count: number; minutes: number }[];
    modeDistribution: { mode: string; count: number; minutes: number }[];
    recentConfusions: { text: string; count: number; course: string }[];
    recentWeakAnchors: { text: string; count: number; course: string }[];
    conceptFrequency: { concept: string; count: number }[];
    issuesLog: { issue: string; count: number; course: string }[];
    totalMinutes: number;
    totalSessions: number;
    totalCards: number;
  }> {
    const allSessions = await db.select().from(sessions).orderBy(desc(sessions.date));
    
    // Sessions per course (derived from WRAP: course field)
    const courseMap = new Map<string, { count: number; minutes: number }>();
    allSessions.forEach(s => {
      const existing = courseMap.get(s.topic) || { count: 0, minutes: 0 };
      courseMap.set(s.topic, {
        count: existing.count + 1,
        minutes: existing.minutes + (s.minutes || 0),
      });
    });
    const sessionsPerCourse = Array.from(courseMap.entries())
      .map(([course, data]) => ({ course, ...data }))
      .sort((a, b) => b.count - a.count);

    // Mode distribution (derived from WRAP: mode field)
    const modeMap = new Map<string, { count: number; minutes: number }>();
    allSessions.forEach(s => {
      const existing = modeMap.get(s.mode) || { count: 0, minutes: 0 };
      modeMap.set(s.mode, {
        count: existing.count + 1,
        minutes: existing.minutes + (s.minutes || 0),
      });
    });
    const modeDistribution = Array.from(modeMap.entries())
      .map(([mode, data]) => ({ mode, ...data }))
      .sort((a, b) => b.count - a.count);

    // Aggregate confusions (derived from WRAP: confusions array)
    const confusionMap = new Map<string, { count: number; course: string }>();
    allSessions.forEach(s => {
      (s.confusions || []).forEach(c => {
        const key = c.toLowerCase().trim();
        const existing = confusionMap.get(key);
        if (existing) {
          existing.count++;
        } else {
          confusionMap.set(key, { count: 1, course: s.topic });
        }
      });
    });
    const recentConfusions = Array.from(confusionMap.entries())
      .map(([text, data]) => ({ text, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    // Aggregate weak anchors (derived from WRAP: weakAnchors array)
    const weakAnchorMap = new Map<string, { count: number; course: string }>();
    allSessions.forEach(s => {
      (s.weakAnchors || []).forEach(w => {
        const key = w.toLowerCase().trim();
        const existing = weakAnchorMap.get(key);
        if (existing) {
          existing.count++;
        } else {
          weakAnchorMap.set(key, { count: 1, course: s.topic });
        }
      });
    });
    const recentWeakAnchors = Array.from(weakAnchorMap.entries())
      .map(([text, data]) => ({ text, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    // Concept frequency (derived from WRAP: concepts array)
    const conceptMap = new Map<string, number>();
    allSessions.forEach(s => {
      (s.concepts || []).forEach(c => {
        const key = c.toLowerCase().trim();
        conceptMap.set(key, (conceptMap.get(key) || 0) + 1);
      });
    });
    const conceptFrequency = Array.from(conceptMap.entries())
      .map(([concept, count]) => ({ concept, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 30);

    // Issues log (derived from WRAP: issues array)
    const issueMap = new Map<string, { count: number; course: string }>();
    allSessions.forEach(s => {
      (s.issues || []).forEach(i => {
        const key = i.toLowerCase().trim();
        const existing = issueMap.get(key);
        if (existing) {
          existing.count++;
        } else {
          issueMap.set(key, { count: 1, course: s.topic });
        }
      });
    });
    const issuesLog = Array.from(issueMap.entries())
      .map(([issue, data]) => ({ issue, ...data }))
      .sort((a, b) => b.count - a.count);

    // Totals (derived from WRAP: minutes, cards fields)
    const totalMinutes = allSessions.reduce((sum, s) => sum + (s.minutes || 0), 0);
    const totalSessions = allSessions.length;
    const totalCards = allSessions.reduce((sum, s) => sum + (s.cards || 0), 0);

    return {
      sessionsPerCourse,
      modeDistribution,
      recentConfusions,
      recentWeakAnchors,
      conceptFrequency,
      issuesLog,
      totalMinutes,
      totalSessions,
      totalCards,
    };
  }

  // ===== SCHEDULE EVENTS =====
  async getScheduleEventsByCourse(courseId: number): Promise<ScheduleEvent[]> {
    return await db.select().from(scheduleEvents)
      .where(eq(scheduleEvents.courseId, courseId))
      .orderBy(asc(scheduleEvents.dueDate));
  }

  async createScheduleEvent(event: InsertScheduleEvent): Promise<ScheduleEvent> {
    const [newEvent] = await db.insert(scheduleEvents).values(event).returning();
    return newEvent;
  }

  async createScheduleEventsBulk(events: InsertScheduleEvent[]): Promise<ScheduleEvent[]> {
    if (events.length === 0) return [];
    const newEvents = await db.insert(scheduleEvents).values(events).returning();
    return newEvents;
  }

  async updateScheduleEvent(id: number, event: Partial<InsertScheduleEvent>): Promise<ScheduleEvent | undefined> {
    const [updated] = await db.update(scheduleEvents)
      .set({ ...event, updatedAt: new Date() })
      .where(eq(scheduleEvents.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteScheduleEvent(id: number): Promise<boolean> {
    const result = await db.delete(scheduleEvents).where(eq(scheduleEvents.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // ===== MODULES =====
  async getModulesByCourse(courseId: number): Promise<Module[]> {
    return await db.select().from(modules)
      .where(eq(modules.courseId, courseId))
      .orderBy(asc(modules.orderIndex));
  }

  async getModule(id: number): Promise<Module | undefined> {
    const [module] = await db.select().from(modules).where(eq(modules.id, id));
    return module || undefined;
  }

  async createModule(module: InsertModule): Promise<Module> {
    const existingModules = await this.getModulesByCourse(module.courseId);
    const maxOrder = existingModules.length > 0
      ? Math.max(...existingModules.map(m => m.orderIndex))
      : -1;
    const [newModule] = await db.insert(modules)
      .values({ ...module, orderIndex: maxOrder + 1 })
      .returning();
    return newModule;
  }

  async createModulesBulk(modulesData: InsertModule[]): Promise<Module[]> {
    if (modulesData.length === 0) return [];
    const withOrder = modulesData.map((m, i) => ({ ...m, orderIndex: i }));
    const newModules = await db.insert(modules).values(withOrder).returning();
    return newModules;
  }

  async updateModule(id: number, module: Partial<InsertModule>): Promise<Module | undefined> {
    const [updated] = await db.update(modules)
      .set({ ...module, updatedAt: new Date() })
      .where(eq(modules.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteModule(id: number): Promise<boolean> {
    const result = await db.delete(modules).where(eq(modules.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // ===== LEARNING OBJECTIVES =====
  async getLearningObjectivesByCourse(courseId: number): Promise<LearningObjective[]> {
    return await db.select().from(learningObjectives)
      .where(eq(learningObjectives.courseId, courseId))
      .orderBy(asc(learningObjectives.loCode));
  }

  async getLearningObjectivesByModule(moduleId: number): Promise<LearningObjective[]> {
    return await db.select().from(learningObjectives)
      .where(eq(learningObjectives.moduleId, moduleId))
      .orderBy(asc(learningObjectives.loCode));
  }

  async getLearningObjective(id: number): Promise<LearningObjective | undefined> {
    const [lo] = await db.select().from(learningObjectives).where(eq(learningObjectives.id, id));
    return lo || undefined;
  }

  async createLearningObjective(lo: InsertLearningObjective): Promise<LearningObjective> {
    const [newLo] = await db.insert(learningObjectives).values(lo).returning();
    return newLo;
  }

  async createLearningObjectivesBulk(los: InsertLearningObjective[]): Promise<LearningObjective[]> {
    if (los.length === 0) return [];
    const newLos = await db.insert(learningObjectives).values(los).returning();
    return newLos;
  }

  async updateLearningObjective(id: number, lo: Partial<InsertLearningObjective>): Promise<LearningObjective | undefined> {
    const [updated] = await db.update(learningObjectives)
      .set({ ...lo, updatedAt: new Date() })
      .where(eq(learningObjectives.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteLearningObjective(id: number): Promise<boolean> {
    const result = await db.delete(learningObjectives).where(eq(learningObjectives.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // ===== LO SESSIONS =====
  async createLoSession(loSession: InsertLoSession): Promise<LoSession> {
    const [newLoSession] = await db.insert(loSessions).values(loSession).returning();
    return newLoSession;
  }

  async getLoSessionsByLo(loId: number): Promise<LoSession[]> {
    return await db.select().from(loSessions)
      .where(eq(loSessions.loId, loId))
      .orderBy(desc(loSessions.createdAt));
  }

  async getLoSessionsBySession(sessionId: number): Promise<LoSession[]> {
    return await db.select().from(loSessions)
      .where(eq(loSessions.sessionId, sessionId));
  }

  // ===== SESSION CONTEXT =====
  async getLastSessionContext(courseId?: number): Promise<{
    lastSession: Session | null;
    course: Course | null;
    recentLos: LearningObjective[];
  }> {
    let lastSession: Session | null = null;
    let course: Course | null = null;
    let recentLos: LearningObjective[] = [];

    if (courseId) {
      const [session] = await db.select().from(sessions)
        .where(eq(sessions.courseId, courseId))
        .orderBy(desc(sessions.date))
        .limit(1);
      lastSession = session || null;

      const courseData = await this.getCourse(courseId);
      course = courseData || null;

      recentLos = await db.select().from(learningObjectives)
        .where(and(
          eq(learningObjectives.courseId, courseId),
          sql`${learningObjectives.status} IN ('in_progress', 'need_review')`
        ))
        .orderBy(desc(learningObjectives.lastSessionDate))
        .limit(5);
    } else {
      const [session] = await db.select().from(sessions)
        .orderBy(desc(sessions.date))
        .limit(1);
      lastSession = session || null;

      if (lastSession?.courseId) {
        const courseData = await this.getCourse(lastSession.courseId);
        course = courseData || null;

        recentLos = await db.select().from(learningObjectives)
          .where(and(
            eq(learningObjectives.courseId, lastSession.courseId),
            sql`${learningObjectives.status} IN ('in_progress', 'need_review')`
          ))
          .orderBy(desc(learningObjectives.lastSessionDate))
          .limit(5);
      }
    }

    return { lastSession, course, recentLos };
  }
}

export const storage = new DatabaseStorage();
