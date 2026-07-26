import React from 'react';
import { GraduationCap, Github, Shield, Sparkles, Heart } from 'lucide-react';
import { ActiveTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div
              className="flex items-center space-x-2.5 cursor-pointer"
              onClick={() => setActiveTab('home')}
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                InternGuide<span className="text-indigo-400">-AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Specialized AI mentor helping Computer Science students analyze readiness, detect skill gaps, polish resumes, and conquer technical internship interviews.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Platform Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('assessment')} className="hover:text-indigo-400 transition-colors">
                  Student Profile Assessment
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-indigo-400 transition-colors">
                  AI Readiness Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('resume')} className="hover:text-indigo-400 transition-colors">
                  Resume Analyzer (ATS Review)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('skillgap')} className="hover:text-indigo-400 transition-colors">
                  Skill Gap Detector
                </button>
              </li>
            </ul>
          </div>

          {/* Learning & Preparation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Guidance & Practice
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('roadmap')} className="hover:text-indigo-400 transition-colors">
                  Personalized 30-Day Roadmap
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('interview')} className="hover:text-indigo-400 transition-colors flex items-center space-x-1">
                  <span>AI Mock Interviewer</span>
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-indigo-400 transition-colors">
                  About InternGuide-AI
                </button>
              </li>
            </ul>
          </div>

          {/* Mission & Student Commitment */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Student First Philosophy
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Built specifically for CS, Software Engineering, and IT students. No generic AI noise — only actionable industry advice.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Privacy Focused & Free for Students</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} InternGuide-AI. Designed for Computer Science Students.</p>
          <div className="flex items-center space-x-1">
            <span>Powered by</span>
            <span className="text-slate-300 font-semibold">Google Gemini AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
