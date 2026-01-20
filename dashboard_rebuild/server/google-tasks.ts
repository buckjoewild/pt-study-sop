import { google } from 'googleapis';
import { getAuthenticatedClient, isConnected } from './google-oauth';

async function getGoogleTasksClient() {
  const auth = await getAuthenticatedClient();
  return google.tasks({ version: 'v1', auth });
}

export interface GoogleTask {
  id?: string;
  title: string;
  notes?: string;
  status?: 'needsAction' | 'completed';
  due?: string;
  completed?: string;
}

export async function getTaskLists() {
  const connected = await isConnected();
  if (!connected) {
    return [];
  }
  
  try {
    const tasksClient = await getGoogleTasksClient();
    const response = await tasksClient.tasklists.list();
    return response.data.items || [];
  } catch (err) {
    console.error('Error fetching task lists:', err);
    return [];
  }
}

export async function getTasks(taskListId: string = '@default') {
  const connected = await isConnected();
  if (!connected) {
    return [];
  }
  
  try {
    const tasksClient = await getGoogleTasksClient();
    const response = await tasksClient.tasks.list({
      tasklist: taskListId,
      showCompleted: true,
      showHidden: false,
    });
    return response.data.items || [];
  } catch (err) {
    console.error('Error fetching tasks:', err);
    return [];
  }
}

export async function createTask(task: GoogleTask, taskListId: string = '@default') {
  const tasksClient = await getGoogleTasksClient();
  const response = await tasksClient.tasks.insert({
    tasklist: taskListId,
    requestBody: {
      title: task.title,
      notes: task.notes,
      status: task.status || 'needsAction',
      due: task.due,
    },
  });
  return response.data;
}

export async function updateTask(taskId: string, task: Partial<GoogleTask>, taskListId: string = '@default') {
  const tasksClient = await getGoogleTasksClient();
  const response = await tasksClient.tasks.patch({
    tasklist: taskListId,
    task: taskId,
    requestBody: {
      title: task.title,
      notes: task.notes,
      status: task.status,
      due: task.due,
    },
  });
  return response.data;
}

export async function deleteTask(taskId: string, taskListId: string = '@default') {
  const tasksClient = await getGoogleTasksClient();
  await tasksClient.tasks.delete({
    tasklist: taskListId,
    task: taskId,
  });
}

export async function toggleTaskStatus(taskId: string, completed: boolean, taskListId: string = '@default') {
  const tasksClient = await getGoogleTasksClient();
  const response = await tasksClient.tasks.patch({
    tasklist: taskListId,
    task: taskId,
    requestBody: {
      status: completed ? 'completed' : 'needsAction',
      completed: completed ? new Date().toISOString() : undefined,
    },
  });
  return response.data;
}
