/**
 * Pure, offline-compatible Arabic Text-to-Speech (TTS) Engine:
 * 1. Automatically locates and binds authentic Arabic voices (ar-SA, ar-EG, ar, Maged, Tarik, Laila, etc.)
 * 2. Overcomes Chrome's pause/hang bug using sentence chunking and heartbeat timer
 * 3. Handles tashkeel (diacritics) gracefully so engines never choke
 * 4. Eliminates any external blocked network URLs (no external translate.google.com requests)
 * 5. Provides synchronized word-by-word karaoke highlighting
 */

export interface SpeechCallbacks {
  onStart?: () => void;
  onWord?: (wordIndex: number, word: string) => void;
  onEnd?: () => void;
  onError?: (error: unknown) => void;
}

let cachedVoices: SpeechSynthesisVoice[] = [];
let heartbeatInterval: number | null = null;
let isSpeakingActive = false;
let karaokeTimer: number | null = null;

// Initialize voices cleanly
export function initVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve([]);
      return;
    }

    const load = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        cachedVoices = voices;
        resolve(voices);
      }
    };

    load();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        load();
      };
    }

    // Quick timeout fallback
    setTimeout(() => {
      if (cachedVoices.length === 0 && window.speechSynthesis) {
        cachedVoices = window.speechSynthesis.getVoices();
      }
      resolve(cachedVoices);
    }, 200);
  });
}

// Find best Arabic voice
export function getBestArabicVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Look for ar-SA / ar-EG / ar-*
  const arabicVoice = voices.find((v) => {
    const lang = (v.lang || '').toLowerCase().replace('_', '-');
    const name = (v.name || '').toLowerCase();
    return (
      lang.startsWith('ar') ||
      name.includes('arabic') ||
      name.includes('عربي') ||
      name.includes('maged') ||
      name.includes('tarik') ||
      name.includes('laila') ||
      name.includes('salma') ||
      name.includes('hoda') ||
      name.includes('zeina') ||
      name.includes('naayf') ||
      name.includes('shakir') ||
      name.includes('hamed') ||
      name.includes('mariam') ||
      name.includes('zayd')
    );
  });

  return arabicVoice || null;
}

// Remove tashkeel (diacritics) for voices that struggle with them
export function stripTashkeel(text: string): string {
  return text.replace(/[\u064B-\u065F\u0670\u0640]/g, '');
}

