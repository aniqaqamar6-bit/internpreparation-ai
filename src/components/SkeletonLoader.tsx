import React from 'react';
import { Sparkles } from 'lucide-react';

interface SkeletonLoaderProps {
  title?: string;
  subtitle?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  title = 'AI Mentor Analyzing...',
  subtitle = 'Gemini AI is evaluating student skills, industry trends, and generating personalized recommendations.',
}) => {
  return (
    <div className="w-full p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 animate-pulse">
          <Sparkles className="w-6 h-6 animate-spin" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>{title}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-3/4 animate-pulse" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-5/6 animate-pulse" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-2/3 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="h-28 bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse p-4 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
        </div>
        <div className="h-28 bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse p-4 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
        </div>
        <div className="h-28 bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse p-4 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
};
