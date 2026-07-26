import React from 'react';
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Target,
  Users,
  BrainCircuit,
  ArrowRight
} from 'lucide-react';
import { ActiveTab } from '../types';

interface AboutViewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ setActiveTab }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>About InternGuide-AI</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Empowering Computer Science Students
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          From "I don't know where to start" to "I am ready to apply for my dream tech internship."
        </p>
      </div>

      {/* Vision & Mission Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl space-y-4 border border-slate-800">
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <BrainCircuit className="w-4 h-4" />
          <span>Our Core Mission</span>
        </div>
        <h2 className="text-2xl font-extrabold">
          Specialized AI Guidance for CS, SE, and IT Students
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Every semester, thousands of Computer Science students apply for internships without knowing whether their skills meet recruiter standards. Generic AI chatbots give vague answers, while resume scanners only count keywords.
        </p>
        <p className="text-xs sm:text-sm text-indigo-200 font-medium leading-relaxed">
          InternGuide-AI bridges this gap as a specialized virtual mentor. It analyzes student profiles, reviews resumes like a senior tech recruiter, detects exact technical skill gaps, and generates actionable 30-day preparation roadmaps.
        </p>
      </div>

      {/* Target User Persona Story (Sarah) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
          <Users className="w-5 h-5" />
          <span>User Persona: Sarah's Story</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto">
              S
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">Sarah (Age 21)</div>
            <div className="text-[11px] text-slate-500">BS Computer Science • Semester 6</div>
          </div>

          <div className="md:col-span-2 space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>
              <strong>The Challenge:</strong> Sarah knows Python and Java from her university coursework, but felt anxious applying for machine learning and software internships. She didn't know if her coursework projects were strong enough or what technologies she needed to learn next.
            </p>
            <p>
              <strong>The Solution with InternGuide-AI:</strong> Sarah filled out her assessment, uploaded her PDF resume, and got an instant 82/100 readiness evaluation. InternGuide-AI detected her gaps in REST APIs and PyTorch, gave her a 30-day 4-week roadmap, and helped her practice recruiter interview questions.
            </p>
          </div>
        </div>
      </div>

      {/* Product Commitments / Non-Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
            <Target className="w-4 h-4 text-emerald-500" />
            <span>What InternGuide-AI Does</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-start space-x-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Evaluates technical readiness based on real CS job descriptions.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Performs deep ATS & recruiter resume reviews with actionable suggestions.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Generates structured 30-day week-by-week learning roadmaps.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Provides interactive AI mock interview practice with scoring.</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <span>Our Non-Goals & Integrity</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-start space-x-2">
              <span className="text-rose-500 font-bold">✕</span>
              <span>Never guarantees internship selection or fake promises.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-rose-500 font-bold">✕</span>
              <span>Never exaggerates or invents fake experience on your resume.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-rose-500 font-bold">✕</span>
              <span>Never exposes user data or API keys — 100% server-side Gemini execution.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Start CTA */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white text-center space-y-4">
        <h2 className="text-2xl font-extrabold">Ready to Evaluate Your Internship Readiness?</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Start your student profile assessment today and get personalized AI guidance in seconds.
        </p>
        <button
          onClick={() => setActiveTab('assessment')}
          className="px-6 py-3 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg inline-flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Start Assessment Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
