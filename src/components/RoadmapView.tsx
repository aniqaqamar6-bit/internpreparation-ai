import React, { useState, useEffect } from 'react';
import { StudentProfile, LearningRoadmap } from '../types';
import { SkeletonLoader } from './SkeletonLoader';
import {
  Map,
  Calendar,
  CheckSquare,
  Square,
  Award,
  Code2,
  Sparkles,
  BookOpen,
  CheckCircle2,
  RefreshCw,
  Trophy
} from 'lucide-react';

interface RoadmapViewProps {
  profile: StudentProfile | null;
  roadmap: LearningRoadmap | null;
  setRoadmap: (roadmap: LearningRoadmap) => void;
  missingSkills?: string[];
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  profile,
  roadmap,
  setRoadmap,
  missingSkills = [],
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const fetchRoadmap = async () => {
    if (!profile) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, missingSkills }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate learning roadmap');
      }

      const data: LearningRoadmap = await response.json();
      setRoadmap(data);
    } catch (err: any) {
      console.error('Error fetching roadmap:', err);
      setErrorMsg(err.message || 'Error generating learning roadmap');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile && !roadmap && !loading) {
      fetchRoadmap();
    }
  }, [profile]);

  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  // Calculate overall task progress percentage
  const totalTasks = roadmap
    ? roadmap.weeks.reduce((acc, week) => acc + week.practiceTasks.length, 0)
    : 0;

  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center space-y-4">
        <Map className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Please Complete Assessment First</h2>
        <p className="text-xs text-slate-500">A student profile is required to generate a personalized 30-day plan.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-xs font-semibold">
          <Map className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>30-Day Internship Preparation Plan</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Personalized Learning Roadmap
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          Customized 4-week preparation timeline tailored for <span className="font-bold text-indigo-600 dark:text-indigo-400">{profile.name}</span> ({profile.degree}, {profile.semester}).
        </p>

        <div className="pt-2">
          <button
            onClick={fetchRoadmap}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-sm inline-flex items-center space-x-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Regenerate 30-Day Plan</span>
          </button>
        </div>
      </div>

      {loading && (
        <SkeletonLoader
          title="Building 30-Day Learning Roadmap..."
          subtitle={`Structuring 4 weeks of topics, mini projects, practice tasks, and milestone checkpoints for ${profile.careerGoal}.`}
        />
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs text-center">
          {errorMsg}
        </div>
      )}

      {roadmap && !loading && (
        <div className="space-y-8">
          {/* Progress Summary Box */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-purple-800/80 pb-4">
              <div>
                <span className="text-xs font-bold uppercase text-purple-300 tracking-wider">Target Role Track</span>
                <h2 className="text-xl font-extrabold">{roadmap.title}</h2>
              </div>

              <div className="flex items-center space-x-3 bg-purple-950/80 px-4 py-2 rounded-xl border border-purple-700/60">
                <Trophy className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-xs font-bold text-white">Completion Progress</div>
                  <div className="text-sm font-extrabold text-purple-300">{progressPercent}% ({completedCount}/{totalTasks} Tasks)</div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{roadmap.summary}</p>

            {/* Progress Bar */}
            <div className="w-full bg-purple-950 rounded-full h-3 overflow-hidden border border-purple-800">
              <div
                className="bg-gradient-to-r from-purple-400 to-amber-400 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* 4 Weeks Timeline List */}
          <div className="space-y-6">
            {roadmap.weeks.map((week) => (
              <div
                key={week.weekNumber}
                className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-extrabold text-base flex items-center justify-center shrink-0">
                      W{week.weekNumber}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                        Week {week.weekNumber}: {week.title}
                      </h3>
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                        Focus Area: {week.focusArea}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full font-bold">
                    <Award className="w-3.5 h-3.5" />
                    <span>Milestone: {week.milestone}</span>
                  </div>
                </div>

                {/* Grid: Topics & Mini Project */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Core Topics */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                      <BookOpen className="w-4 h-4 text-purple-500" />
                      <span>Core Learning Topics</span>
                    </span>
                    <ul className="space-y-1.5 pl-1">
                      {week.topics.map((t, tIdx) => (
                        <li key={tIdx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start space-x-2">
                          <span className="text-purple-500 font-bold">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Mini Project */}
                  <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60 space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-extrabold text-purple-900 dark:text-purple-200">
                      <Code2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span>Mini Project: {week.miniProject.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                      {week.miniProject.description}
                    </p>
                    <div className="text-[10px] font-semibold text-slate-500 pt-1">
                      Deliverables: {week.miniProject.deliverables.join(', ')}
                    </div>
                  </div>
                </div>

                {/* Practice Tasks Checkbox List */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                    Daily Practice Tasks:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {week.practiceTasks.map((task, pIdx) => {
                      const taskId = `w${week.weekNumber}_t${pIdx}`;
                      const isChecked = !!completedTasks[taskId];

                      return (
                        <div
                          key={pIdx}
                          onClick={() => toggleTask(taskId)}
                          className={`cursor-pointer p-2.5 rounded-xl border text-xs flex items-center space-x-2.5 transition-colors ${
                            isChecked
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-slate-500 line-through'
                              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-purple-300'
                          }`}
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span className="truncate">{task}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
