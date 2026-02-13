/**
 * AI Chat Page
 * Chat with Miso, the AI support companion
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePremiumContext } from '@/context/PremiumContext';
import { useChat } from '@/hooks';
import { Button, Input, Spinner, PremiumGate } from '@/components/ui';
import { AppLayout, Logo } from '@/components/composed';
import { ROUTES } from '@/lib/constants';

export default function ChatPage() {
  const router = useRouter();
  const { user, profile, isAuthenticated, loading: authLoading } = useAuth();
  const {
    messages,
    loading: chatLoading,
    sending,
    sendMessage,
    addGreeting,
  } = useChat(user?.id);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, authLoading, router]);

  // Add initial greeting if no messages loaded
  useEffect(() => {
    if (profile && !chatLoading && messages.length === 0) {
      addGreeting(profile.name);
    }
  }, [profile, chatLoading, messages.length, addGreeting]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    const userMessage = input.trim();
    setInput('');

    await sendMessage(userMessage, {
      userName: profile?.name,
      severityLevel: profile?.severity_level,
    });
  };

  const { isPremium, isLoading: premiumLoading } = usePremiumContext();

  if (authLoading || chatLoading || premiumLoading) {
    return (
      <AppLayout showNav={false}>
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </AppLayout>
    );
  }

  if (!isPremium) {
    return (
      <AppLayout showNav={false}>
        <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-800">
          <button
            onClick={() => router.push(ROUTES.DASHBOARD)}
            className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-white font-light">MisoCalm AI</h1>
        </div>
        <PremiumGate feature="AI companion chat" />
      </AppLayout>
    );
  }

  return (
    <AppLayout showNav={false}>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-800">
          <button
            onClick={() => router.push(ROUTES.DASHBOARD)}
            className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Logo size="sm" animate />
          <div className="flex-1">
            <h1 className="text-white font-light">MisoCalm AI</h1>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-slate-400">Online</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id || msg.createdAt}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[80%] px-4 py-3 rounded-2xl
                  ${msg.role === 'user'
                    ? 'bg-primary-cta border border-indigo-500/30 text-white'
                    : 'bg-slate-700/80 text-white'
                  }
                `}
              >
                <p className="text-sm font-light whitespace-pre-wrap">
                  {msg.content}
                </p>
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex justify-start">
              <div className="bg-slate-800 px-4 py-3 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-800 bg-deep-space">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              size="icon"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
