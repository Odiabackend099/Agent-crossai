# CrossAI – Voice-Ready Next.js (Vercel)

This project ships with:
- `/api/reply` – calls OpenAI (model: gpt-4o-mini)
- `/api/tts` – proxies to your Render TTS `/speak` endpoint (no caching + simple retry)
- Global widget (`public/pronto-voice-widget.js`) injected via `pages/_document.tsx`
- `/voice.html` quick tester page

## Deploy (GitHub → Vercel)

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Set **Environment Variables** in Vercel:
   - `OPENAI_API_KEY` = your OpenAI key
   - `TTS_BASE_URL`   = `https://<your-render-app>.onrender.com/speak`
4. Deploy. Then visit:
   - `/api/health` → `{ ok: true }`
   - `/voice.html` → synth test
   - mic button on any page (bottom-right)

## Local dev
```bash
npm i
npm run dev
# open http://localhost:3000
```
