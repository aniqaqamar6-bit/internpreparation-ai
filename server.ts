import express, { Request, Response } from 'express';
import path from 'path';
import multer from 'multer';
import zlib from 'zlib';
import * as pdfParseModule from 'pdf-parse';

let pdfParse: any = (pdfParseModule as any).default || pdfParseModule;
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Setup Multer memory storage for PDF parsing
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Lazy initializer for Gemini client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'InternGuide-AI Backend' });
});

// 2. Profile Readiness Analysis
app.post('/api/analyze-profile', async (req: Request, res: Response) => {
  try {
    const profile = req.body;
    if (!profile || !profile.name || !profile.careerGoal) {
      return res.status(400).json({ error: 'Incomplete student profile provided' });
    }

    const ai = getGeminiClient();
    const systemInstruction = `You are InternGuide-AI Mentor, an experienced Computer Science internship recruiter and industry mentor.
Analyze the student's academic profile, current skills, semester, experience level, and target career goal.
Evaluate their internship readiness strictly and constructively without exaggerating.
Provide an honest score (0 to 100), identify strengths, weaknesses, missing skills for their target role, recommended tech stack, 2 realistic portfolio projects with detailed deliverables, and actionable learning advice.`;

    const prompt = `Student Profile:
Name: ${profile.name}
University: ${profile.university || 'N/A'}
Degree: ${profile.degree}
Semester: ${profile.semester}
Target Career Goal: ${profile.careerGoal}
Current Known Skills: ${(profile.currentSkills || []).join(', ')}
Experience Level: ${profile.experienceLevel}

Provide structured internship readiness analysis.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Internship readiness score between 0 and 100' },
            readinessLevel: { type: Type.STRING, description: 'Not Ready, Getting There, Almost Ready, or Internship Ready' },
            summary: { type: Type.STRING, description: '3-4 sentence comprehensive assessment summary' },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Key student strengths' },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Areas needing improvement' },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Crucial missing technical or soft skills' },
            recommendedTechnologies: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Technologies to learn next' },
            suggestedProjects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                  difficulty: { type: Type.STRING },
                  whyItMatters: { type: Type.STRING }
                },
                required: ['title', 'description', 'techStack', 'difficulty', 'whyItMatters']
              }
            },
            learningAdvice: { type: Type.ARRAY, items: { type: Type.STRING } },
            nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: [
            'score',
            'readinessLevel',
            'summary',
            'strengths',
            'weaknesses',
            'missingSkills',
            'recommendedTechnologies',
            'suggestedProjects',
            'learningAdvice',
            'nextSteps'
          ]
        }
      }
    });

    const resultText = response.text || '{}';
    const resultJson = JSON.parse(resultText);
    return res.json(resultJson);
  } catch (error: any) {
    console.error('Error in /api/analyze-profile:', error);
    return res.status(500).json({
      error: 'Failed to analyze profile with AI',
      details: error.message || String(error)
    });
  }
});

function decompressPdfStream(streamBytes: Buffer): string | null {
  try {
    return zlib.inflateSync(streamBytes).toString('latin1');
  } catch {}
  try {
    return zlib.inflateRawSync(streamBytes).toString('latin1');
  } catch {}
  try {
    return zlib.unzipSync(streamBytes).toString('latin1');
  } catch {}
  return null;
}

// Fallback helper function to extract text directly from PDF buffer streams
function fallbackExtractPdfText(buffer: Buffer): string {
  try {
    const raw = buffer.toString('binary');
    const textChunks: string[] = [];

    const cleanStr = (s: string) => {
      return s
        .replace(/\\([()\\])/g, '$1')
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t');
    };

    const processContentString = (content: string) => {
      // 1. Parentheses text: (Hello World) Tj or [(Hello) 10 (World)] TJ
      const tjMatches = content.match(/\(([^()]*)\)\s*T[jJ]|\[([\s\S]*?)\]\s*TJ/g) || [];
      for (const tj of tjMatches) {
        const strings = tj.match(/\(([^()]*)\)/g) || [];
        for (const str of strings) {
          const cleaned = cleanStr(str.slice(1, -1));
          if (cleaned.trim().length > 0) {
            textChunks.push(cleaned);
          }
        }
      }

      // 2. Hex strings: <48656C6C6F> Tj
      const hexMatches = content.match(/<([0-9a-fA-F\s]+)>\s*T[jJ]/g) || [];
      for (const hm of hexMatches) {
        const hex = hm.replace(/[^0-9a-fA-F]/g, '');
        if (hex.length >= 2) {
          try {
            const strBuf = Buffer.from(hex, 'hex');
            const asciiStr = strBuf.toString('utf8');
            if (asciiStr.trim().length > 0) {
              textChunks.push(asciiStr);
            }
          } catch {}
        }
      }
    };

    // Uncompressed content
    processContentString(raw);

    // Decompress PDF streams
    const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
    let match;
    while ((match = streamRegex.exec(raw)) !== null) {
      const streamBytes = Buffer.from(match[1], 'binary');
      const decompressed = decompressPdfStream(streamBytes);
      if (decompressed) {
        processContentString(decompressed);
      }
    }

    return textChunks.join(' ').replace(/\s+/g, ' ').trim();
  } catch (err) {
    console.warn('Fallback PDF extraction error:', err);
    return '';
  }
}

// Helper function to extract text from PDF buffer
async function extractTextFromPdf(buffer: Buffer): Promise<{ text: string; method: string }> {
  let extractedText = '';
  let method = 'none';

  // 1. Primary pdf-parse
  try {
    let fn = pdfParse;
    if (typeof fn !== 'function' && fn && typeof fn.default === 'function') {
      fn = fn.default;
    }
    if (typeof fn === 'function') {
      const data = await fn(buffer);
      if (data && typeof data.text === 'string' && data.text.trim().length >= 15) {
        extractedText = data.text.trim();
        method = 'primary pdf-parse';
      }
    } else if (pdfParse && typeof pdfParse.pdfToText === 'function') {
      const txt = await pdfParse.pdfToText(buffer);
      if (txt && txt.trim().length >= 15) {
        extractedText = txt.trim();
        method = 'primary pdf-parse';
      }
    }
  } catch (err) {
    console.warn('pdf-parse primary extraction warning/error:', err);
  }

  // 2. pdf-parse with custom pagerender
  if (!extractedText || extractedText.length < 15) {
    try {
      let fn = pdfParse;
      if (typeof fn !== 'function' && fn && typeof fn.default === 'function') {
        fn = fn.default;
      }
      if (typeof fn === 'function') {
        const options = {
          pagerender: async function (pageData: any) {
            const textContent = await pageData.getTextContent({ normalizeWhitespace: true });
            let lastY, text = '';
            for (let item of textContent.items) {
              if (lastY == item.transform[5] || !lastY) {
                text += (item.str || '') + ' ';
              } else {
                text += '\n' + (item.str || '') + ' ';
              }
              lastY = item.transform[5];
            }
            return text;
          }
        };
        const data = await fn(buffer, options);
        if (data && typeof data.text === 'string' && data.text.trim().length >= 15) {
          extractedText = data.text.trim();
          method = 'pdf-parse with custom pagerender';
        }
      }
    } catch (err) {
      console.warn('pdf-parse custom pagerender error:', err);
    }
  }

  // 3. Fallback stream extractor (with raw inflate support & hex decoding)
  if (!extractedText || extractedText.length < 15) {
    const fallbackText = fallbackExtractPdfText(buffer);
    if (fallbackText && fallbackText.length >= 15) {
      extractedText = fallbackText;
      method = 'fallbackExtractPdfText';
    }
  }

  // 4. Gemini native PDF fallback if text is still empty
  if (!extractedText || extractedText.length < 15) {
    method = 'gemini inlineData PDF fallback';
  }

  return { text: extractedText, method };
}

// 3. Resume Analyzer
app.post('/api/analyze-resume', (req: Request, res: Response, next) => {
  upload.single('resumePdf')(req, res, (err: any) => {
    if (err) {
      console.error('Multer upload error in /api/analyze-resume:', err);
      return res.status(400).json({
        error: err.message || 'File upload error during resume upload'
      });
    }
    next();
  });
}, async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    let resumeText = '';
    let extractionMethod = 'pasted text';

    const bodyText = req.body?.resumeText;
    const careerGoal = req.body?.careerGoal || 'Software Engineering / CS Internship';

    if (req.file && req.file.buffer) {
      const extracted = await extractTextFromPdf(req.file.buffer);
      resumeText = extracted.text;
      extractionMethod = extracted.method;
    } else if (bodyText) {
      resumeText = bodyText;
      extractionMethod = 'pasted text';
    }

    // Required server-side debug logs
    console.log('1. req.file exists:', !!req.file);
    console.log('2. req.file.originalname:', req.file?.originalname);
    console.log('3. req.file.mimetype:', req.file?.mimetype);
    console.log('4. req.file.size:', req.file?.size);
    console.log('Extracted length:', resumeText.length);
    console.log('Preview:', resumeText.substring(0, 200));
    console.log('Extraction method used:', extractionMethod);

    if ((!resumeText || resumeText.trim().length < 15) && !req.file) {
      return res.status(400).json({
        error: 'Please upload a readable PDF resume or paste your resume text.'
      });
    }

    const ai = getGeminiClient();
    const systemInstruction = `You are InternGuide-AI Mentor, reviewing a Computer Science student's resume as an experienced internship recruiter.
Evaluate the resume for overall quality, ATS (Applicant Tracking System) friendliness, content clarity, bullet point impact (Action verbs, metrics), key missing sections/skills, and specific improvement suggestions.
Provide a resume score (0-100), ATS score (0-100), strengths, weaknesses, missing information, detailed improvement suggestions, and keyword analysis.`;

    let contents: any[] = [];
    if (req.file && req.file.buffer && (extractionMethod === 'gemini inlineData PDF fallback' || !resumeText || resumeText.length < 15)) {
      contents = [
        {
          inlineData: {
            mimeType: req.file.mimetype || 'application/pdf',
            data: req.file.buffer.toString('base64')
          }
        },
        `Target Role / Career Goal: ${careerGoal}\n\nPlease analyze the attached PDF resume.`
      ];
    } else {
      contents = [
        `Target Role / Career Goal: ${careerGoal}\n\nResume Content:\n"""\n${resumeText.slice(0, 10000)}\n"""`
      ];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            resumeScore: { type: Type.INTEGER, description: 'Overall resume quality score 0-100' },
            atsFriendlinessScore: { type: Type.INTEGER, description: 'ATS compatibility score 0-100' },
            overallVerdict: { type: Type.STRING, description: 'Recruiter impression summary' },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingInformation: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'E.g. GitHub links, project metrics, relevant coursework' },
            improvementSuggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Actionable bullet point updates' },
            keywordMatch: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  keyword: { type: Type.STRING },
                  matched: { type: Type.BOOLEAN },
                  category: { type: Type.STRING }
                },
                required: ['keyword', 'matched', 'category']
              }
            }
          },
          required: [
            'resumeScore',
            'atsFriendlinessScore',
            'overallVerdict',
            'strengths',
            'weaknesses',
            'missingInformation',
            'improvementSuggestions',
            'keywordMatch'
          ]
        }
      }
    });

    const resultText = response.text || '{}';
    const resultJson = JSON.parse(resultText);
    resultJson.extractedTextPreview = resumeText ? (resumeText.slice(0, 300) + '...') : 'Processed from PDF attachment directly';
    return res.json(resultJson);
  } catch (error: any) {
    console.error('Error in /api/analyze-resume:', error);
    return res.status(500).json({
      error: 'Failed to analyze resume with AI',
      details: error.message || String(error)
    });
  }
});

// 4. Skill Gap Detector
app.post('/api/detect-skill-gaps', async (req: Request, res: Response) => {
  try {
    const { profile } = req.body;
    if (!profile) {
      return res.status(400).json({ error: 'Profile is required' });
    }

    const ai = getGeminiClient();
    const systemInstruction = `You are InternGuide-AI Mentor. Compare the student's current skills against standard industry expectations for entry-level internships in ${profile.careerGoal}.
Categorize missing/gap skills into High Priority (Must Have), Medium Priority (Should Have), and Low Priority (Nice to Have).
Provide learning difficulty, estimated time required in hours/weeks, and top 2 free reputable learning resources (e.g. MDN, freeCodeCamp, Kaggle, Official Docs, YouTube) with valid titles and helpful descriptions or real web search query URLs.`;

    const prompt = `Student Career Goal: ${profile.careerGoal}
Degree/Semester: ${profile.degree} - ${profile.semester}
Known Skills: ${(profile.currentSkills || []).join(', ')}
Experience Level: ${profile.experienceLevel}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallSummary: { type: Type.STRING, description: 'Executive summary of skill gaps for this target role' },
            highPriority: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  priority: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  estimatedHours: { type: Type.STRING },
                  resources: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        url: { type: Type.STRING },
                        type: { type: Type.STRING }
                      },
                      required: ['title', 'url', 'type']
                    }
                  }
                },
                required: ['skill', 'reason', 'priority', 'difficulty', 'estimatedHours', 'resources']
              }
            },
            mediumPriority: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  priority: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  estimatedHours: { type: Type.STRING },
                  resources: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        url: { type: Type.STRING },
                        type: { type: Type.STRING }
                      },
                      required: ['title', 'url', 'type']
                    }
                  }
                },
                required: ['skill', 'reason', 'priority', 'difficulty', 'estimatedHours', 'resources']
              }
            },
            lowPriority: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  priority: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  estimatedHours: { type: Type.STRING },
                  resources: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        url: { type: Type.STRING },
                        type: { type: Type.STRING }
                      },
                      required: ['title', 'url', 'type']
                    }
                  }
                },
                required: ['skill', 'reason', 'priority', 'difficulty', 'estimatedHours', 'resources']
              }
            }
          },
          required: ['overallSummary', 'highPriority', 'mediumPriority', 'lowPriority']
        }
      }
    });

    const resultText = response.text || '{}';
    return res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error('Error in /api/detect-skill-gaps:', error);
    return res.status(500).json({
      error: 'Failed to detect skill gaps',
      details: error.message || String(error)
    });
  }
});

