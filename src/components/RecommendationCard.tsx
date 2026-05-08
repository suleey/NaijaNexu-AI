import React from 'react';
import { motion } from 'framer-motion';
import { Recommendation } from '../types';
import { Utensils, Film, Book, ShoppingBag, Briefcase, Sparkles, Star, Tag } from 'lucide-react';
import { cn } from '../lib/utils';

const domainIcons: Record<string, React.ReactNode> = {
  food: <Utensils className="w-4 h-4" />,
  movies: <Film className="w-4 h-4" />,
  books: <Book className="w-4 h-4" />,
  products: <ShoppingBag className="w-4 h-4" />,
  jobs: <Briefcase className="w-4 h-4" />,
  lifestyle: <Sparkles className="w-4 h-4" />,
  other: <Sparkles className="w-4 h-4" />,
};

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all h-full flex flex-col"
    >
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 px-2 py-1 bg-slate-100 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-600">
            {domainIcons[recommendation.domain]}
            {recommendation.domain}
          </div>
          {recommendation.rating && (
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
              <Star className="w-3 h-3 fill-current" />
              {recommendation.rating}
            </div>
          )}
        </div>

        <h3 className="font-display font-bold text-xl mb-1 text-slate-900">{recommendation.title}</h3>
        <p className="text-slate-500 text-sm mb-4 line-clamp-3 flex-1">{recommendation.description}</p>

        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-3">
          <p className="text-emerald-800 text-xs font-medium leading-relaxed">
            <span className="font-bold">Why NaijaNexu picked this:</span> {recommendation.reason}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-auto">
          {recommendation.priceContext && (
            <span className="text-[10px] font-bold px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-md">
              {recommendation.priceContext}
            </span>
          )}
          {recommendation.tags?.map((tag, i) => (
            <span key={i} className="text-[10px] items-center flex gap-1 font-medium px-2 py-1 bg-slate-50 text-slate-500 rounded-md">
              <Tag className="w-2 h-2" />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
