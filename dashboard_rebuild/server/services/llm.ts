import type { BrainMetrics } from '../storage';

export async function sendChatMessage(
  message: string,
  brainMetrics: BrainMetrics
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  console.log('API Key from env:', apiKey ? `${apiKey.substring(0, 20)}...` : 'NOT FOUND');
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not configured');

  // Build system context from brain metrics
  const systemContext = buildSystemPrompt(brainMetrics);

  // Call OpenRouter API
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:5000', // Required by OpenRouter
      'X-Title': 'PT Study Tracker' // Required by OpenRouter
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        { role: 'system', content: systemContext },
        { role: 'user', content: message }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function buildSystemPrompt(metrics: BrainMetrics): string {
  return `You are a study assistant for a PT student using the WRAP methodology (Write, Record, Anchor, Practice).

Your role is to:
1. Analyze their study patterns from session data
2. Help them parse and log study session data (when they paste WRAP notes from ChatGPT)
3. Identify trends in confusions, weak anchors, and concept mastery
4. Provide actionable study advice

Current Statistics:
- Total study time: ${metrics.totalMinutes} minutes across ${metrics.totalSessions} sessions
- Total flashcards created: ${metrics.totalCards}
- Sessions per course: ${JSON.stringify(metrics.sessionsPerCourse)}
- Mode distribution: ${JSON.stringify(metrics.modeDistribution)}

${metrics.recentConfusions.length > 0 ? `Recent Confusions (concepts needing attention): ${metrics.recentConfusions.map(c => `${c.text} (${c.course}, ${c.count}x)`).join(', ')}` : ''}

${metrics.recentWeakAnchors.length > 0 ? `Weak Anchors (topics needing review): ${metrics.recentWeakAnchors.map(w => `${w.text} (${w.course}, ${w.count}x)`).join(', ')}` : ''}

${metrics.conceptFrequency.length > 0 ? `Top Concepts Studied: ${metrics.conceptFrequency.slice(0, 10).map(c => `${c.concept} (${c.count}x)`).join(', ')}` : ''}

${metrics.issuesLog.length > 0 ? `Recent Issues: ${metrics.issuesLog.map(i => `${i.issue} (${i.course}, ${i.count}x)`).join(', ')}` : ''}

When the user pastes WRAP data, help them understand what was captured and offer to create a session entry (you'll need to tell them to use the Edit feature on the Brain page to manually enter it for now).`;
}

export async function checkConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return { connected: false, error: 'API key not configured' };
    }

    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:5000',
        'X-Title': 'PT Study Tracker'
      }
    });

    return {
      connected: response.ok,
      error: response.ok ? undefined : `HTTP ${response.status}`
    };
  } catch (error: any) {
    return { connected: false, error: error.message };
  }
}
