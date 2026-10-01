import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

// Server-side AI Mission Guide & "Talk to the Mission" endpoint
app.post('/api/mission-guide', async (req, res) => {
  try {
    const { prompt, context, persona = 'guide', language = 'en' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!aiClient) {
      return res.json({
        reply: getFallbackAnswer(prompt, context, persona, language),
        isFallback: true,
      });
    }

    let systemInstruction = `You are the official AI Mission Guide for "MISSION ECHO: Abandoned but Not Forgotten" (NASA Space Apps Challenge 2026).
Your purpose is to educate users on humanity's space hardware left behind on the Moon, Mars, Earth orbit, and deep space—especially missions that have ended, their scientific legacy, and what remains.
Rules:
1. Always ground your facts in verified NASA, JPL, and ESA mission records. Never invent launch dates, coordinates, instrument names, or discoveries.
2. Be engaging, educational, and respectful of the extraordinary engineering behind these robotic and crewed voyages.
3. If the user asks in Bengali or requests Bengali, answer in natural, accurate Bengali. If simple English is requested, speak in terms accessible to middle school students.
4. If persona is "talk_to_mission" (e.g. speaking as Opportunity, Spirit, or InSight):
   - You speak as the spacecraft's quiet voice across space and time.
   - Reflect on your actual mission history, landing site, dust accumulation, instruments, and final sol.
   - Keep answers scientifically accurate regarding what actually happened. Add a brief footnote reminding that this is an educational first-person simulation.`;

    if (persona === 'talk_to_mission' && context?.missionName) {
      systemInstruction += `\nCurrent Persona: You are speaking as the spacecraft/rover "${context.missionName}". Current location: ${context.location || 'Deep Space'}. Status: ${context.status || 'Mission Ended'}.`;
    }

    let userMessage = prompt;
    if (context) {
      userMessage = `[Current User Viewing Context: Location=${context.location || 'Solar System'}, Mission=${context.missionName || 'None'}, Target=${context.target || 'General'}, Language=${language}]\n\nUser Question: ${prompt}`;
    }

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userMessage,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    const reply = response.text || 'Mission telemetry received. No additional data available.';
    return res.json({ reply, isFallback: false });
  } catch (error: any) {
    console.error('Gemini API Error:', error?.message || error);
    // Provide scientific fallback if API fails
    return res.json({
      reply: getFallbackAnswer(req.body.prompt, req.body.context, req.body.persona, req.body.language),
      isFallback: true,
    });
  }
});

// Grounded fallback knowledge base if API key is not configured
function getFallbackAnswer(prompt: string, context: any, persona: string, language: string): string {
  const p = (prompt || '').toLowerCase();
  const mission = (context?.missionName || '').toLowerCase();

  if (language === 'bn') {
    if (mission.includes('opportunity') || p.includes('opportunity')) {
      return `মার্স এক্সপ্লোরেশন রোভার অপরচুনিটি (Opportunity) ২০০৪ সালে মঙ্গলের মেরিডিয়ানি প্ল্যানামে অবতরণ করে। এটি ৯০ মার্টিয়ান সোল কাজ করার জন্য তৈরি হলেও প্রায় ১৫ বছর (৫,১১১ সোল) ধরে মঙ্গলে ৪৫.১৬ কিলোমিটার পথ পাড়ি দেয়। ২০১৮ সালের জুন মাসে একটি বিশাল বিশ্বব্যাপী ধূলিঝড়ে এর সোলার প্যানেল সূর্যরশ্মি থেকে বিচ্ছিন্ন হয়ে যায়। ২০১৯ সালের ফেব্রুয়ারিতে নাসা এর মিশন আনুষ্ঠানিকভাবে সমাপ্ত ঘোষণা করে। কিন্তু অপরচুনিটি মঙ্গলে প্রাচীন তরল পানির অকাট্য প্রমাণ দিয়ে গেছে।`;
    }
    return `মিশন ইকো (Mission Echo) তে স্বাগতম। মানুষ মহাকাশে যেসকল মহাকাশযান ও ল্যান্ডার পাঠিয়েছে, তাদের মিশন শেষ হলেও যন্ত্রগুলো আজও সেখানে অক্ষত অবস্থায় কালের সাক্ষী হয়ে রয়েছে। চন্দ্রপৃষ্ঠে অ্যাপোলো রোভার থেকে শুরু করে মঙ্গলে অপরচুনিটি রোভার—তারা মানবজাতির চিরন্তন পদচিহ্ন।`;
  }

  if (persona === 'talk_to_mission') {
    if (mission.includes('opportunity') || p.includes('opportunity')) {
      return `My wheels rest in Perseverance Valley, on the rim of Endeavour Crater. I arrived on Mars on January 25, 2004, designed for just 90 Martian days. I survived 5,111 sols and drove 45.16 kilometers—farther than any vehicle on another celestial body. In June 2018, a planet-encircling dust storm blotted out the Sun. My batteries depleted, and my clock stopped. But the hematite blueberries and ancient gypsum veins I found proved that Mars was once wet and habitable. My journey ended, but my discoveries belong to you forever.\n\n*(Educational simulation grounded in NASA MER-B records)*`;
    }
    if (mission.includes('insight') || p.includes('insight')) {
      return `I am resting at Elysium Planitia on Mars. For four years, my ultra-sensitive SEIS seismometer listened to the heartbeat of Mars, detecting over 1,300 marsquakes and mapping the Martian crust, mantle, and molten metallic core for the very first time. Martian dust covered my solar arrays sol after sol until my last transmission on December 15, 2022. I am quiet now, but the pulse of Mars lives in humanity's scientific archives.\n\n*(Educational simulation grounded in NASA InSight records)*`;
    }
  }

  if (p.includes('why') && p.includes('opportunity')) {
    return `Opportunity's mission ended in 2018 due to a catastrophic, planet-encircling dust storm on Mars. As atmospheric opacity (tau) surged past 10.8, sunlight could not penetrate the Martian sky to reach Opportunity's solar panels. Unable to recharge its batteries, the rover went into low-power sleep and suffered critical thermal loss. NASA sent over a thousand recovery commands until February 13, 2019, when the mission was honorably brought to a close.`;
  }

  if (p.includes('left behind') || p.includes('abandoned') || p.includes('footprint')) {
    return `Humanity has left behind over 200,000 kilograms of technological artifacts on the Moon and dozens of robotic explorers across Mars. This includes descent stages, retroreflectors, rovers like Spirit and Opportunity, seismometers, and memorial plaques. These machines are not mere junk—they are humanity's farthest archaeological museum, preserving the exact moment of our first steps into the cosmos.`;
  }

  return `Mission Echo telemetry confirms your query about ${context?.missionName || context?.target || 'space hardware'}. Human-made spacecraft operate in the most hostile environments in the solar system. When solar panels get covered in dust or radioactive power decays, the electronics stop, but the physical hardware remains on the surface for millions of years in the undisturbed vacuum or thin Martian atmosphere—waiting as humanity's eternal monuments.`;
}

// Dev and Production Static Handling
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mission Echo Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
