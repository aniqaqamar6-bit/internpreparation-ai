import React, { useState } from 'react';
import { ActiveTab, StudentProfile } from '../types';
import { SARAH_PERSONA } from '../data/presetProfiles';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  FileSearch,
  Target,
  Calendar,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  Terminal,
  Code2,
  Users
} from 'lucide-react';

interface LandingPageProps {
  profile: StudentProfile | null;
  setActiveTab: (tab: ActiveTab) => void;
  onLoadSarahDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ profile, setActiveTab, onLoadSarahDemo }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does InternGuide-AI evaluate my internship readiness?',
      a: 'InternGuide-AI uses Gemini AI to compare your university semester, current technical stack, and project history against real-world entry-level tech internship job descriptions. It calculates an accurate readiness score, pinpoints missing skills, and suggests exact portfolio projects.'
    },
    {
      q: 'Can I upload my PDF resume for review?',
      a: 'Yes! You can upload your PDF resume or paste text directly. Our AI analyzes formatting, bullet point metrics, ATS keyword compatibility, and provides section-by-section improvements like a senior tech recruiter.'
    },
    {
      q: 'Is InternGuide-AI specific to Computer Science students?',
      a: 'Absolutely. Unlike generic chatbots, InternGuide-AI is trained with system instructions targeted specifically at Computer Science, Software Engineering, IT, Data Science, and Cybersecurity students.'
    },
    {
      q: 'What is included in the 30-Day Personalized Roadmap?',
      a: 'Your custom 4-week roadmap breaks down your preparation into manageable week-by-week goals: Core topics to master, a tailored mini project with deliverables, daily practice tasks, and weekly milestones.'
    },
    {
      q: 'Can I practice technical and behavioral interviews?',
      a: 'Yes! The AI Mock Interviewer conducts role-play practice tailored to your career track (e.g. AI, Web Dev, Mobile, Cyber Security). It scores your answers and provides immediate suggestions.'
    }
  ];

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 md:p-16 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Dedicated Computer Science Internship Mentor</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
            Prepare Smarter for Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-indigo-400">Dream Internship.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Analyze your skills, improve your resume, and receive personalized internship guidance powered by AI.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('assessment')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                onLoadSarahDemo();
                setActiveTab('dashboard');
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center space-x-2"
            >
              <Users className="w-4 h-4 text-sky-400" />
              <span>Try Sarah's Demo Profile (BS CS)</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80 text-left">
            <div>
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-xs text-slate-400">CS Tailored Guidance</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-sky-400">0 - 100</div>
              <div className="text-xs text-slate-400">ATS Resume Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-400">30-Day</div>
              <div className="text-xs text-slate-400">Learning Roadmap</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">24/7</div>
              <div className="text-xs text-slate-400">AI Mock Interviewer</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            The Problem
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Most CS Students Ask the Same Uncertain Questions
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Thousands apply every semester, but standard university advice and general AI chatbots don't provide CS-focused internship readiness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              question: '"Am I ready for internships?"',
              detail: 'Students don\'t know if their course projects and knowledge meet company standards.',
              icon: <BrainCircuit className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            },
            {
              question: '"Which skills am I missing?"',
              detail: 'Coursework covers theory, but recruiters expect frameworks like Docker, REST, Git, or PyTorch.',
              icon: <Target className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            },
            {
              question: '"Is my resume strong enough?"',
              detail: 'Generic resume templates get rejected by recruiter ATS filters before human eyes see them.',
              icon: <FileSearch className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            },
            {
              question: '"Which projects should I build?"',
              detail: 'Building simple todo apps doesn\'t impress technical interviewers.',
              icon: <Code2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            },
            {
              question: '"What should I learn next?"',
              detail: 'Without a clear roadmap, students waste weeks hopping between random tutorials.',
              icon: <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            },
            {
              question: '"How do I prepare for interviews?"',
              detail: 'Anxiety and lack of practice lead to poor performance in recruiter screenings.',
              icon: <MessageSquare className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                {item.icon}
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {item.question}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Features Overview */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16 px-4 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Core Capabilities
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Everything You Need to Get Internship-Ready
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              onClick={() => setActiveTab('assessment')}
              className="group cursor-pointer p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                1. Student Profile Assessment
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Evaluates university, degree, semester, career track (AI, Web, Mobile, Cyber Security), and current skills.
              </p>
            </div>

            <div
              onClick={() => {
                if (!profile) onLoadSarahDemo();
                setActiveTab('dashboard');
              }}
              className="group cursor-pointer p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                2. AI Readiness Score
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Generates a 0-100 readiness score with strengths, weaknesses, and recommended portfolio projects.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('resume')}
              className="group cursor-pointer p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileSearch className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                3. Resume & ATS Review
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                PDF parser reviews resume impact, ATS formatting, and missing recruiter keywords.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('skillgap')}
              className="group cursor-pointer p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                4. Skill Gap Detector
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Highlights high/medium priority missing tech skills with estimated hours and free learning links.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('roadmap')}
              className="group cursor-pointer p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                5. 30-Day Learning Roadmap
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                4-week plan complete with mini projects, tasks, deliverables, and milestone goals.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('interview')}
              className="group cursor-pointer p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                6. AI Mock Interviewer
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Practice technical & behavioral questions with real-time AI scoring and answer feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            User Journey
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            How InternGuide-AI Guides You
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {[
            { step: '01', title: 'Start Assessment', desc: 'Fill in your degree, semester, skills, and target goal.' },
            { step: '02', title: 'AI Analysis', desc: 'Gemini evaluates readiness, missing skills, and projects.' },
            { step: '03', title: 'Review Resume', desc: 'Upload PDF to check ATS compatibility and recruiter tips.' },
            { step: '04', title: 'Execute Roadmap', desc: 'Follow 30-day plan, build mini projects, and practice interviews.' }
          ].map((s, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative space-y-3"
            >
              <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {s.step}
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {s.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Placeholder */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-8 sm:p-10 rounded-3xl bg-indigo-900 text-white space-y-6">
          <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Student Success Story</span>
          </div>

          <blockquote className="text-lg sm:text-xl font-medium leading-relaxed italic text-indigo-100">
            "Before using InternGuide-AI, I knew Python and Java, but I had no idea if my skills were enough for an AI internship in Semester 6. The AI detected my gap in REST APIs and PyTorch, gave me a 30-day roadmap, and helped fix my resume ATS score from 55% to 88%!"
          </blockquote>

          <div className="flex items-center space-x-3 pt-2">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-sm">
              S
            </div>
            <div>
              <div className="font-bold text-sm text-white">Sarah</div>
              <div className="text-xs text-indigo-300">BS Computer Science, Semester 6 • Tech State University</div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Got Questions?
          </h2>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-4 text-left font-semibold text-sm text-slate-900 dark:text-white flex items-center justify-between space-x-4"
                >
                  <span className="flex items-center space-x-2">
                    <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 dark:bg-slate-900/90 border border-slate-800 text-white space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold">
            Ready to Check Your Internship Readiness?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Get personalized CS mentor feedback in under 2 minutes. Free, instant, and tailored to your tech stack.
          </p>
          <div>
            <button
              onClick={() => setActiveTab('assessment')}
              className="px-8 py-4 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all inline-flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Begin Your Student Assessment</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
