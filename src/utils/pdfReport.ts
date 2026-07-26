import { StudentProfile, ReadinessAnalysis, ResumeAnalysis, SkillGapReport, LearningRoadmap } from '../types';

export function downloadPreparationReport(
  profile: StudentProfile,
  readiness?: ReadinessAnalysis | null,
  resumeAnalysis?: ResumeAnalysis | null,
  skillGaps?: SkillGapReport | null,
  roadmap?: LearningRoadmap | null
) {
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const reportContent = `
================================================================================
                        INTERNGUIDE-AI - PREPARATION REPORT
================================================================================
Generated on: ${dateStr}
Student Name: ${profile.name}
University: ${profile.university}
Degree: ${profile.degree} (${profile.semester})
Target Career Track: ${profile.careerGoal}
Experience Level: ${profile.experienceLevel}
Current Known Skills: ${profile.currentSkills.join(', ')}

--------------------------------------------------------------------------------
1. AI INTERNSHIP READINESS ASSESSMENT
--------------------------------------------------------------------------------
Overall Readiness Score: ${readiness ? `${readiness.score} / 100 (${readiness.readinessLevel})` : 'Not evaluated yet'}

Summary:
${readiness?.summary || 'N/A'}

Key Strengths:
${readiness?.strengths.map(s => `  • ${s}`).join('\n') || 'N/A'}

Areas Needing Improvement / Weaknesses:
${readiness?.weaknesses.map(w => `  • ${w}`).join('\n') || 'N/A'}

Crucial Missing Skills:
${readiness?.missingSkills.map(m => `  • ${m}`).join('\n') || 'N/A'}

Recommended Technologies to Learn:
${readiness?.recommendedTechnologies.map(t => `  • ${t}`).join('\n') || 'N/A'}

Suggested Portfolio Projects:
${readiness?.suggestedProjects.map((p, idx) => `
  Project ${idx + 1}: ${p.title} (${p.difficulty})
  Tech Stack: ${p.techStack.join(', ')}
  Description: ${p.description}
  Why It Matters: ${p.whyItMatters}
`).join('') || 'N/A'}

--------------------------------------------------------------------------------
2. RESUME ANALYSIS & ATS SCORE
--------------------------------------------------------------------------------
Resume Quality Score: ${resumeAnalysis ? `${resumeAnalysis.resumeScore} / 100` : 'Not uploaded'}
ATS Compatibility Score: ${resumeAnalysis ? `${resumeAnalysis.atsFriendlinessScore} / 100` : 'N/A'}

Verdict:
${resumeAnalysis?.overallVerdict || 'N/A'}

Key Resume Improvement Suggestions:
${resumeAnalysis?.improvementSuggestions.map(s => `  • ${s}`).join('\n') || 'N/A'}

--------------------------------------------------------------------------------
3. SKILL GAP DETECTOR SUMMARY
--------------------------------------------------------------------------------
Summary:
${skillGaps?.overallSummary || 'N/A'}

High Priority Skills (Must Have):
${skillGaps?.highPriority.map(s => `  • ${s.skill} (${s.difficulty} - Est: ${s.estimatedHours}): ${s.reason}`).join('\n') || 'None'}

Medium Priority Skills:
${skillGaps?.mediumPriority.map(s => `  • ${s.skill} (${s.difficulty} - Est: ${s.estimatedHours}): ${s.reason}`).join('\n') || 'None'}

--------------------------------------------------------------------------------
4. 30-DAY PERSONALIZED LEARNING ROADMAP
--------------------------------------------------------------------------------
${roadmap?.weeks.map(w => `
WEEK ${w.weekNumber}: ${w.title} (Focus: ${w.focusArea})
Topics:
${w.topics.map(t => `  - ${t}`).join('\n')}

Mini Project: ${w.miniProject.name}
${w.miniProject.description}
Deliverables: ${w.miniProject.deliverables.join(', ')}

Practice Tasks:
${w.practiceTasks.map(pt => `  [ ] ${pt}`).join('\n')}

Milestone: ${w.milestone}
`).join('\n') || 'Roadmap not generated yet.'}

================================================================================
InternGuide-AI Mentor - Dedicated Computer Science Internship Preparation
Website: https://ais-dev-mro7gqbvpg4ffwjrzm63f6-1057432302085.asia-southeast1.run.app
================================================================================
`;

  const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `InternGuide_AI_Report_${profile.name.replace(/\s+/g, '_')}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
