import React, { useState } from 'react';
import { StudentProfile, InterviewMessage } from '../types';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  RefreshCw,
  Trophy,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface InterviewPracticeViewProps {
  profile: StudentProfile | null;
}

export const InterviewPracticeView: React.FC<InterviewPracticeViewProps> = ({ profile }) => {
  const [topic, setTopic] = useState<string>('Technical & Recruiter Screen');
  const [messages, setMessages] = useState<InterviewMessage[]>([
    {
      id: 'init_1',
      role: 'assistant',
      content: `Hello ${profile?.name || 'Student'}! I am InternGuide-AI Mentor. Welcome to your Mock Internship Interview practice session. I see your target role is ${profile?.careerGoal || 'Software Engineering'}. Let's get started!\n\nQuestion 1: Could you give me a brief 1-minute elevator pitch about yourself, your university CS projects, and why you are interested in an entry-level ${profile?.careerGoal || 'Software'} internship?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || loading) return;

    const userMsg: InterviewMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: inputVal.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputVal('');
    setLoading(true);

    try {
      const response = await fetch('/api/interview-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          profile,
          topic,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get interview response');
      }

      const data = await response.json();

      const aiMsg: InterviewMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        feedback: data.feedback,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I encountered a temporary connection issue. Please check your network and try answering again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `init_${Date.now()}`,
        role: 'assistant',
        content: `Session restarted! Welcome back ${profile?.name || 'Student'}. I am ready to practice ${topic} questions with you for ${profile?.careerGoal || 'Software Engineering'}. Go ahead and say "Ready!" or ask your first question.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-xs font-semibold">
          <MessageSquare className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          <span>Interactive AI Mock Interviewer</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Internship Interview Practice
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          Practice answering technical and recruiter questions with InternGuide-AI Mentor. Receive instant feedback and scoring after every answer!
        </p>
      </div>

      {/* Topic selector bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <span>Interview Focus:</span>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
          >
            <option value="Technical & Recruiter Screen">Technical & Recruiter Screen</option>
            <option value="Data Structures & Core CS">Data Structures & Core CS</option>
            <option value="System & API Design Basics">System & API Design Basics</option>
            <option value="Behavioral STAR Method">Behavioral (STAR Method)</option>
          </select>
        </div>

        <button
          onClick={handleResetChat}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 flex items-center space-x-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Session</span>
        </button>
      </div>

      {/* Chat Messages Container */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[420px] max-h-[600px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isAi = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex flex-col space-y-2 ${isAi ? 'items-start' : 'items-end'}`}
            >
              <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-semibold px-1">
                {isAi ? (
                  <>
                    <Bot className="w-3.5 h-3.5 text-indigo-500" />
                    <span>InternGuide-AI Mentor</span>
                  </>
                ) : (
                  <>
                    <span>{profile?.name || 'You'}</span>
                    <User className="w-3.5 h-3.5 text-emerald-500" />
                  </>
                )}
                <span>• {msg.timestamp}</span>
              </div>

              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed max-w-[85%] whitespace-pre-wrap ${
                  isAi
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                    : 'bg-indigo-600 text-white rounded-tr-none font-medium'
                }`}
              >
                {msg.content}
              </div>

              {/* Display AI Feedback card if available for the evaluated answer */}
              {isAi && msg.feedback && (
                <div className="p-4 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 max-w-[85%] space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-indigo-900 dark:text-indigo-200">
                    <span className="flex items-center space-x-1">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span>Answer Evaluation Score</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[11px]">
                      {msg.feedback.score} / 10
                    </span>
                  </div>

                  {msg.feedback.strengths && msg.feedback.strengths.length > 0 && (
                    <div className="text-[11px] text-emerald-800 dark:text-emerald-300">
                      <strong>Strengths:</strong> {msg.feedback.strengths.join(', ')}
                    </div>
                  )}

                  {msg.feedback.improvements && msg.feedback.improvements.length > 0 && (
                    <div className="text-[11px] text-amber-800 dark:text-amber-300">
                      <strong>Tip for Recruiter Interview:</strong> {msg.feedback.improvements.join(', ')}
                    </div>
                  )}

                  {msg.feedback.sampleAnswerSnippet && (
                    <div className="text-[10px] text-slate-600 dark:text-slate-400 italic bg-white/60 dark:bg-slate-900/60 p-2 rounded">
                      "{msg.feedback.sampleAnswerSnippet}"
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-slate-400 italic py-2">
            <Bot className="w-4 h-4 text-indigo-500 animate-bounce" />
            <span>InternGuide-AI Mentor is thinking & evaluating answer...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Type your interview answer here..."
          disabled={loading}
          className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !inputVal.trim()}
          className="px-5 py-3 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-50 transition-colors flex items-center space-x-1.5 shrink-0"
        >
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
