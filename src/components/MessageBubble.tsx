import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Message } from '../types';
import { RecommendationCard } from './RecommendationCard';
import { User, Bot } from 'lucide-react';
import { cn } from '../lib/utils';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAI = message.role === 'assistant';

  return (
    <div className={cn(
      "flex w-full mb-6",
      isAI ? "justify-start" : "justify-end"
    )}>
      <div className={cn(
        "max-w-[85%] flex gap-3",
        !isAI && "flex-row-reverse"
      )}>
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
          isAI ? "bg-brand-primary text-white" : "bg-brand-secondary text-brand-primary"
        )}>
          {isAI ? <Bot size={18} /> : <User size={18} />}
        </div>

        <div className="flex flex-col gap-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "px-4 py-3 rounded-2xl text-sm leading-relaxed",
              isAI 
                ? "bg-white border border-slate-200 text-slate-800 rounded-tl-none" 
                : "bg-brand-primary text-white rounded-tr-none"
            )}
          >
            <div className="markdown-body">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          </motion.div>

          {message.recommendations && message.recommendations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {message.recommendations.map((rec) => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </div>
          )}
          
          <span className="text-[10px] text-slate-400 font-medium px-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}