// Clean text for TTS (remove brackets, decorative quotes, non-letter symbols)
export function prepareTextForTTS(text: string): string {
  return text
    .replace(/[«»""''(){}\[\]]/g, '')
    .replace(/[^\u0600-\u06FF\s0-9.,!?،؛؟]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Split text into chunks for seamless, un-choked TTS in Chromium
 */
function splitIntoSentences(text: string): string[] {
  const parts = text.split(/([.!؟\n]+|،\s*)/);
  const result: string[] = [];
  let current = '';

  for (let i = 0; i < parts.length; i++) {
    const p = parts[i].trim();
    if (!p) continue;
    if (p.length < 5 && result.length > 0) {
      result[result.length - 1] += ' ' + p;
    } else {
      current = p;
      result.push(current);
    }
  }

  return result.length > 0 ? result : [text];
}

/**
 * Main Arabic speech function (100% self-contained, no external network calls)
 */
export async function speakArabicText(
  text: string,
  rate = 0.9,
  callbacks?: SpeechCallbacks
): Promise<void> {
  stopArabicSpeech();

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    callbacks?.onError?.(new Error('SpeechSynthesis not supported'));
    return;
  }

  // Tokenize words for accurate karaoke tracking
  const rawWords = text.split(/(\s+)/);
  const tokens: Array<{ wordIndex: number; word: string; start: number; end: number }> = [];
  let charCounter = 0;

  rawWords.forEach((w, idx) => {
    if (!/^\s+$/.test(w)) {
      tokens.push({
        wordIndex: idx,
        word: w,
        start: charCounter,
        end: charCounter + w.length,
      });
    }
    charCounter += w.length;
  });

  // Ensure voices are loaded
  await initVoices();
  const arabicVoice = getBestArabicVoice();

  isSpeakingActive = true;
  callbacks?.onStart?.();

  // Resume synthesis engine in case Chrome suspended it
  try {
    window.speechSynthesis.resume();
  } catch {}

  // Chrome Heartbeat to prevent premature stopping on longer speech
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  heartbeatInterval = window.setInterval(() => {
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      try {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      } catch {}
    }
  }, 8000);

  // Split into natural sentences
  const sentences = splitIntoSentences(text);
  let sentenceIdx = 0;

  const speakNextSentence = (useStrippedTashkeel = false) => {
    if (!isSpeakingActive || sentenceIdx >= sentences.length) {
      stopArabicSpeech();
      callbacks?.onEnd?.();
      return;
    }

    const currentChunk = sentences[sentenceIdx];
    const textToSpeak = useStrippedTashkeel
      ? stripTashkeel(prepareTextForTTS(currentChunk))
      : prepareTextForTTS(currentChunk);

    const utter = new SpeechSynthesisUtterance(textToSpeak);
    utter.lang = arabicVoice ? arabicVoice.lang : 'ar-SA';
    utter.rate = Math.max(0.65, Math.min(rate, 1.25));
    utter.pitch = 1.0;

    if (arabicVoice) {
      utter.voice = arabicVoice;
    }

    // Boundary event tracking
    let hasFiredBoundary = false;
    utter.onboundary = (e) => {
      if (!isSpeakingActive) return;
      hasFiredBoundary = true;
      const charIndex = e.charIndex;
      const currentSentenceStart = text.indexOf(currentChunk);
      const absIndex = (currentSentenceStart >= 0 ? currentSentenceStart : 0) + charIndex;

      const matchedToken = tokens.find((t) => absIndex >= t.start && absIndex <= t.end);
      if (matchedToken) {
        callbacks?.onWord?.(matchedToken.wordIndex, matchedToken.word);
      }
    };

    // Fallback word highlighting timer if browser engine doesn't fire boundary events
    if (karaokeTimer) clearInterval(karaokeTimer);
    const estimatedWords = currentChunk.split(/\s+/).filter(Boolean).length;
    const estimatedDurationMs = Math.max(1200, (estimatedWords * 550) / rate);
    const intervalMs = estimatedDurationMs / Math.max(1, estimatedWords);
    let wordCursor = 0;

    karaokeTimer = window.setInterval(() => {
      if (!hasFiredBoundary && isSpeakingActive && wordCursor < tokens.length) {
        callbacks?.onWord?.(tokens[wordCursor].wordIndex, tokens[wordCursor].word);
        wordCursor++;
      } else {
        if (karaokeTimer) clearInterval(karaokeTimer);
      }
    }, intervalMs);

    utter.onend = () => {
      if (karaokeTimer) clearInterval(karaokeTimer);
      sentenceIdx++;
      if (sentenceIdx < sentences.length && isSpeakingActive) {
        speakNextSentence(useStrippedTashkeel);
      } else {
        stopArabicSpeech();
        callbacks?.onEnd?.();
      }
    };

    utter.onerror = (event: SpeechSynthesisErrorEvent) => {
      if (karaokeTimer) clearInterval(karaokeTimer);

      // Ignore normal cancel/interrupted events (user turned page or paused)
      if (event.error === 'canceled' || event.error === 'interrupted') {
        return;
      }

      // If failed with diacritics, retry once cleanly without diacritics
      if (!useStrippedTashkeel) {
        speakNextSentence(true);
        return;
      }

      // If still error, end gracefully
      stopArabicSpeech();
      callbacks?.onError?.(event);
    };

    try {
      window.speechSynthesis.speak(utter);
    } catch (err) {
      stopArabicSpeech();
      callbacks?.onError?.(err);
    }
  };

  speakNextSentence(false);
}

/**
 * Stop any current speech and clear timers
 */
export function stopArabicSpeech(): void {
  isSpeakingActive = false;

  if (typeof window !== 'undefined') {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }

    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }

    if (karaokeTimer) {
      clearInterval(karaokeTimer);
      karaokeTimer = null;
    }
  }
}
