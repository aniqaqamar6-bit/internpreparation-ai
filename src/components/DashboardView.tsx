import React, { useState } from 'react';
import { StudentProfile, ReadinessAnalysis, ActiveTab } from '../types';
import { downloadPreparationReport } from '../utils/pdfReport';
import { SkeletonLoader } from './SkeletonLoader';
import {
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Code2,
  Download,
  ArrowRight,
  FileText,
  Target,
  Map,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Layers,
  GraduationCap
} from 'lucide-react';

interface DashboardViewProps {
  profile: StudentProfile | null;
  readiness: ReadinessAnalysis | null;
  loading: boolean;
  onReanalyze: () => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  readiness,
  loading,
  onReanalyze,
  setActiveTab,
}) => {
  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          No Student Profile Selected
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Please complete your student profile assessment first to view your AI internship readiness evaluation.
        </p>
        <button
          onClick={() => setActiveTab('assessment')}
          className="px-6 py-3 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm inline-flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Go to Assessment Form</span>
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4">
        <SkeletonLoader
          title={`Evaluating ${profile.name}'s Internship Readiness...`}
          subtitle={`Analyzing ${profile.degree} (${profile.semester}) profile against entry-level ${profile.careerGoal} industry roles.`}
        />
      </div>
    );
  }

  const score = readiness?.score ?? 75;

  const getScoreColor = (s: number) => {
    if (s >= 80) return { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500', ring: 'ring-emerald-500/20' };
    if (s >= 60) return { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500', ring: 'ring-amber-500/20' };
    return { text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500', ring: 'ring-rose-500/20' };
  };

  const colorScheme = getScoreColor(score);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Student Overview Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
            <span>{profile.degree} • {profile.semester}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {profile.name}'s Internship Readiness
          </h1>
          <p className="text-xs text-slate-300">
            University: <span className="text-white font-medium">{profile.university}</span> • Track:{' '}
            <span className="text-indigo-300 font-bold">{profile.careerGoal}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onReanalyze}
            className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors inline-flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-evaluate AI</span>
          </button>

          <button
            onClick={() => downloadPreparationReport(profile, readiness)}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-colors inline-flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* Main Readiness Score Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Gauge Block */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center flex flex-col justify-center items-center space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Internship Readiness Score
          </span>

          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Simple circular background track */}
            <div className="absolute inset-0 rounded-full border-8 border-slate-100 dark:border-slate-800" />
            <div className="text-center space-y-0.5">
              <span className={`text-4xl sm:text-5xl font-black ${colorScheme.text}`}>
                {score}
              </span>
              <span className="text-xs text-slate-400 block font-semibold">/ 100</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 ${colorScheme.text}`}>
              {readiness?.readinessLevel || 'Almost Ready'}
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Based on CS market expectations for {profile.careerGoal}
            </p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="md:col-span-2 p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>AI Mentor Assessment Summary</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {readiness?.summary ||
                `${profile.name} exhibits solid programming fundamentals in ${profile.currentSkills.join(
                  ', '
                )}. To become competitive for top ${profile.careerGoal} internships, focused effort is needed on production frameworks, version control metrics, and full-stack API integration.`}
            </p>
          </div>

          {/* Quick Action Hub */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <button
              onClick={() => setActiveTab('resume')}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors border border-slate-200/80 dark:border-slate-700/60 text-left space-y-1"
            >
              <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <div className="text-[11px] font-bold text-slate-900 dark:text-white">Resume Review</div>
              <div className="text-[9px] text-slate-500">ATS Check</div>
            </button>

            <button
              onClick={() => setActiveTab('skillgap')}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors border border-slate-200/80 dark:border-slate-700/60 text-left space-y-1"
            >
              <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <div className="text-[11px] font-bold text-slate-900 dark:text-white">Skill Gaps</div>
              <div className="text-[9px] text-slate-500">Priority List</div>
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors border border-slate-200/80 dark:border-slate-700/60 text-left space-y-1"
            >
              <Map className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <div className="text-[11px] font-bold text-slate-900 dark:text-white">30-Day Plan</div>
              <div className="text-[9px] text-slate-500">4-Week Guide</div>
            </button>

            <button
              onClick={() => setActiveTab('interview')}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors border border-slate-200/80 dark:border-slate-700/60 text-left space-y-1"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div className="text-[11px] font-bold text-slate-900 dark:text-white">Mock Interview</div>
              <div className="text-[9px] text-slate-500">Practice Q&A</div>
            </button>
          </div>
        </div>
      </div>

      {/* Strengths vs Needs Improvement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
            <CheckCircle2 className="w-5 h-5" />
            <span>Key Strengths Verified</span>
          </div>

          <ul className="space-y-2.5">
            {(readiness?.strengths || [
              `Solid foundation in ${profile.currentSkills.slice(0, 3).join(', ')}`,
              `Active ${profile.degree} student (${profile.semester}) with core coursework`,
              `Good baseline problem-solving understanding`
            ]).map((s, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700 dark:text-slate-300">
                <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                  ✓
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses / Needs Improvement */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 font-bold text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
            <AlertTriangle className="w-5 h-5" />
            <span>Needs Improvement / Gaps</span>
          </div>

          <ul className="space-y-2.5">
            {(readiness?.weaknesses || [
              'Lack of production REST API deployment experience',
              'Git collaboration & branch workflow metrics missing on resume',
              'Limited end-to-end full stack project portfolio'
            ]).map((w, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700 dark:text-slate-300">
                <span className="w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                  !
                </span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Portfolio Projects */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-wider">
            <Code2 className="w-5 h-5" />
            <span>Recommended Portfolio Projects to Build</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Tailored to {profile.careerGoal}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(readiness?.suggestedProjects || [
            {
              title: 'Full-Stack Smart Task Manager with AI Categorization',
              description: 'Build a web service with user auth, REST API backend, and Gemini AI auto-tagging.',
              techStack: ['React', 'Node.js/Express', 'PostgreSQL', 'Gemini API'],
              difficulty: 'Intermediate',
              whyItMatters: 'Demonstrates end-to-end API design and external AI SDK integration.'
            },
            {
              title: 'Distributed Log Monitor & Analytics Dashboard',
              description: 'Real-time server log processing service with search and stats.',
              techStack: ['Python', 'Docker', 'SQL', 'Chart.js'],
              difficulty: 'Intermediate',
              whyItMatters: 'Shows strong understanding of backend concurrency and Docker deployment.'
            }
          ]).map((proj, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {proj.title}
                </h4>
                <span className="px-2 py-0.5 text-[10px] font-extrabold rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {proj.difficulty}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {proj.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {proj.techStack.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 text-[10px] font-medium rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium italic pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                Why recruiters value this: {proj.whyItMatters}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Next Steps CTA Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-bold flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <span>Ready for Step 2? Review Your Resume with AI Recruiter</span>
          </h3>
          <p className="text-xs text-slate-300">
            Upload your PDF resume to check ATS score and missing industry keywords.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('resume')}
          className="px-6 py-3 rounded-xl font-bold text-xs bg-indigo-500 hover:bg-indigo-400 text-white shadow-md transition-all shrink-0 inline-flex items-center space-x-2"
        >
          <span>Go to Resume Analyzer</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
