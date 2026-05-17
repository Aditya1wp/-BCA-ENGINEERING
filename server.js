import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import handler from './api/chat.js';
import uploadHandler from './api/upload.js';

dotenv.config();

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(__dirname));

// Use the exact same handler from the api directory to test Vercel functions locally
app.post('/api/chat', async (req, res) => {
    try {
        await handler(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/upload', async (req, res) => {
    try {
        await uploadHandler(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/upload', async (req, res) => {
    try {
        await uploadHandler(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Proxy endpoint to bypass CORS and adblockers for PUP scraping
app.get('/api/news', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    try {
        const response = await fetch('https://www.pup.ac.in/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept': 'text/html,application/xhtml+xml,application/xml'
            }
        });
        if (!response.ok) {
            throw new Error(`PUP server responded with ${response.status}`);
        }
        const html = await response.text();
        res.send({ contents: html });
    } catch (error) {
        console.error("Local proxy fetch error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Local dev server running at http://localhost:${port}`);
    console.log(`Please open your browser to http://localhost:${port} to see the changes!`);
});
