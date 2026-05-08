import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, RefreshCcw, LayoutDashboard, Settings2, Trash2, Globe, Command, Utensils, ShoppingBag } from 'lucide-react';
import { Message, UserPreferences, Recommendation } from './types';
import { chatWithAI } from './services/geminiService';
import { MessageBubble } from './components/MessageBubble';
import { RecommendationCard } from './components/RecommendationCard';
import { cn } from './lib/utils';

import { INITIAL_TRENDING_SPOTS, INITIAL_GUIDES } from './constants';

const ONBOARDING_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: "Kedu! I'm **NaijaNexu AI**, your personalized recommendation assistant. 🇳🇬\n\nI can help you find the best Nigerian meals, movies, gadgets, job opportunities, and lifestyle spots. \n\nTo get started, what's your name, and what are you looking for today? (e.g., 'I want a nice local restaurant in Lagos' or 'Suggest some new Nigerian movies')",
  timestamp: Date.now(),
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([ONBOARDING_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<'chat' | 'trending' | 'guides'>('chat');
  const [preferences, setPreferences] = useState<UserPreferences>({ onboarded: false });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [trendingSpots, setTrendingSpots] = useState<Recommendation[]>(INITIAL_TRENDING_SPOTS);
  const [isTrendingLoading, setIsTrendingLoading] = useState(false);

  const [guides, setGuides] = useState<{title: string, content: string, icon: React.ReactNode}[]>([]);
  const [isGuidesLoading, setIsGuidesLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeView === 'chat') {
      scrollToBottom();
    }
  }, [messages, activeView]);

  useEffect(() => {
    if (activeView === 'guides' && guides.length === 0) {
      // For now we use static, but could be AI generated
      setGuides(INITIAL_GUIDES.map(g => ({
        ...g,
        icon: getGuideIcon(g.category)
      })));
    }
  }, [activeView]);

  const getGuideIcon = (category: string) => {
    switch (category) {
      case 'Food': return <Utensils className="w-5 h-5" />;
      case 'Lifestyle': return <Sparkles className="w-5 h-5" />;
      case 'Safety': return <Globe className="w-5 h-5" />;
      case 'Shopping': return <ShoppingBag className="w-5 h-5" />;
      default: return <Command className="w-5 h-5" />;
    }
  };

  const loadTrendingSpots = async () => {
    if (isTrendingLoading) return;
    setIsTrendingLoading(true);
    try {
      const aiResponse = await chatWithAI([
        { id: 't1', role: 'user', content: 'What are the top 6 trending local spots in Nigeria right now? Include restaurants, events, and lifestyle experiences. Format as recommendations.', timestamp: Date.now() }
      ], preferences);
      
      if (aiResponse.recommendations && aiResponse.recommendations.length > 0) {
        setTrendingSpots(aiResponse.recommendations.map((r: any, i: number) => ({
          ...r,
          id: `trend-${Date.now()}-${i}`
        })));
      }
    } catch (error) {
      console.error("Failed to load trending spots:", error);
      // Keep existing spots on error
    } finally {
      setIsTrendingLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiResponse = await chatWithAI([...messages, userMessage], preferences);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse.reply,
      recommendations: aiResponse.recommendations?.map((r: any, index: number) => ({
        ...r,
        id: `rec-${Date.now()}-${index}`
      })),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);

    // Basic onboarding detection (simplified for demo)
    if (!preferences.onboarded && messages.length < 4) {
      // In a real app, we'd extract this with AI, but for now we just flag it
      setPreferences(prev => ({ ...prev, onboarded: true }));
    }
  };

  const clearChat = () => {
    setMessages([ONBOARDING_MESSAGE]);
    setPreferences({ onboarded: false });
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 flex-col bg-white border-r border-slate-200">
        <div className="p-6 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-primary rounded-xl">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-slate-900 leading-none">NaijaNexu</h1>
              <p className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em] mt-1">AI Recommendation Agent</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 space-y-1">
          <button 
            onClick={() => setActiveView('chat')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all",
              activeView === 'chat' ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            )}
          >
            <LayoutDashboard size={18} />
            Rec Assistant
          </button>
          <button 
            onClick={() => setActiveView('trending')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all",
              activeView === 'trending' ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            )}
          >
            <Globe size={18} />
            Trending Local Spots
          </button>
          <button 
            onClick={() => setActiveView('guides')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all",
              activeView === 'guides' ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            )}
          >
            <Command size={18} />
            Quick Guides
          </button>
        </div>

        <div className="p-4 mt-auto border-t border-slate-100">
          <button 
            onClick={clearChat}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors text-sm font-medium"
          >
            <Trash2 size={18} />
            Clear Conversation
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="lg:hidden p-2 bg-brand-primary rounded-lg">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-slate-900 text-lg leading-none">
                {activeView === 'chat' ? 'Active Chat' : activeView === 'trending' ? 'Trending Nigerian Spots' : 'Naija Cheat Sheets'}
              </h2>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {activeView === 'chat' ? 'Assistant Online' : 'Updated Just Now'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeView === 'trending' && (
              <button 
                onClick={loadTrendingSpots}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-bold"
              >
                <RefreshCcw size={14} className={isTrendingLoading ? "animate-spin" : ""} />
                Refresh
              </button>
            )}
            <button className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
              <Settings2 size={20} />
            </button>
          </div>
        </header>
        
        {/* Mobile Nav - Bottom Fixed */}
        <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-2xl flex items-center gap-1 z-30 ring-1 ring-black/5">
          <button 
            onClick={() => setActiveView('chat')}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all",
              activeView === 'chat' ? "text-brand-primary bg-brand-primary/10" : "text-slate-400"
            )}
          >
            <LayoutDashboard size={20} />
            <span className="text-[10px] font-bold uppercase tracking-tight">Chat</span>
          </button>
          <button 
            onClick={() => setActiveView('trending')}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all",
              activeView === 'trending' ? "text-brand-primary bg-brand-primary/10" : "text-slate-400"
            )}
          >
            <Globe size={20} />
            <span className="text-[10px] font-bold uppercase tracking-tight">Spots</span>
          </button>
          <button 
            onClick={() => setActiveView('guides')}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all",
              activeView === 'guides' ? "text-brand-primary bg-brand-primary/10" : "text-slate-400"
            )}
          >
            <Command size={20} />
            <span className="text-[10px] font-bold uppercase tracking-tight">Guides</span>
          </button>
        </nav>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto scroll-smooth">
          {activeView === 'chat' ? (
            <div className="px-4 md:px-10 py-8 max-w-4xl mx-auto w-full">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-6">
                  <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-3 shadow-sm">
                    <RefreshCcw className="w-4 h-4 text-brand-primary animate-spin" />
                    <span className="text-sm font-medium text-slate-500 tracking-tight">AI is thinking o...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          ) : activeView === 'trending' ? (
            <div className="px-4 md:px-10 py-8 max-w-6xl mx-auto w-full">
              <div className="mb-8">
                <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">What's Popping in Nigeria 🇳🇬</h3>
                <p className="text-slate-500 text-sm">Check out these highly-rated and popular spots curated by our AI based on current local activity.</p>
              </div>

              {isTrendingLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-64 bg-slate-200 rounded-3xl" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trendingSpots.map((rec) => (
                    <div key={rec.id} className="h-full">
                      <RecommendationCard recommendation={rec} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="px-4 md:px-10 py-8 max-w-5xl mx-auto w-full">
              <div className="mb-8">
                <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">Naija Cheat Sheets 📝</h3>
                <p className="text-slate-500 text-sm">Quick tips and guides to help you navigate the Nigerian lifestyle like a local pro.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guides.map((guide, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-xl">
                        {guide.icon}
                      </div>
                      <h4 className="font-display font-bold text-lg text-slate-900">{guide.title}</h4>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{guide.content}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input Area (Only for Chat View) */}
        {activeView === 'chat' && (
          <div className="p-4 md:p-8 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
            <div className="max-w-4xl mx-auto relative">
              <div className="absolute -top-10 left-0 right-0 flex justify-center pointer-events-none">
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest shadow-sm pointer-events-auto">
                  Shift + Enter for new line
                </span>
              </div>
              
              <div className="relative group">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask NaijaNexu (e.g., Best Amala spot in Ikeja?)"
                  className="w-full bg-white border-2 border-transparent focus:border-brand-primary/20 p-4 pr-16 rounded-3xl shadow-lg focus:outline-none text-sm min-h-[64px] max-h-48 resize-none transition-all duration-300"
                  rows={1}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    "absolute right-3 bottom-3 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300",
                    input.trim() 
                      ? "bg-brand-primary text-white shadow-md hover:scale-105 active:scale-95" 
                      : "bg-slate-100 text-slate-400"
                  )}
                >
                  <Send size={18} className={cn(isLoading && "animate-pulse")} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

