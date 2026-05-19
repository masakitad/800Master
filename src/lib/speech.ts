let cachedVoices: SpeechSynthesisVoice[] | null = null;
let voicesPromise: Promise<SpeechSynthesisVoice[]> | null = null;
let speakSeq = 0;

const PREFERRED_VOICE_NAMES = [
  "Google US English",
  "Google UK English Female",
  "Google UK English Male",
  "Microsoft Aria Online (Natural) - English (United States)",
  "Microsoft Jenny Online (Natural) - English (United States)",
  "Microsoft Guy Online (Natural) - English (United States)",
  "Microsoft Aria",
  "Microsoft Jenny",
  "Microsoft Guy",
  "Samantha",
  "Alex",
  "Karen",
];

export function isSpeechAvailable(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export async function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!isSpeechAvailable()) return [];
  if (cachedVoices && cachedVoices.length > 0) return cachedVoices;
  if (voicesPromise) return voicesPromise;

  voicesPromise = new Promise((resolve) => {
    const synth = window.speechSynthesis;
    const existing = synth.getVoices();
    if (existing.length > 0) {
      cachedVoices = existing;
      resolve(existing);
      return;
    }
    let settled = false;
    const finish = (voices: SpeechSynthesisVoice[]) => {
      if (settled) return;
      settled = true;
      synth.removeEventListener("voiceschanged", handler);
      if (voices.length > 0) cachedVoices = voices;
      else voicesPromise = null;
      resolve(voices);
    };
    const handler = () => {
      const voices = synth.getVoices();
      if (voices.length > 0) finish(voices);
    };
    synth.addEventListener("voiceschanged", handler);
    setTimeout(() => finish(synth.getVoices()), 1500);
  });
  return voicesPromise;
}

function rankVoice(voice: SpeechSynthesisVoice): number {
  const name = voice.name;
  let score = 0;
  const idx = PREFERRED_VOICE_NAMES.findIndex((p) => name.includes(p));
  if (idx >= 0) score += 1000 - idx * 10;
  if (/natural/i.test(name)) score += 200;
  if (/neural/i.test(name)) score += 200;
  if (/premium|enhanced/i.test(name)) score += 100;
  if (/google/i.test(name)) score += 80;
  if (/microsoft/i.test(name)) score += 60;
  if (/apple|samantha|alex|karen/i.test(name)) score += 40;
  if (voice.localService) score += 10;
  return score;
}

export async function pickBestVoice(lang: "en-US" | "en-GB" | "en" = "en-US"): Promise<SpeechSynthesisVoice | null> {
  const voices = await loadVoices();
  if (voices.length === 0) return null;
  const targetPrefix = lang.split("-")[0];
  const candidates = voices.filter((v) => v.lang.startsWith(targetPrefix));
  if (candidates.length === 0) return null;
  const exactLang = candidates.filter((v) => v.lang === lang);
  const pool = exactLang.length > 0 ? exactLang : candidates;
  return pool.sort((a, b) => rankVoice(b) - rankVoice(a))[0];
}

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: "en-US" | "en-GB" | "en";
  voice?: SpeechSynthesisVoice | null;
  onEnd?: () => void;
  onStart?: () => void;
}

export async function speak(text: string, options: SpeakOptions = {}): Promise<void> {
  if (!isSpeechAvailable()) return;
  const synth = window.speechSynthesis;
  const mySeq = ++speakSeq;
  synth.cancel();

  const voice = options.voice ?? (await pickBestVoice(options.lang ?? "en-US"));
  if (mySeq !== speakSeq) return;

  const utter = new SpeechSynthesisUtterance(text);
  if (voice) utter.voice = voice;
  utter.lang = options.lang ?? "en-US";
  utter.rate = options.rate ?? 0.95;
  utter.pitch = options.pitch ?? 1.0;
  utter.volume = options.volume ?? 1.0;
  if (options.onStart) utter.onstart = options.onStart;
  if (options.onEnd) utter.onend = options.onEnd;

  synth.cancel();
  synth.speak(utter);
}

export function stopSpeech(): void {
  if (!isSpeechAvailable()) return;
  speakSeq++;
  window.speechSynthesis.cancel();
}

export function listEnglishVoices(): SpeechSynthesisVoice[] {
  if (!cachedVoices) return [];
  return cachedVoices
    .filter((v) => v.lang.startsWith("en"))
    .sort((a, b) => rankVoice(b) - rankVoice(a));
}
