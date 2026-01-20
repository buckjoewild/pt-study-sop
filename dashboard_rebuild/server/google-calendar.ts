import { google } from 'googleapis';
import { getAuthenticatedClient, isConnected } from './google-oauth';

async function getCalendarClient() {
  const auth = await getAuthenticatedClient();
  return google.calendar({ version: 'v3', auth });
}

export async function fetchGoogleCalendarEvents(timeMin?: Date, timeMax?: Date) {
  const connected = await isConnected();
  if (!connected) {
    return [];
  }
  
  const calendar = await getCalendarClient();
  
  const now = new Date();
  const startOfMonth = timeMin || new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = timeMax || new Date(now.getFullYear(), now.getMonth() + 2, 0);

  const calendarListResponse = await calendar.calendarList.list();
  const calendars = calendarListResponse.data.items || [];
  
  const allEventsPromises = calendars.map(async (cal) => {
    try {
      const response = await calendar.events.list({
        calendarId: cal.id!,
        timeMin: startOfMonth.toISOString(),
        timeMax: endOfMonth.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 250,
      });
      return (response.data.items || []).map(event => ({
        ...event,
        calendarId: cal.id,
        calendarSummary: cal.summary,
        calendarColor: cal.backgroundColor,
      }));
    } catch (err) {
      console.log(`Skipping calendar ${cal.summary}: ${err}`);
      return [];
    }
  });

  const allEventsArrays = await Promise.all(allEventsPromises);
  const allEvents = allEventsArrays.flat();
  
  allEvents.sort((a, b) => {
    const aStart = a.start?.dateTime || a.start?.date || '';
    const bStart = b.start?.dateTime || b.start?.date || '';
    return aStart.localeCompare(bStart);
  });

  return allEvents;
}

export async function getCalendarList() {
  const connected = await isConnected();
  if (!connected) {
    return [];
  }
  
  const calendar = await getCalendarClient();
  const response = await calendar.calendarList.list();
  return response.data.items || [];
}

export async function createGoogleCalendarEvent(
  calendarId: string,
  event: {
    summary: string;
    start: { dateTime?: string; date?: string; timeZone?: string };
    end: { dateTime?: string; date?: string; timeZone?: string };
    description?: string;
    recurrence?: string[];
  }
) {
  const connected = await isConnected();
  if (!connected) {
    throw new Error('Not connected to Google');
  }
  
  const calendar = await getCalendarClient();
  const response = await calendar.events.insert({
    calendarId: calendarId || 'primary',
    requestBody: event,
  });
  return response.data;
}

export async function updateGoogleCalendarEvent(
  calendarId: string,
  eventId: string,
  event: {
    summary?: string;
    start?: { dateTime?: string; date?: string; timeZone?: string };
    end?: { dateTime?: string; date?: string; timeZone?: string };
    description?: string;
  }
) {
  const connected = await isConnected();
  if (!connected) {
    throw new Error('Not connected to Google');
  }
  
  const calendar = await getCalendarClient();
  const response = await calendar.events.patch({
    calendarId: calendarId || 'primary',
    eventId,
    requestBody: event,
  });
  return response.data;
}

export async function deleteGoogleCalendarEvent(calendarId: string, eventId: string) {
  const connected = await isConnected();
  if (!connected) {
    throw new Error('Not connected to Google');
  }
  
  const calendar = await getCalendarClient();
  await calendar.events.delete({
    calendarId: calendarId || 'primary',
    eventId,
  });
}