// 5. Generate Personalized 30-Day Learning Roadmap
app.post('/api/generate-roadmap', async (req: Request, res: Response) => {
  try {
    const { profile, missingSkills } = req.body;
    if (!profile) {
      return res.status(400).json({ error: 'Profile is required' });
    }

    const ai = getGeminiClient();
    const systemInstruction = `You are InternGuide-AI Mentor. Generate a highly structured, realistic 30-day (4-week) internship preparation roadmap tailored specifically to this CS student.
The roadmap must cover Weeks 1, 2, 3, and 4 sequentially.
Each week must include:
- Week Title & Focus Area
- Core Topics to learn
- A Mini Project (Name, description, and key deliverables)
- Practical Daily Tasks
- A clear Milestone goal`;

    const prompt = `Student Profile:
Target Role: ${profile.careerGoal}
Degree & Semester: ${profile.degree} - ${profile.semester}
Current Known Skills: ${(profile.currentSkills || []).join(', ')}
Key Skills Needed / Gaps: ${(missingSkills || ['Core CS Fundamentals', 'Projects', 'Git & API integration']).join(', ')}
Experience Level: ${profile.experienceLevel}

Generate a 4-week preparation plan.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            targetRole: { type: Type.STRING },
            weeks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  weekNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  focusArea: { type: Type.STRING },
                  topics: { type: Type.ARRAY, items: { type: Type.STRING } },
                  miniProject: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      deliverables: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ['name', 'description', 'deliverables']
                  },
                  practiceTasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  milestone: { type: Type.STRING }
                },
                required: ['weekNumber', 'title', 'focusArea', 'topics', 'miniProject', 'practiceTasks', 'milestone']
              }
            }
          },
          required: ['title', 'summary', 'targetRole', 'weeks']
        }
      }
    });

    const resultText = response.text || '{}';
    return res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error('Error in /api/generate-roadmap:', error);
    return res.status(500).json({
      error: 'Failed to generate roadmap',
      details: error.message || String(error)
    });
  }
});

// 6. Interview Practice / AI Mock Mentor Chat
app.post('/api/interview-chat', async (req: Request, res: Response) => {
  try {
    const { messages, profile, topic } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const ai = getGeminiClient();
    const systemInstruction = `You are InternGuide-AI Mentor, conducting a mock technical & behavioral internship interview with a CS student named ${profile?.name || 'Student'}.
Target Role: ${profile?.careerGoal || 'Software Engineering'}
Degree/Semester: ${profile?.degree || 'BS CS'} (${profile?.semester || 'Semester 6'})
Current Known Skills: ${(profile?.currentSkills || ['Python', 'Java']).join(', ')}

Guidelines:
- Ask realistic, role-specific internship interview questions (one at a time or respond to their answer).
- If the student answers a question, evaluate their response: give a score (1-10), highlight strengths, point out missing key concepts, and give a quick tip on how to answer better in a real recruiter interview.
- Stay encouraging, professional, and clear.
- Output JSON format containing message text and feedback structure.`;

    const prompt = `Chat History:
${messages.map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}

Topic / Focus: ${topic || 'Technical & Behavioral Interview Prep'}
Generate the next AI response with evaluation if user answered.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING, description: 'AI Mentor response or next interview question' },
            feedback: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.INTEGER, description: '1-10 score on candidate previous answer if evaluated' },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
                sampleAnswerSnippet: { type: Type.STRING, description: 'Model answer tip or snippet' }
              }
            }
          },
          required: ['content']
        }
      }
    });

    const resultText = response.text || '{}';
    return res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error('Error in /api/interview-chat:', error);
    return res.status(500).json({
      error: 'Failed to generate interview response',
      details: error.message || String(error)
    });
  }
});

// API catch-all to return JSON 404 instead of serving SPA index.html for missing /api routes
app.use('/api/*', (req: Request, res: Response) => {
  return res.status(404).json({ error: `API endpoint not found: ${req.method} ${req.originalUrl}` });
});

// Express Error Handling Middleware for API routes
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Express API Error Handler:', err);
  if (res.headersSent) {
    return next(err);
  }
  return res.status(err.status || 500).json({
    error: err.message || 'An internal server error occurred on the API route',
  });
});

// Vite middleware & production static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`InternGuide-AI Server running on http://0.0.0.0:${PORT}`);
  });
}

// Only start the standalone HTTP listener when not running in Vercel's serverless environment
if (!process.env.VERCEL) {
  startServer();
}

export default app;
export { app };
