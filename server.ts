import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini API Client
let aiInstance: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined. Please check that your Gemini API key is configured in the Secrets panel.");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

// --- API ENDPOINTS ---

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 1. Summarize Video
app.post("/api/gemini/summarize", async (req, res) => {
  try {
    const { videoTitle, videoDescription } = req.body;
    if (!videoTitle) {
      return res.status(400).json({ error: "videoTitle is required" });
    }

    const ai = getAI();
    const prompt = `You are a professional educational assistant. Provide a structured study summary for school students based on this educational video:
Title: "${videoTitle}"
Description: "${videoDescription || 'No description provided'}"

Provide a clean markdown response containing:
1. **Core Concept Overview**: A brief, engaging, high-level overview of the video's main topic (2-3 sentences).
2. **Key Takeaways**: 3 to 5 clear, bulleted takeaways explaining the most important equations, facts, or concepts.
3. **Study Cheat Sheet**: A brief, structured reference card with formulas, definitions, or critical historical dates.
Ensure it is written in simple, encouraging, and highly legible markdown formatted for school students.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const summaryText = response.text || "Could not generate a summary.";
    res.json({ summary: summaryText });
  } catch (error: any) {
    console.error("Summarization error:", error);
    res.status(500).json({ error: error.message || "Failed to generate study summary." });
  }
});

// 2. Generate multiple-choice quiz
app.post("/api/gemini/quiz", async (req, res) => {
  try {
    const { videoTitle, videoDescription } = req.body;
    if (!videoTitle) {
      return res.status(400).json({ error: "videoTitle is required" });
    }

    const ai = getAI();
    const prompt = `Generate exactly 4 engaging multiple-choice quiz questions to test a school student's understanding of the following educational video topic:
Title: "${videoTitle}"
Description: "${videoDescription || ''}"

Return a structured list of questions. Each question must contain:
1. "question": The question text.
2. "options": Exactly 4 possible choices.
3. "correctAnswerIndex": The 0-based index of the correct answer (0, 1, 2, or 3).
4. "explanation": A helpful, encouraging explanation of why that answer is correct, perfect for helping students learn.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "List of 4 quiz questions",
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Exactly 4 options"
              },
              correctAnswerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswerIndex", "explanation"]
          }
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from AI model.");
    }

    const quizQuestions = JSON.parse(responseText.trim());
    res.json({ quiz: quizQuestions });
  } catch (error: any) {
    console.error("Quiz generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate quiz." });
  }
});

// 3. Generate Study Flashcards
app.post("/api/gemini/flashcards", async (req, res) => {
  try {
    const { videoTitle, videoDescription } = req.body;
    if (!videoTitle) {
      return res.status(400).json({ error: "videoTitle is required" });
    }

    const ai = getAI();
    const prompt = `Generate exactly 4 high-quality revision flashcards based on this educational topic:
Title: "${videoTitle}"
Description: "${videoDescription || ''}"

Each flashcard has a front (a short question, term, formula, or historical event) and a back (the brief explanation, definition, or key formula explanation).
Keep them concise, highly structured, and relevant to school exams.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "List of revision flashcards",
          items: {
            type: Type.OBJECT,
            properties: {
              front: { type: Type.STRING, description: "The revision term, formula, or question" },
              back: { type: Type.STRING, description: "The concise definition, answer, or explanation" }
            },
            required: ["front", "back"]
          }
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from AI model.");
    }

    const flashcards = JSON.parse(responseText.trim());
    res.json({ flashcards });
  } catch (error: any) {
    console.error("Flashcards generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate flashcards." });
  }
});

// 4. AI Study Buddy Chat
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, videoTitle, videoDescription, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    const ai = getAI();

    // Reconstruct the history messages for Gemini chat
    // Ensure history is in the correct format or we can compile it into a single generation prompt
    // Let's compile a single message request with context to keep the chat highly focused and reliable.
    const contextPrompt = `You are a friendly, enthusiastic, and brilliant AI Study Buddy named "Spark" for school students.
You are helping the student understand the educational video:
Video Title: "${videoTitle}"
Video Description: "${videoDescription || 'No description provided'}"

Student's Conversation History:
${(history || []).map((h: any) => `${h.role === 'user' ? 'Student' : 'Spark'}: ${h.text}`).join('\n')}
Student: ${message}

Spark: (Provide a friendly, highly clear, and simple explanation. Feel free to use simple code formatting, markdown tables, bullet points, or list structures where helpful. Encourage the student to stay curious and focused!)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contextPrompt,
    });

    const answer = response.text || "Sorry, I had trouble formulating an answer. Ask me again!";
    res.json({ reply: answer });
  } catch (error: any) {
    console.error("AI Chat error:", error);
    res.status(500).json({ error: error.message || "Failed to process chat message." });
  }
});

// --- VITE DEV OR STATIC PROD SERVING ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Mounted Vite developer middleware.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log(`Serving static production files from: ${distPath}`);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
