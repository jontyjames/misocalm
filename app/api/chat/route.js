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
3. Offer practical coping strategies when appropriate
4. If they seem distressed, gently suggest a breathing exercise or grounding technique
5. Never suggest "just ignoring" the sound or that they're overreacting
6. Keep responses concise (2-3 sentences) unless they want to talk more
7. If they mention self-harm or severe distress, encourage professional support
8. Always respond with empathy and understanding`;

export async function POST(request) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    // Verify user authentication via Supabase
    let userId = null;
    if (token) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        userId = user.id;
      }
    }

    // If no token in header, try to get from cookies (browser requests)
    if (!userId) {
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        // Supabase stores auth in cookies for browser sessions
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          userId = session.user.id;
        }
      }
    }

    // For now, allow unauthenticated requests but use IP for rate limiting
    // In production, you may want to require authentication
    const rateLimitKey = userId ||
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'anonymous';

    // Check rate limit
    const rateLimitResult = checkRateLimit(rateLimitKey, chatRateLimit);
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const { message, userName, severityLevel, triggersList, recentTrigger } = await request.json();

    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    // Build user context
    let userContext = '';
    if (userName) userContext += `User's name: ${userName}\n`;
    if (severityLevel) userContext += `Severity level: ${severityLevel}/10\n`;
    if (triggersList) userContext += `Known triggers: ${triggersList}\n`;
    if (recentTrigger) userContext += `Recent trigger: ${recentTrigger}\n`;

    const systemMessage = userContext
      ? `${SYSTEM_PROMPT}\n\nUser's profile:\n${userContext}`
      : SYSTEM_PROMPT;

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 300,
      system: systemMessage,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
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
