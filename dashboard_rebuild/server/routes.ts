import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sendChatMessage, checkConnection } from "./services/llm";
import {
  insertSessionSchema,
  insertCalendarEventSchema,
  insertTaskSchema,
  insertProposalSchema,
  insertChatMessageSchema,
  insertNoteSchema,
  insertCourseSchema
} from "../schema";
import { getAuthUrl, handleCallback, isConnected, deleteTokens } from "./google-oauth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ===== SESSIONS =====
  app.get("/api/sessions", async (_req, res) => {
    try {
      const sessions = await storage.getAllSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  app.get("/api/sessions/stats", async (_req, res) => {
    try {
      const stats = await storage.getSessionStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch session stats" });
    }
  });

  app.get("/api/sessions/today", async (_req, res) => {
    try {
      const sessions = await storage.getTodaysSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch today's sessions" });
    }
  });

  app.get("/api/sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const session = await storage.getSession(id);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch session" });
    }
  });

  app.post("/api/sessions", async (req, res) => {
    try {
      const validated = insertSessionSchema.parse(req.body);
      const session = await storage.createSession(validated);
      res.status(201).json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid session data" });
    }
  });

  app.patch("/api/sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validated = insertSessionSchema.partial().parse(req.body);
      const session = await storage.updateSession(id, validated);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid session data" });
    }
  });

  app.delete("/api/sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteSession(id);
      if (!deleted) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete session" });
    }
  });

  // ===== COURSES (Study Wheel) =====
  app.get("/api/courses", async (_req, res) => {
    try {
      const courseList = await storage.getAllCourses();
      res.json(courseList);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/active", async (_req, res) => {
    try {
      const courseList = await storage.getActiveCourses();
      res.json(courseList);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const course = await storage.getCourse(id);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch course" });
    }
  });

  app.post("/api/courses", async (req, res) => {
    try {
      const validated = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(validated);
      res.status(201).json(course);
    } catch (error) {
      res.status(400).json({ error: "Invalid course data" });
    }
  });

  app.patch("/api/courses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validated = insertCourseSchema.partial().parse(req.body);
      const course = await storage.updateCourse(id, validated);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(400).json({ error: "Invalid course data" });
    }
  });

  app.delete("/api/courses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCourse(id);
      if (!deleted) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete course" });
    }
  });

  // ===== STUDY WHEEL =====
  app.get("/api/study-wheel/current", async (_req, res) => {
    try {
      const current = await storage.getCurrentCourse();
      res.json({ currentCourse: current || null });
    } catch (error) {
      res.status(500).json({ error: "Failed to get current course" });
    }
  });

  // Complete session: logs minutes, updates stats, rotates wheel
  app.post("/api/study-wheel/complete-session", async (req, res) => {
    try {
      const { courseId, minutes, mode } = req.body;
      if (!courseId || !minutes || typeof minutes !== 'number' || minutes < 1) {
        return res.status(400).json({ error: "courseId and minutes (positive number) required" });
      }
      const session = await storage.createSessionWithMinutes(courseId, minutes, mode || "study");
      const nextCourse = await storage.getCurrentCourse();
      res.json({ session, nextCourse });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to complete session" });
    }
  });

  // ===== STREAK =====
  app.get("/api/streak", async (_req, res) => {
    try {
      const streak = await storage.getStreak();
      res.json(streak);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch streak" });
    }
  });

  // ===== WEAKNESS QUEUE =====
  app.get("/api/weakness-queue", async (_req, res) => {
    try {
      const queue = await storage.getWeaknessQueue();
      res.json(queue);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch weakness queue" });
    }
  });

  // ===== BRAIN ANALYTICS =====
  // Returns derived metrics from WRAP session fields
  app.get("/api/brain/metrics", async (_req, res) => {
    try {
      const metrics = await storage.getBrainMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch brain metrics" });
    }
  });

  // LLM Chat endpoint - integrated with OpenRouter API
  app.post("/api/brain/chat", async (req, res) => {
    try {
      const { message, syncToObsidian } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "message (string) required" });
      }

      // Get current brain metrics for context
      const metrics = await storage.getBrainMetrics();

      // Call LLM service with brain metrics context
      const response = await sendChatMessage(message, metrics);

      // Chat history is kept ephemeral (not saved to database per user preference)
      res.json({
        response,
        isStub: false
      });
    } catch (error: any) {
      console.error('LLM chat error:', error);
      res.status(500).json({
        error: 'Failed to process chat message',
        details: error.message
      });
    }
  });

  // Data ingest stub endpoint - placeholder for WRAP file parsing
  app.post("/api/brain/ingest", async (req, res) => {
    try {
      const { content, filename } = req.body;
      if (!content || typeof content !== 'string') {
        return res.status(400).json({ error: "content (string) required" });
      }
      // Stub response - will be replaced with actual parsing logic
      res.json({
        message: `Received file: ${filename || 'unnamed'}. LLM integration pending - this will parse and categorize your session data automatically.`,
        parsed: false,
        isStub: true
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to ingest data" });
    }
  });

  // LLM Connection Status endpoint - check if OpenRouter API is accessible
  app.get("/api/brain/llm-status", async (req, res) => {
    try {
      const { connected, error } = await checkConnection();

      res.json({
        connected,
        model: 'anthropic/claude-3.5-sonnet',
        status: connected ? 'Connected' : 'Disconnected',
        error
      });
    } catch (error: any) {
      res.json({
        connected: false,
        error: error.message,
        status: 'Error'
      });
    }
  });

  // ===== CALENDAR EVENTS =====
  app.get("/api/events", async (_req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEvent(id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch event" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      // Convert date strings to Date objects for Zod validation
      const body = { ...req.body };
      if (body.date && typeof body.date === 'string') {
        body.date = new Date(body.date);
      }
      if (body.endDate && typeof body.endDate === 'string') {
        body.endDate = new Date(body.endDate);
      }
      const validated = insertCalendarEventSchema.parse(body);
      const event = await storage.createEvent(validated);
      res.status(201).json(event);
    } catch (error) {
      console.error("Event creation error:", error);
      res.status(400).json({ error: "Invalid event data" });
    }
  });

  app.patch("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      // Convert date strings to Date objects for Zod validation
      const body = { ...req.body };
      if (body.date && typeof body.date === 'string') {
        body.date = new Date(body.date);
      }
      if (body.endDate && typeof body.endDate === 'string') {
        body.endDate = new Date(body.endDate);
      }
      const validated = insertCalendarEventSchema.partial().parse(body);
      const event = await storage.updateEvent(id, validated);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Event update error:", error);
      res.status(400).json({ error: "Invalid event data" });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteEvent(id);
      if (!deleted) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete event" });
    }
  });

  // ===== TASKS =====
  app.get("/api/tasks", async (_req, res) => {
    try {
      const tasks = await storage.getAllTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.getTask(id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch task" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const validated = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validated);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: "Invalid task data" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validated = insertTaskSchema.partial().parse(req.body);
      const task = await storage.updateTask(id, validated);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: "Invalid task data" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTask(id);
      if (!deleted) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  // ===== PROPOSALS =====
  app.get("/api/proposals", async (_req, res) => {
    try {
      const proposals = await storage.getAllProposals();
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch proposals" });
    }
  });

  app.get("/api/proposals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const proposal = await storage.getProposal(id);
      if (!proposal) {
        return res.status(404).json({ error: "Proposal not found" });
      }
      res.json(proposal);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch proposal" });
    }
  });

  app.post("/api/proposals", async (req, res) => {
    try {
      const validated = insertProposalSchema.parse(req.body);
      const proposal = await storage.createProposal(validated);
      res.status(201).json(proposal);
    } catch (error) {
      res.status(400).json({ error: "Invalid proposal data" });
    }
  });

  app.patch("/api/proposals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validated = insertProposalSchema.partial().parse(req.body);
      const proposal = await storage.updateProposal(id, validated);
      if (!proposal) {
        return res.status(404).json({ error: "Proposal not found" });
      }
      res.json(proposal);
    } catch (error) {
      res.status(400).json({ error: "Invalid proposal data" });
    }
  });

  app.delete("/api/proposals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProposal(id);
      if (!deleted) {
        return res.status(404).json({ error: "Proposal not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete proposal" });
    }
  });

  // ===== CHAT MESSAGES =====
  app.get("/api/chat/:sessionId", async (req, res) => {
    try {
      const messages = await storage.getMessagesBySession(req.params.sessionId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/chat/:sessionId", async (req, res) => {
    try {
      const validated = insertChatMessageSchema.parse({
        ...req.body,
        sessionId: req.params.sessionId,
      });
      const message = await storage.createMessage(validated);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ error: "Invalid message data" });
    }
  });

  // ===== GOOGLE CALENDAR =====
  app.get("/api/google-calendar/events", async (req, res) => {
    try {
      const { fetchGoogleCalendarEvents } = await import("./google-calendar");
      const timeMin = req.query.timeMin ? new Date(req.query.timeMin as string) : undefined;
      const timeMax = req.query.timeMax ? new Date(req.query.timeMax as string) : undefined;
      const events = await fetchGoogleCalendarEvents(timeMin, timeMax);
      res.json(events);
    } catch (error: any) {
      console.error("Google Calendar error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch Google Calendar events" });
    }
  });

  app.get("/api/google-calendar/calendars", async (req, res) => {
    try {
      const { getCalendarList } = await import("./google-calendar");
      const calendars = await getCalendarList();
      res.json(calendars);
    } catch (error: any) {
      console.error("Google Calendar error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch calendars" });
    }
  });

  // Create event on Google Calendar (two-way sync)
  app.post("/api/google-calendar/events", async (req, res) => {
    try {
      const { createGoogleCalendarEvent } = await import("./google-calendar");
      const { calendarId, summary, start, end, description, recurrence } = req.body;
      if (!summary || !start || !end) {
        return res.status(400).json({ error: "summary, start, and end are required" });
      }
      const event = await createGoogleCalendarEvent(calendarId || 'primary', {
        summary,
        start,
        end,
        description,
        recurrence,
      });
      res.status(201).json(event);
    } catch (error: any) {
      console.error("Google Calendar create error:", error);
      res.status(500).json({ error: error.message || "Failed to create event" });
    }
  });

  // Update event on Google Calendar (two-way sync)
  app.patch("/api/google-calendar/events/:calendarId/:eventId", async (req, res) => {
    try {
      const { updateGoogleCalendarEvent } = await import("./google-calendar");
      const { calendarId, eventId } = req.params;
      const event = await updateGoogleCalendarEvent(calendarId, eventId, req.body);
      res.json(event);
    } catch (error: any) {
      console.error("Google Calendar update error:", error);
      res.status(500).json({ error: error.message || "Failed to update event" });
    }
  });

  // Delete event on Google Calendar (two-way sync)
  app.delete("/api/google-calendar/events/:calendarId/:eventId", async (req, res) => {
    try {
      const { deleteGoogleCalendarEvent } = await import("./google-calendar");
      const { calendarId, eventId } = req.params;
      await deleteGoogleCalendarEvent(calendarId, eventId);
      res.status(204).send();
    } catch (error: any) {
      console.error("Google Calendar delete error:", error);
      res.status(500).json({ error: error.message || "Failed to delete event" });
    }
  });

  // ===== GOOGLE TASKS =====
  app.get("/api/google-tasks/lists", async (req, res) => {
    try {
      const { getTaskLists } = await import("./google-tasks");
      const lists = await getTaskLists();
      res.json(lists);
    } catch (error: any) {
      console.error("Google Tasks error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch task lists" });
    }
  });

  app.get("/api/google-tasks/:listId?", async (req, res) => {
    try {
      const { getTasks } = await import("./google-tasks");
      const listId = req.params.listId || '@default';
      const tasks = await getTasks(listId);
      res.json(tasks);
    } catch (error: any) {
      console.error("Google Tasks error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch tasks" });
    }
  });

  app.post("/api/google-tasks/:listId?", async (req, res) => {
    try {
      const { createTask } = await import("./google-tasks");
      const listId = req.params.listId || '@default';
      const task = await createTask(req.body, listId);
      res.status(201).json(task);
    } catch (error: any) {
      console.error("Google Tasks error:", error);
      res.status(500).json({ error: error.message || "Failed to create task" });
    }
  });

  app.patch("/api/google-tasks/:listId/:taskId", async (req, res) => {
    try {
      const { updateTask } = await import("./google-tasks");
      const { listId, taskId } = req.params;
      const task = await updateTask(taskId, req.body, listId);
      res.json(task);
    } catch (error: any) {
      console.error("Google Tasks error:", error);
      res.status(500).json({ error: error.message || "Failed to update task" });
    }
  });

  app.patch("/api/google-tasks/:listId/:taskId/toggle", async (req, res) => {
    try {
      const { toggleTaskStatus } = await import("./google-tasks");
      const { listId, taskId } = req.params;
      const { completed } = req.body;
      const task = await toggleTaskStatus(taskId, completed, listId);
      res.json(task);
    } catch (error: any) {
      console.error("Google Tasks error:", error);
      res.status(500).json({ error: error.message || "Failed to toggle task" });
    }
  });

  app.delete("/api/google-tasks/:listId/:taskId", async (req, res) => {
    try {
      const { deleteTask } = await import("./google-tasks");
      const { listId, taskId } = req.params;
      await deleteTask(taskId, listId);
      res.status(204).send();
    } catch (error: any) {
      console.error("Google Tasks error:", error);
      res.status(500).json({ error: error.message || "Failed to delete task" });
    }
  });

  // ===== NOTES =====
  app.get("/api/notes", async (_req, res) => {
    try {
      const notes = await storage.getAllNotes();
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  });

  app.post("/api/notes", async (req, res) => {
    try {
      const validated = insertNoteSchema.parse(req.body);
      const note = await storage.createNote(validated);
      res.status(201).json(note);
    } catch (error) {
      res.status(400).json({ error: "Invalid note data" });
    }
  });

  app.patch("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validated = insertNoteSchema.partial().parse(req.body);
      const note = await storage.updateNote(id, validated);
      if (!note) {
        return res.status(404).json({ error: "Note not found" });
      }
      res.json(note);
    } catch (error) {
      res.status(400).json({ error: "Invalid note data" });
    }
  });

  app.delete("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteNote(id);
      if (!deleted) {
        return res.status(404).json({ error: "Note not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete note" });
    }
  });

  app.post("/api/notes/reorder", async (req, res) => {
    try {
      const { noteIds } = req.body;
      if (!Array.isArray(noteIds)) {
        return res.status(400).json({ error: "noteIds must be an array" });
      }
      await storage.reorderNotes(noteIds);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to reorder notes" });
    }
  });

  // ===== GOOGLE OAUTH =====
  app.get("/api/google/status", async (_req, res) => {
    try {
      const connected = await isConnected();
      const hasCredentials = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
      res.json({ 
        configured: hasCredentials,
        connected
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to check Google status" });
    }
  });

  app.get("/api/google/auth", async (_req, res) => {
    try {
      const authUrl = getAuthUrl();
      res.json({ authUrl });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to generate auth URL" });
    }
  });

  app.get("/api/google/callback", async (req, res) => {
    try {
      const code = req.query.code as string;
      if (!code) {
        return res.status(400).send("Missing authorization code");
      }
      await handleCallback(code);
      res.redirect("/calendar?connected=true");
    } catch (error: any) {
      console.error("Google OAuth callback error:", error);
      res.redirect("/calendar?error=" + encodeURIComponent(error.message || "OAuth failed"));
    }
  });

  app.post("/api/google/disconnect", async (_req, res) => {
    try {
      await deleteTokens();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to disconnect Google" });
    }
  });

  return httpServer;
}
