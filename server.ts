import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory + persistent fallback high scores
interface ServerScore {
  id: string;
  name: string;
  score: number;
  rank: string;
  ordersCompleted: number;
  difficulty: string;
  date: string;
  isBackendScore: boolean;
}

let highScores: ServerScore[] = [
  {
    id: 'score-1',
    name: 'Austin (Burnet Founder)',
    score: 480,
    rank: 'MOJO LEGEND',
    ordersCompleted: 7,
    difficulty: 'DRIVE_THRU_DASH',
    date: 'Oct 27, 2026',
    isBackendScore: true
  },
  {
    id: 'score-2',
    name: 'Forrest (Cedar Park)',
    score: 435,
    rank: 'RUSH MASTER',
    ordersCompleted: 6,
    difficulty: 'DRIVE_THRU_DASH',
    date: 'Oct 26, 2026',
    isBackendScore: true
  },
  {
    id: 'score-3',
    name: 'Lloyd (Georgetown)',
    score: 390,
    rank: 'RUSH MASTER',
    ordersCompleted: 5,
    difficulty: 'MORNING_RUSH',
    date: 'Oct 25, 2026',
    isBackendScore: true
  },
  {
    id: 'score-4',
    name: 'Marble Falls Speedster',
    score: 320,
    rank: 'RUSH MASTER',
    ordersCompleted: 4,
    difficulty: 'DRIVE_THRU_DASH',
    date: 'Oct 24, 2026',
    isBackendScore: true
  },
  {
    id: 'score-5',
    name: 'Liberty Hill Barista',
    score: 260,
    rank: 'MOJO REGULAR',
    ordersCompleted: 4,
    difficulty: 'MORNING_RUSH',
    date: 'Oct 23, 2026',
    isBackendScore: true
  }
];

// High Score API Endpoints
app.get('/api/scores', (_req, res) => {
  // Sort descending by score
  const sorted = [...highScores].sort((a, b) => b.score - a.score).slice(0, 10);
  res.json({ success: true, scores: sorted });
});

app.post('/api/scores', (req, res) => {
  try {
    const { name, score, rank, ordersCompleted, difficulty } = req.body;
    if (typeof score !== 'number') {
      res.status(400).json({ error: 'Valid score is required' });
      return;
    }

    const newEntry: ServerScore = {
      id: `score-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: (name && String(name).trim()) || 'Texas Racer',
      score,
      rank: rank || 'MOJO REGULAR',
      ordersCompleted: Number(ordersCompleted) || 1,
      difficulty: difficulty || 'DRIVE_THRU_DASH',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isBackendScore: true
    };

    highScores.push(newEntry);
    highScores.sort((a, b) => b.score - a.score);
    // Keep top 20
    if (highScores.length > 20) {
      highScores = highScores.slice(0, 20);
    }

    res.json({ success: true, scores: highScores.slice(0, 10), entry: newEntry });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record score' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Setup Vite middlewares for dev or static serving for prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, () => {
    console.log(`Mojo Rush Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
