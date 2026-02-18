/**
 * useChat Hook
 * Manages chat messages with persistence
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { chatService } from '@/services';
import { supabase } from '@/services/supabase';

export function useChat(userId, options = {}) {
  const { autoLoad = true, messageLimit = 50 } = options;

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(autoLoad);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const initialLoadDone = useRef(false);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  /**
   * Load chat history from database
   */
  const loadHistory = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await chatService.getRecent(userId, messageLimit);

    if (fetchError) {
      setError(fetchError);
    } else {
      setMessages(
        (data || []).map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          createdAt: msg.created_at,
        }))
      );
    }

    setLoading(false);
    initialLoadDone.current = true;
  }, [userId, messageLimit]);

  /**
   * Add a message locally (for optimistic updates)
   */
  const addLocalMessage = useCallback((role, content, { isError = false } = {}) => {
    const tempId = `temp-${Date.now()}`;
    const message = {
      id: tempId,
      role,
      content,
      createdAt: new Date().toISOString(),
      isError,
    };
    setMessages((prev) => [...prev, message]);
    return tempId;
  }, []);

  /**
   * Save a user message
   */
  const saveUserMessage = useCallback(
    async (content) => {
      if (!userId) return { error: 'Not authenticated' };

      const result = await chatService.saveUserMessage(userId, content);
      return result;
    },
    [userId]
  );

  /**
   * Save an assistant message
   */
  const saveAssistantMessage = useCallback(
    async (content) => {
      if (!userId) return { error: 'Not authenticated' };

      const result = await chatService.saveAssistantMessage(userId, content);
      return result;
    },
    [userId]
  );

  /**
   * Send a message and get AI response
   * Handles both local state updates and persistence
   */
  const sendMessage = useCallback(
    async (content, apiOptions = {}) => {
      if (!userId || !content.trim()) return { error: 'Invalid message' };

      setSending(true);
      setError(null);

      // Add user message locally (optimistic)
      addLocalMessage('user', content);

      // Save user message to database
      const userSaveResult = await saveUserMessage(content);
      if (userSaveResult.error) {
        console.error('Failed to save user message:', userSaveResult.error);
        // Continue anyway - we want to show the response
      }

      try {
        // Build conversation history for context (last 20 messages)
        const recentMessages = messagesRef.current.slice(-20).map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        // Get auth token for API call
        const { data: { session } } = await supabase.auth.getSession();

        // Call chat API
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            message: content,
            conversationHistory: recentMessages,
            ...apiOptions,
          }),
        });

        const data = await response.json();

        if (!response.ok || data.error) {
          throw new Error(data.error || 'Failed to get response');
        }

        // Add assistant message locally
        addLocalMessage('assistant', data.response);

        // Save assistant message to database
        const assistantSaveResult = await saveAssistantMessage(data.response);
        if (assistantSaveResult.error) {
          console.error('Failed to save assistant message:', assistantSaveResult.error);
        }

        setSending(false);
        return { response: data.response, error: null };
      } catch (err) {
        const errorMessage = err.message || 'Failed to send message';
        setError(errorMessage);
        setSending(false);

        // Add error message locally (marked as error so UI can style differently)
        addLocalMessage(
          'assistant',
          "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
          { isError: true }
        );

        return { response: null, error: errorMessage };
      }
    },
    [userId, addLocalMessage, saveUserMessage, saveAssistantMessage]
  );

  /**
   * Clear all messages
   */
  const clearMessages = useCallback(async () => {
    if (!userId) return { error: 'Not authenticated' };

    setError(null);
    const result = await chatService.clearHistory(userId);

    if (result.error) {
      setError(result.error);
    } else {
      setMessages([]);
    }

    return result;
  }, [userId]);

  /**
   * Add initial greeting message
   */
  const addGreeting = useCallback((userName) => {
    if (messages.length === 0 && initialLoadDone.current) {
      const greeting = `Hi ${userName || 'there'}! I'm Miso, your support companion. I'm here to listen and help whenever you need. How are you feeling right now?`;
      setMessages([
        {
          id: 'greeting',
          role: 'assistant',
          content: greeting,
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  }, [messages.length]);

  // Auto-load history on mount
  useEffect(() => {
    if (autoLoad && userId) {
      loadHistory();
    }
  }, [autoLoad, userId, loadHistory]);

  return {
    messages,
    loading,
    sending,
    error,
    loadHistory,
    sendMessage,
    addLocalMessage,
    clearMessages,
    addGreeting,
    refresh: loadHistory,
  };
}

export default useChat;
