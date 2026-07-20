/**
 * AI Chat API Route
 * Handles chat messages with Anthropic Claude
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import {
  rateLimit,
  checkRateLimit,
  rateLimitResponse,
  rateLimitHeaders,
} from '@/lib/rateLimit';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Create Supabase client for auth verification
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Rate limit configuration: 20 requests per minute per user
const chatRateLimit = rateLimit({ limit: 20, interval: 60000 });

const SYSTEM_PROMPT = `You are a compassionate AI support companion for someone with misophonia. Your name is Miso.

Guidelines:
1. Be warm, validating, and never dismissive of their experience
2. Acknowledge that misophonia is real and their reactions are not their fault
3. Offer one practical next step when appropriate
4. If they seem distressed, gently suggest Find My Calm, the Regulation Toolkit, Emergency Protocol, Physiological Sigh, or Grounding
5. Never suggest "just ignoring" the sound or that they're overreacting
6. Keep responses concise (2-3 sentences) unless they want to talk more
7. If they mention self-harm or severe distress, encourage professional support
8. Always respond with empathy and understanding
9. Do not diagnose, promise cures, or create exposure plans

App actions you can suggest by name:
- Find My Calm: fast physiological sigh reset
- Regulation Toolkit: full practice library
- Emergency Protocol: phrases and recovery steps for intense trigger moments
- Butterfly Tapping: bilateral tapping for rumination or anticipation
- Body Scan: noticing and softening body tension`;

const MODE_INSTRUCTIONS = {
  triggered_now: 'Mode: Triggered now. Validate first, keep it short, and suggest one body-based practice that can start immediately.',
  prepare: 'Mode: Preparing for a sound. Help them choose an exit plan, one phrase, and one recovery practice. Do not over-plan.',
  process: 'Mode: Processing afterward. Validate, reflect one pattern gently, and suggest journaling or one regulation practice.',
};

export function getMisoModeInstruction(misoMode) {
  return MODE_INSTRUCTIONS[misoMode] || MODE_INSTRUCTIONS.triggered_now;
}

export function buildMisoSystemMessage({ userContext = '', misoMode } = {}) {
  const modeInstruction = getMisoModeInstruction(misoMode);
  return userContext
    ? `${SYSTEM_PROMPT}\n\n${modeInstruction}\n\nUser's profile:\n${userContext}`
    : `${SYSTEM_PROMPT}\n\n${modeInstruction}`;
}

export async function POST(request) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    // Verify user authentication via Bearer token
    let userId = null;
    if (token) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        userId = user.id;
      }
    }

    if (!userId) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const rateLimitKey = userId;

    // Check rate limit
    const rateLimitResult = checkRateLimit(rateLimitKey, chatRateLimit);
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const { message, conversationHistory, userName, severityLevel, triggersList, recentTrigger, misoMode } = await request.json();

    // Input validation - prevent cost amplification
    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }
    if (typeof message !== 'string' || message.length > 2000) {
      return Response.json({ error: 'Message too long (max 2000 characters)' }, { status: 400 });
    }

    // Validate and truncate conversation history
    let validHistory = [];
    if (Array.isArray(conversationHistory)) {
      validHistory = conversationHistory
        .slice(-20)
        .filter(msg => (msg.role === 'user' || msg.role === 'assistant') && typeof msg.content === 'string')
        .map(msg => ({ role: msg.role, content: msg.content.slice(0, 2000) }));
    }

    // Truncate context fields
    const safeName = typeof userName === 'string' ? userName.slice(0, 100) : '';
    const safeTriggers = typeof triggersList === 'string' ? triggersList.slice(0, 500) : '';
    const safeRecentTrigger = typeof recentTrigger === 'string' ? recentTrigger.slice(0, 200) : '';

    // Build user context
    let userContext = '';
    if (safeName) userContext += `User's name: ${safeName}\n`;
    if (severityLevel) userContext += `Severity level: ${severityLevel}/10\n`;
    if (safeTriggers) userContext += `Known triggers: ${safeTriggers}\n`;
    if (safeRecentTrigger) userContext += `Recent trigger: ${safeRecentTrigger}\n`;

    const systemMessage = buildMisoSystemMessage({ userContext, misoMode });

    // Build multi-turn messages from validated history + current message
    const messages = [...validHistory, { role: 'user', content: message }];

    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 300,
      system: systemMessage,
      messages,
    });

    const assistantMessage = response.content[0]?.text || 'I apologize, but I was unable to generate a response. Please try again.';

    return Response.json(
      { response: assistantMessage },
      { headers: rateLimitHeaders(rateLimitResult) }
    );
  } catch (error) {
    console.error('Chat API error:', error);

    // Handle specific error types
    if (error.status === 401) {
      return Response.json({ error: 'API authentication failed' }, { status: 500 });
    }

    if (error.status === 429) {
      return Response.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
    }

    return Response.json(
      { error: 'Failed to generate response. Please try again.' },
      { status: 500 }
    );
  }
}
