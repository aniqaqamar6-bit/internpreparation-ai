import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  StudentProfile,
  ReadinessAnalysis,
  ResumeAnalysis,
  SkillGapReport,
  LearningRoadmap
} from './types';
import { SARAH_PERSONA } from './data/presetProfiles';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { AssessmentForm } from './components/AssessmentForm';
import { DashboardView } from './components/DashboardView';
import { ResumeAnalyzerView } from './components/ResumeAnalyzerView';
import { SkillGapView } from './components/SkillGapView';
import { RoadmapView } from './components/RoadmapView';
import { InterviewPracticeView } from './components/InterviewPracticeView';
import { AboutView } from './components/AboutView';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [profile, setProfile] = useState<StudentProfile | null>(SARAH_PERSONA); // Pre-load Sarah persona for instant delight!
  const [readiness, setReadiness] = useState<ReadinessAnalysis | null>(null);
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [skillGaps, setSkillGaps] = useState<SkillGapReport | null>(null);
  const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null);
  
  const [loadingReadiness, setLoadingReadiness] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to html document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Function to run AI Readiness analysis for a profile
  const analyzeProfile = async (targetProfile: StudentProfile) => {
    setLoadingReadiness(true);
    try {
      const response = await fetch('/api/analyze-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetProfile),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze profile with AI');
      }

      const data: ReadinessAnalysis = await response.json();
      setReadiness(data);
    } catch (err) {
      console.error('Error analyzing profile:', err);
    } finally {
      setLoadingReadiness(false);
    }
  };

  // Run initial profile evaluation for Sarah on startup
  useEffect(() => {
    if (profile && !readiness) {
      analyzeProfile(profile);
    }
  }, []);

  const handleAssessmentSubmit = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    setReadiness(null);
    setSkillGaps(null);
    setRoadmap(null);
    setActiveTab('dashboard');
    analyzeProfile(newProfile);
  };

  const handleLoadSarahDemo = () => {
    setProfile(SARAH_PERSONA);
    setReadiness(null);
    setSkillGaps(null);
    setRoadmap(null);
    analyzeProfile(SARAH_PERSONA);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'home' && (
          <LandingPage
            profile={profile}
            setActiveTab={setActiveTab}
            onLoadSarahDemo={handleLoadSarahDemo}
          />
        )}

        {activeTab === 'assessment' && (
          <AssessmentForm
            onSubmit={handleAssessmentSubmit}
            initialProfile={profile}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            profile={profile}
            readiness={readiness}
            loading={loadingReadiness}
            onReanalyze={() => profile && analyzeProfile(profile)}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'resume' && (
          <ResumeAnalyzerView
            profile={profile}
            resumeAnalysis={resumeAnalysis}
            setResumeAnalysis={setResumeAnalysis}
          />
        )}

        {activeTab === 'skillgap' && (
          <SkillGapView
            profile={profile}
            skillGaps={skillGaps}
            setSkillGaps={setSkillGaps}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapView
            profile={profile}
            roadmap={roadmap}
            setRoadmap={setRoadmap}
            missingSkills={readiness?.missingSkills}
          />
        )}

        {activeTab === 'interview' && (
          <InterviewPracticeView profile={profile} />
        )}

        {activeTab === 'about' && (
          <AboutView setActiveTab={setActiveTab} />
        )}
      </main>

      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
