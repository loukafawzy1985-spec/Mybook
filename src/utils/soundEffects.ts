/**
 * Web Audio API synthesizer for interactive storybook sounds:
 * - Page turn sound (paper rustle)
 * - Quiz success chime
 * - Soap bubble pop
 * - Soothing ambient background melody generator
 */

let audioCtx: AudioContext | null = null;
let ambientOscillators: OscillatorNode[] = [];
let ambientGain: GainNode | null = null;
let isAmbientPlaying = false;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playPageTurnSound(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Buffer noise for paper rustle
    const bufferSize = ctx.sampleRate * 0.18;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(250, now + 0.18);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
  } catch {
    // Ignore audio errors on un-interacted browsers
  }
}

export function playSuccessChime(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + i * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  } catch {
    // Ignore
  }
}

export function playBubbleSound(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.09);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  } catch {
    // Ignore
  }
}

export function toggleAmbientMusic(shouldPlay: boolean, volume = 0.2): boolean {
  try {
    const ctx = getAudioContext();

    if (!shouldPlay && isAmbientPlaying) {
      if (ambientGain) {
        ambientGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        setTimeout(() => {
          ambientOscillators.forEach(o => {
            try { o.stop(); } catch {}
          });
          ambientOscillators = [];
        }, 700);
      }
      isAmbientPlaying = false;
      return false;
    }

    if (shouldPlay && !isAmbientPlaying) {
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(Math.min(volume, 0.3), ctx.currentTime + 1.2);
      masterGain.connect(ctx.destination);
      ambientGain = masterGain;

      // Soft harmonic drone chord in Pentatonic Hijaz/Peaceful Major (D, F#, A, D)
      const freqs = [146.83, 220.00, 293.66, 370.00, 440.00];
      ambientOscillators = [];

      freqs.forEach(f => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime);

        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(0.06, ctx.currentTime);

        osc.connect(subGain);
        subGain.connect(masterGain);

        osc.start();
        ambientOscillators.push(osc);
      });

      isAmbientPlaying = true;
      return true;
    }
  } catch {
    // Ignore
  }
  return isAmbientPlaying;
}
