import React, { useState, useEffect } from 'react';
import { StudentProfile, SkillGapReport, SkillGapItem } from '../types';
import { SkeletonLoader } from './SkeletonLoader';
import {
  Target,
  Clock,
  ExternalLink,
  BookOpen,
  Sparkles,
  AlertOctagon,
  AlertTriangle,
  Info,
  RefreshCw
} from 'lucide-react';

interface SkillGapViewProps {
  profile: StudentProfile | null;
  skillGaps: SkillGapReport | null;
  setSkillGaps: (report: SkillGapReport) => void;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({
  profile,
  skillGaps,
  setSkillGaps,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchSkillGaps = async () => {
    if (!profile) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/detect-skill-gaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch skill gap analysis');
      }

      const data: SkillGapReport = await response.json();
      setSkillGaps(data);
    } catch (err: any) {
      console.error('Error fetching skill gaps:', err);
      setErrorMsg(err.message || 'Error detecting skill gaps');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile && !skillGaps && !loading) {
      fetchSkillGaps();
    }
  }, [profile]);

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center space-y-4">
        <Target className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Please Complete Student Profile First</h2>
        <p className="text-xs text-slate-500">Assessment data is needed to detect target skill gaps.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-semibold">
          <Target className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Industry Expectation Comparison</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Skill Gap Detector
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          Comparing {profile.name}'s current skills against entry-level requirements for <span className="font-bold text-indigo-600 dark:text-indigo-400">{profile.careerGoal}</span>.
        </p>

        <div className="pt-2">
          <button
            onClick={fetchSkillGaps}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-sm inline-flex items-center space-x-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Re-scan Industry Gaps</span>
          </button>
        </div>
      </div>

      {loading && (
        <SkeletonLoader
          title="Detecting Skill Gaps with AI..."
          subtitle={`Comparing ${profile.currentSkills.join(', ')} against target market expectations.`}
        />
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs text-center">
          {errorMsg}
        </div>
      )}

      {skillGaps && !loading && (
        <div className="space-y-8">
          {/* Executive Summary */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Skill Gap Summary</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {skillGaps.overallSummary}
            </p>
          </div>

          {/* Render Sections: High Priority, Medium Priority, Low Priority */}
          <div className="space-y-8">
            {/* High Priority (Must Have) */}
            <SkillGapPrioritySection
              title="High Priority Skills (Must Have for Applications)"
              items={skillGaps.highPriority}
              badgeColor="bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300 dark:border-rose-800"
              icon={<AlertOctagon className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
            />

            {/* Medium Priority (Should Have) */}
            <SkillGapPrioritySection
              title="Medium Priority Skills (Should Have to Stand Out)"
              items={skillGaps.mediumPriority}
              badgeColor="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800"
              icon={<AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
            />

            {/* Low Priority (Nice to Have) */}
            {skillGaps.lowPriority && skillGaps.lowPriority.length > 0 && (
              <SkillGapPrioritySection
                title="Low Priority Skills (Nice to Have / Bonus)"
                items={skillGaps.lowPriority}
                badgeColor="bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border-sky-300 dark:border-sky-800"
                icon={<Info className="w-5 h-5 text-sky-600 dark:text-sky-400" />}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface SkillGapPrioritySectionProps {
  title: string;
  items: SkillGapItem[];
  badgeColor: string;
  icon: React.ReactNode;
}

const SkillGapPrioritySection: React.FC<SkillGapPrioritySectionProps> = ({
  title,
  items,
  badgeColor,
  icon,
}) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center space-x-2 font-bold text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 text-slate-900 dark:text-white">
        {icon}
        <span>{title}</span>
        <span className="text-xs text-slate-400 font-normal ml-auto">({items.length} Skills)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {item.skill}
              </h4>
              <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded border ${badgeColor}`}>
                {item.difficulty} Difficulty
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {item.reason}
            </p>

            <div className="flex items-center space-x-2 text-xs text-slate-500 pt-1">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>Est. Time to Master: <strong className="text-slate-800 dark:text-slate-200">{item.estimatedHours}</strong></span>
            </div>

            {/* Recommended Free Resources */}
            {item.resources && item.resources.length > 0 && (
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Recommended Free Resources:
                </span>
                <div className="space-y-1">
                  {item.resources.map((res, rIdx) => (
                    <a
                      key={rIdx}
                      href={res.url.startsWith('http') ? res.url : `https://www.google.com/search?q=${encodeURIComponent(res.title + ' tutorial')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 text-xs font-medium text-slate-800 dark:text-slate-200 transition-colors group"
                    >
                      <div className="flex items-center space-x-2 truncate pr-2">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="truncate">{res.title}</span>
                      </div>
                      <div className="flex items-center space-x-1 shrink-0 text-[10px] text-indigo-600 dark:text-indigo-400">
                        <span>{res.type}</span>
                        <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
