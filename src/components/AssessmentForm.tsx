import React, { useState } from 'react';
import { StudentProfile, CareerGoal, ExperienceLevel } from '../types';
import {
  CAREER_GOALS,
  AVAILABLE_SKILLS,
  UNIVERSITIES_LIST,
  SEMESTERS_LIST,
  SARAH_PERSONA
} from '../data/presetProfiles';
import {
  Sparkles,
  User,
  GraduationCap,
  Target,
  Code2,
  Check,
  Plus,
  X,
  AlertCircle,
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface AssessmentFormProps {
  onSubmit: (profile: StudentProfile) => void;
  initialProfile: StudentProfile | null;
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({ onSubmit, initialProfile }) => {
  const [name, setName] = useState(initialProfile?.name || '');
  const [university, setUniversity] = useState(initialProfile?.university || UNIVERSITIES_LIST[0]);
  const [degree, setDegree] = useState(initialProfile?.degree || 'BS Computer Science');
  const [semester, setSemester] = useState(initialProfile?.semester || SEMESTERS_LIST[5]); // Semester 6
  const [careerGoal, setCareerGoal] = useState<CareerGoal>(initialProfile?.careerGoal || 'Artificial Intelligence');
  const [currentSkills, setCurrentSkills] = useState<string[]>(initialProfile?.currentSkills || ['Python', 'Java', 'SQL', 'Git', 'Problem Solving']);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(initialProfile?.experienceLevel || 'Intermediate');
  
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleToggleSkill = (skill: string) => {
    if (currentSkills.includes(skill)) {
      setCurrentSkills(currentSkills.filter((s) => s !== skill));
    } else {
      setCurrentSkills([...currentSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (trimmed && !currentSkills.includes(trimmed)) {
      setCurrentSkills([...currentSkills, trimmed]);
      setCustomSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setCurrentSkills(currentSkills.filter((s) => s !== skill));
  };

  const handleLoadSarahDemo = () => {
    setName(SARAH_PERSONA.name);
    setUniversity(SARAH_PERSONA.university);
    setDegree(SARAH_PERSONA.degree);
    setSemester(SARAH_PERSONA.semester);
    setCareerGoal(SARAH_PERSONA.careerGoal);
    setCurrentSkills(SARAH_PERSONA.currentSkills);
    setExperienceLevel(SARAH_PERSONA.experienceLevel);
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setValidationError('Please enter your name.');
      return;
    }
    if (!university.trim()) {
      setValidationError('Please specify or select your university.');
      return;
    }
    if (!degree.trim()) {
      setValidationError('Please select your degree program.');
      return;
    }
    if (!semester) {
      setValidationError('Please select your current semester.');
      return;
    }
    if (currentSkills.length === 0) {
      setValidationError('Please select or add at least one technical or soft skill.');
      return;
    }

    setValidationError(null);

    const profile: StudentProfile = {
      name: name.trim(),
      university: university.trim(),
      degree: degree.trim(),
      semester,
      careerGoal,
      currentSkills,
      experienceLevel,
    };

    onSubmit(profile);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Student Internship Assessment</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Build Your Student Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          Tell InternGuide-AI Mentor about your academic background and technical stack to evaluate your internship readiness.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleLoadSarahDemo}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center space-x-1 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Sarah's Persona Profile (BS CS, Semester 6)</span>
          </button>
        </div>
      </div>

      {/* Validation Banner */}
      {validationError && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Main Assessment Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Personal & Academic Info */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
            <User className="w-4 h-4" />
            <span>1. Personal & Academic Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Student Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* University */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                University <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="e.g. Tech State University"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Degree */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Degree Program <span className="text-rose-500">*</span>
              </label>
              <select
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="BS Computer Science">BS Computer Science</option>
                <option value="BS Software Engineering">BS Software Engineering</option>
                <option value="BS Information Technology">BS Information Technology</option>
                <option value="BS Data Science">BS Data Science</option>
                <option value="BS Cyber Security">BS Cyber Security</option>
              </select>
            </div>

            {/* Semester */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Current Semester / Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {SEMESTERS_LIST.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Step 2: Target Career Goal */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
            <Target className="w-4 h-4" />
            <span>2. Target Career Goal / Internship Track</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {CAREER_GOALS.map((item) => {
              const isSelected = careerGoal === item.goal;
              return (
                <div
                  key={item.goal}
                  onClick={() => setCareerGoal(item.goal)}
                  className={`cursor-pointer p-4 rounded-xl border text-left transition-all relative space-y-2 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 dark:border-indigo-500 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {item.goal}
                    </span>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Current Skills & Experience Level */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
            <Code2 className="w-4 h-4" />
            <span>3. Current Technical Skills & Experience</span>
          </div>

          {/* Selected Skills Badges */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Selected Skills ({currentSkills.length}) <span className="text-rose-500">*</span>
            </label>

            <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 min-h-[50px]">
              {currentSkills.length === 0 ? (
                <span className="text-xs text-slate-400 italic">No skills selected yet. Click skills below to add.</span>
              ) : (
                currentSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-600 text-white shadow-sm"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-indigo-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Quick Select Preset Skills */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Popular CS & Software Skills (Click to toggle):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_SKILLS.map((skill) => {
                const isSelected = currentSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleToggleSkill(skill)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200 font-bold border border-indigo-300 dark:border-indigo-700'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add custom skill input */}
          <div className="flex items-center space-x-2 pt-2">
            <input
              type="text"
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              placeholder="Add other skill (e.g. PyTorch, Docker, GraphQL)"
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddCustomSkill}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-900"
            >
              Add Skill
            </button>
          </div>

          {/* Experience Level */}
          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Overall Experience Level <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['Beginner', 'Intermediate', 'Advanced'] as ExperienceLevel[]).map((level) => {
                const isSelected = experienceLevel === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setExperienceLevel(level)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submit CTA */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze Internship Readiness with AI</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
