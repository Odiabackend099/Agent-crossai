(() => {
  if (window.__PRONTO_VOICE_WIDGET__) return;
  window.__PRONTO_VOICE_WIDGET__ = true;

  async function loadConfig() {
    try {
      const r = await fetch('/agent.config.json', { cache: 'no-store' });
      if (!r.ok) throw new Error('config fetch failed');
      return await r.json();
    } catch {
      return {
        agent: { name: 'CrossAI', baseUrl: '/api/reply' },
        tts: { baseUrl: '/api/tts', voice: 'en-NG-EzinneNeural', mode: 'file' },
        ui: { position: 'bottom-right', theme: 'system' }
      };
    }
  }

  function makeButton() {
    const btn = document.createElement('button');
    btn.id = 'pronto-voice-btn';
    btn.textContent = '🎤';
    Object.assign(btn.style, {
      position: 'fixed',
      zIndex: 2147483647,
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      border: 'none',
      fontSize: '24px',
      color: '#fff',
      background: '#16a34a',
      boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
      cursor: 'pointer'
    });
    return btn;
  }

  function placeButton(btn, position) {
    const pos = (position || 'bottom-right').toLowerCase();
    const base = { margin: '20px' };
    if (pos.includes('bottom')) {
      btn.style.bottom = base.margin;
    } else {
      btn.style.top = base.margin;
    }
    if (pos.includes('right')) {
      btn.style.right = base.margin;
    } else {
      btn.style.left = base.margin;
    }
  }

  function toast(msg) {
    try {
      const t = document.createElement('div');
      t.textContent = msg;
      Object.assign(t.style, {
        position: 'fixed', bottom: '90px', right: '20px',
        background: '#111827', color: '#fff', padding: '10px 12px',
        borderRadius: '8px', fontSize: '14px', zIndex: 2147483647,
        boxShadow: '0 6px 18px rgba(0,0,0,0.3)'
      });
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 3500);
    } catch {}
  }

  async function askAndSpeak(cfg) {
    try {
      const input = window.prompt('Type what you want me to say:');
      if (!input) return;

      toast('Thinking…');
      const ar = await fetch(cfg.agent.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input })
      });
      const aj = await ar.json().catch(() => null);
      const reply = aj?.text || 'I dey here. How far?';

      toast('Voicing…');
      const ttsUrl = `${cfg.tts.baseUrl}?mode=${encodeURIComponent(cfg.tts.mode || 'file')}` +
                     `&voice=${encodeURIComponent(cfg.tts.voice || 'en-NG-EzinneNeural')}` +
                     `&text=${encodeURIComponent(reply)}`;

      const tr = await fetch(ttsUrl, { cache: 'no-store' });
      if (!tr.ok) throw new Error('TTS failed');
      const blob = await tr.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play().catch(() => {
        const a = document.createElement('audio');
        a.controls = true;
        a.src = url;
        document.body.appendChild(a);
        toast('Tap play to hear.');
      });
    } catch (e) {
      console.error('voice widget error', e);
      toast('Voice failed. Try again.');
    }
  }

  loadConfig().then(cfg => {
    const btn = makeButton();
    placeButton(btn, cfg?.ui?.position);
    btn.addEventListener('click', () => askAndSpeak(cfg));
    document.addEventListener('DOMContentLoaded', () => document.body.appendChild(btn));
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      // Already ready
      try { document.body.appendChild(btn); } catch {}
    }
  });
})();
