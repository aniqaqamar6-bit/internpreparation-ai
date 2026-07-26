import React, { useState } from 'react';
import { StudentProfile, ResumeAnalysis } from '../types';
import { SkeletonLoader } from './SkeletonLoader';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Search,
  FileCode
} from 'lucide-react';

interface ResumeAnalyzerViewProps {
  profile: StudentProfile | null;
  resumeAnalysis: ResumeAnalysis | null;
  setResumeAnalysis: (analysis: ResumeAnalysis) => void;
}

const SAMPLE_SARAH_RESUME = `
SARAH QAMAR
City, Country • sarah@university.edu • github.com/sarah-cs • linkedin.com/in/sarah-cs

EDUCATION
BS Computer Science | Tech State University
Expected Graduation: May 2027 | Current Semester: Semester 6 | GPA: 3.6/4.0
Relevant Coursework: Data Structures & Algorithms, Object-Oriented Programming, Database Systems, Web Engineering.

TECHNICAL SKILLS
Languages: Python, Java, SQL, C++, HTML, CSS, JavaScript
Tools & Platforms: Git, GitHub, VS Code, MySQL Workbench
Concepts: OOP, Algorithm Analysis, Problem Solving, REST API Basics

PROJECTS
Smart University Attendance System (Python, SQL, HTML)
- Developed a desktop and web application for tracking student classroom attendance.
- Connected Python backend to MySQL database for record management.
- Implemented user login for professors and administrators.

Personal Portfolio Website (HTML/CSS, JavaScript)
- Created a responsive personal portfolio website showcasing academic projects.
- Hosted on GitHub Pages with clean UI layout.

ACTIVITIES
Member, University Computer Society | 2024 - Present
`;

export const ResumeAnalyzerView: React.FC<ResumeAnalyzerViewProps> = ({
  profile,
  resumeAnalysis,
  setResumeAnalysis,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        setErrorMsg('Please upload a valid PDF file.');
        return;
      }
      setSelectedFile(file);
      setErrorMsg(null);
    }
  };

  const handleLoadSampleResume = () => {
    setPastedText(SAMPLE_SARAH_RESUME);
    setSelectedFile(null);
    setErrorMsg(null);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !pastedText.trim()) {
      setErrorMsg('Please upload a PDF resume or paste your resume text to analyze.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('resumePdf', selectedFile);
      }
      if (pastedText.trim()) {
        formData.append('resumeText', pastedText.trim());
      }
      formData.append('careerGoal', profile?.careerGoal || 'Software Engineering Internship');

      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get('content-type');
      const text = await response.text();

      console.log('1. response.status:', response.status);
      console.log('2. response.headers content-type:', contentType);
      console.log('3. raw response text before JSON parsing:', text);

      let result: any = null;

      try {
        result = JSON.parse(text);
      } catch (parseErr) {
        console.error('Non-JSON response received from server:', text.slice(0, 200));
        throw new Error('Received an unexpected response from the server. If uploading a PDF, please try pasting the resume text directly.');
      }

      if (!response.ok || !result) {
        throw new Error(result?.error || 'Failed to analyze resume with AI');
      }

      setResumeAnalysis(result);
    } catch (err: any) {
      console.error('Error in handleAnalyze:', err);
      setErrorMsg(err.message || 'An error occurred while analyzing the resume.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      {/* Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>AI Recruiter & ATS Resume Reviewer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Resume & ATS Analyzer
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          Upload your CS resume PDF or paste resume text. InternGuide-AI evaluates impact metrics, section layout, and missing technical keywords.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleLoadSampleResume}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center space-x-1 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Load Sample Sarah Resume Text</span>
          </button>
        </div>
      </div>

      {/* Upload Form Box */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleAnalyze} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PDF Upload Dropzone */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Option A: Upload PDF File
              </label>

              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors bg-slate-50/50 dark:bg-slate-800/40 relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-2 pointer-events-none">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  {selectedFile ? (
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {selectedFile.name}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {(selectedFile.size / 1024).toFixed(1)} KB • PDF Ready
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Click or drag PDF resume here
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Supports standard PDF files up to 10MB
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Paste Resume Text */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Option B: Paste Resume Text
              </label>

              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste your education, skills, projects, and work experience text here..."
                rows={6}
                className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-extrabold text-xs text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 shadow-md transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing Resume with AI Recruiter...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Resume & ATS Analysis</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <SkeletonLoader
          title="Recruiter AI Reviewing Resume..."
          subtitle="Extracting text, checking section formatting, bullet point metrics, and target role ATS keywords."
        />
      )}

      {/* Analysis Results Display */}
      {resumeAnalysis && !loading && (
        <div className="space-y-8">
          {/* Scores Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-2">
              <span className="text-xs font-extrabold uppercase text-slate-400">Overall Resume Score</span>
              <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
                {resumeAnalysis.resumeScore} <span className="text-sm font-semibold text-slate-400">/ 100</span>
              </div>
              <div className="text-[11px] text-slate-500">Recruiter Impression</div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-2">
              <span className="text-xs font-extrabold uppercase text-slate-400">ATS Friendliness</span>
              <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400">
                {resumeAnalysis.atsFriendlinessScore} <span className="text-sm font-semibold text-slate-400">/ 100</span>
              </div>
              <div className="text-[11px] text-slate-500">Parser Compatibility</div>
            </div>

            <div className="sm:col-span-2 md:col-span-1 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center space-y-2">
              <span className="text-xs font-extrabold uppercase text-slate-400">Recruiter Verdict</span>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                "{resumeAnalysis.overallVerdict}"
              </p>
            </div>
          </div>

          {/* Actionable Suggestions & Missing Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Specific Bullet Suggestions */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
                <CheckCircle2 className="w-5 h-5" />
                <span>Recommended Bullet Improvements</span>
              </div>

              <ul className="space-y-3">
                {resumeAnalysis.improvementSuggestions.map((sug, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{sug}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing Recruiter Info */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-bold text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
                <AlertCircle className="w-5 h-5" />
                <span>Missing Key Resume Information</span>
              </div>

              <ul className="space-y-3">
                {resumeAnalysis.missingInformation.map((info, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <span className="w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                      !
                    </span>
                    <span className="leading-relaxed">{info}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Keyword Match Grid */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-wider">
                <Search className="w-4 h-4" />
                <span>ATS Technical Keyword Match Analysis</span>
              </div>
              <span className="text-xs text-slate-500">Target Role: {profile?.careerGoal || 'Software Engineering'}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {resumeAnalysis.keywordMatch.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold ${
                    item.matched
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-200'
                  }`}
                >
                  <span className="truncate mr-1">{item.keyword}</span>
                  <span className={`text-[10px] font-extrabold shrink-0 px-1.5 py-0.5 rounded ${item.matched ? 'bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100' : 'bg-rose-200 dark:bg-rose-800 text-rose-900 dark:text-rose-100'}`}>
                    {item.matched ? 'MATCH' : 'MISSING'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
