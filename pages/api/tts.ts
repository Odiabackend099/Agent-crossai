import type { NextApiRequest, NextApiResponse } from 'next';
export const config = { api: { responseLimit: false } };

async function fetchWithRetry(url: string, tries = 2): Promise<Response> {
  let lastErr: any = null;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { method: 'GET', headers: { 'Cache-Control': 'no-store' } });
      if (r.ok) return r;
      lastErr = new Error(`TTS ${r.status}`);
    } catch (e) {
      lastErr = e;
    }
    await new Promise(r => setTimeout(r, 500));
  }
  throw lastErr ?? new Error('TTS failed');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const base = process.env.TTS_BASE_URL; // e.g. https://your-render-app.onrender.com/speak
    if (!base) return res.status(500).json({ ok: false, error: 'Missing TTS_BASE_URL' });

    // Preserve querystring (text, voice, mode=file, etc.)
    const idx = req.url?.indexOf('?') ?? -1;
    const qs  = idx >= 0 ? req.url!.substring(idx) : '';
    const url = `${base}${qs}`;

    const fr  = await fetchWithRetry(url, 2);

    const ct = fr.headers.get('content-type') || 'audio/mpeg';
    res.setHeader('Content-Type', ct);
    res.setHeader('Cache-Control', 'no-store');

    const ab = await fr.arrayBuffer();
    return res.status(fr.ok ? 200 : fr.status).send(Buffer.from(ab));
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'tts_proxy_failed' });
  }
}
