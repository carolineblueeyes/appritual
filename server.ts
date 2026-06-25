import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with client options & fallback handling
const apiKey = process.env.GEMINI_API_KEY;
const isRealApiKey = apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "";

let ai: GoogleGenAI | null = null;
if (isRealApiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API initiated successfully");
  } catch (error) {
    console.error("Failed to initialize Gemini API client:", error);
  }
} else {
  console.log("No valid GEMINI_API_KEY found, running in smart-mock mode");
}

// REST API for AI Navigator
app.post("/api/ai-navigator", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const normalizedPrompt = prompt.toLowerCase();

  // If Gemini API is available, call it!
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: `You are the AI Navigator for 'Ritual' - an advanced and highly aesthetic attention recovery application.
You must analyze the user's emotional state, thoughts, or physical symptoms described in Russian (e.g. fatigue, tension, active energy, mental chaos, overload).
Return a structured JSON output reflecting their state and recommending an appropriate practice from the Ritual app ecosystem.

Ritual app content groups:
- Исток (Origin): Sandbox / foundational practices (#E6B85C). Good for grounding, baseline focus, and acute anxiety drops.
- Тишина (Silence): Calming / evening restoration practices (#7A9BBA). Good for sleep deprivation, overthinking, letting go of control.
- Энергия (Energy): Energizing, sympato-inductive practices (#E67E22). Good for drowsiness, lack of motivation, morning wakeup.
- Ясность (Clarity): Cognitive focus, prioritization (#A8D5E5). Good for mental fog, heavy task load, lack of priority.

Valid categories for HealthState output:
- 'Shining': User is in peak form, highly recovered, positive.
- 'Balance': User is stable, normal, calm.
- 'Tension': User is accumulated fatigue, lack of sleep, minor stress.
- 'Overload': Severe stress, panic, insomnia, completely burnt out.
- 'NoData': Gray/neutral (do not default to this unless user provides nothing of substance).

Based on their state, recommend one of the specified practices in Russian:
- '5-4-3-2-1: Нейро-сброс' (Group: Исток, Duration: '05:30', good for panic or extreme stress)
- 'Физиологический вздох' (Group: Исток, Duration: '04:30', good for quick calm or alertness)
- 'Квадратное дыхание' (Group: Исток, Duration: '05:15', good for focus, deep breathing)
- 'Сканирование тела' (Group: Исток, Duration: '07:00')
- 'Заземление через стопы' (Group: Исток, Duration: '05:00', good for being lost in thoughts)
- 'Точка спокойствия' (Group: Исток, Duration: '03:00', acupressure)
- 'Ориентировка' (Group: Исток, Duration: '03:00', EMDR movement)
- 'Огненное дыхание' (Group: Энергия, Duration: '05:05', hyperventilation wake-up)
- 'Код дня' (Group: Энергия, Duration: '05:20', intention programming)
- 'Фокус внимания' (Group: Ясность, Duration: '10:00', Pomodoro tracking)
- 'Ночной дневник' (Group: Тишина, Duration: '07:30', evening journaling)
- 'Сканирование отпускания' (Group: Тишина, Duration: '06:35')
- 'Растворение напряжения' (Group: Тишина, Duration: '06:00')
- 'Смотрение на мир' (Group: Ясность, Duration: '07:00', peripheral view)
` + (normalizedPrompt.includes("eng") ? "Even though system instructions describe Russian, map to Russian output." : ""),
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              state: {
                type: Type.STRING,
                description: "Must be: 'Shining' | 'Balance' | 'Tension' | 'Overload' | 'NoData'"
              },
              phrase: {
                type: Type.STRING,
                description: "Emotional status in Russian. E.g. 'Сияешь и готов к большему', 'Мягкий баланс', 'Напряжение в теле', 'Предел перегрузки'"
              },
              reason: {
                type: Type.STRING,
                description: "Explain why they feel this way based on their description, in elegant and supportive Russian."
              },
              ritualName: {
                type: Type.STRING,
                description: "The name of the recommended Ritual practice (e.g. '5-4-3-2-1: Нейро-сброс', 'Физиологический вздох', 'Огненное дыхание')"
              },
              ritualGroup: {
                type: Type.STRING,
                description: "Group of the ritual: 'Исток' | 'Тишина' | 'Энергия' | 'Ясность'"
              },
              duration: {
                type: Type.STRING,
                description: "In format MM:SS, e.g. '05:30'"
              },
              instructions: {
                type: Type.STRING,
                description: "Quick 1-2 sentence tip in Russian on how to proceed."
              }
            },
            required: ["state", "phrase", "reason", "ritualName", "ritualGroup", "duration", "instructions"]
          }
        }
      });

      const text = response.text;
      if (text) {
        return res.json(JSON.parse(text));
      }
    } catch (e) {
      console.error("Gemini runtime error, falling back to smart-mock:", e);
    }
  }

  // Smart-mock rule engine based on search terms
  let state: 'Shining' | 'Balance' | 'Tension' | 'Overload' | 'NoData' = 'Balance';
  let phrase = 'Внутренний баланс';
  let reason = 'Твои показатели и слова говорят о стабильности. Ум спокоен, тело готово.';
  let ritualName = 'Квадратное дыхание';
  let ritualGroup: 'Исток' | 'Тишина' | 'Энергия' | 'Ясность' = 'Исток';
  let duration = '05:15';
  let instructions = 'Займи удобную позу сидя и следуй за ударами воображаемого метронома.';

  if (normalizedPrompt.includes("устал") || normalizedPrompt.includes("не спал") || normalizedPrompt.includes("сон") || normalizedPrompt.includes("ноч") || normalizedPrompt.includes("tired") || normalizedPrompt.includes("sleep")) {
    state = 'Tension';
    phrase = 'Напряжение / Дефицит сна';
    reason = 'Организм сообщает о дефиците восстановления. Накоплена фоновая усталость, которая ослабляет твой кристалл.';
    ritualName = 'Физиологический вздох';
    ritualGroup = 'Исток';
    duration = '04:30';
    instructions = 'Сделай двойной вдох носом и длинный мягкий выдох ртом, убирая напряжение.';
  } else if (normalizedPrompt.includes("паник") || normalizedPrompt.includes("тревог") || normalizedPrompt.includes("страх") || normalizedPrompt.includes("плохо") || normalizedPrompt.includes("перегруз") || normalizedPrompt.includes("anxious") || normalizedPrompt.includes("stress")) {
    state = 'Overload';
    phrase = 'Сигнал перегрузки';
    reason = 'Префронтальная кора перегружена внешними триггерами, а миндалевидное тело бьет тревогу. Сбрось аварийные клапаны.';
    ritualName = '5-4-3-2-1: Нейро-сброс';
    ritualGroup = 'Исток';
    duration = '05:30';
    instructions = 'Положи руку на запястье и последовательно переключи внимание на 5 предметов, 4 тактильных ощущения, 3 звука.';
  } else if (normalizedPrompt.includes("энерг") || normalizedPrompt.includes("сил") || normalizedPrompt.includes("бодр") || normalizedPrompt.includes("утр") || normalizedPrompt.includes("wake") || normalizedPrompt.includes("energy")) {
    state = 'Shining';
    phrase = 'Внутренний огонь';
    reason = 'Твоё тело бодро и наполнено ресурсом. Самое время разжечь утреннее пламя воли.';
    ritualName = 'Огненное дыхание';
    ritualGroup = 'Энергия';
    duration = '05:05';
    instructions = 'Сядь прямо, делай резкие активные выдохи животом, раздувая искры внимания.';
  } else if (normalizedPrompt.includes("фокус") || normalizedPrompt.includes("работ") || normalizedPrompt.includes("сосредоточ") || normalizedPrompt.includes("focus") || normalizedPrompt.includes("work")) {
    state = 'Balance';
    phrase = 'Ясность мышления';
    reason = 'Для сложной задачи нужен кристально чистый фокус без отвлечений. Префронтальная кора готова включиться.';
    ritualName = 'Фокус внимания';
    ritualGroup = 'Ясность';
    duration = '10:00';
    instructions = 'Начни помидорку фокуса и фиксируй каждое отвлечение нажатием специальной кнопки.';
  }

  res.json({
    state,
    phrase,
    reason,
    ritualName,
    ritualGroup,
    duration,
    instructions
  });
});

async function startServer() {
  // Vite setup for developer preview / dynamic reloading
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server connected to Express");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
