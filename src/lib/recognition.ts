"use client";

export interface RecognitionResult {
  transcript: string;
  isFinal: boolean;
  confidence: number;
}

export interface RecognitionOptions {
  lang?: "en-US" | "en-GB" | "ja-JP";
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (result: RecognitionResult) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
  onStart?: () => void;
}

interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: Event) => void) | null;
  onerror: ((e: Event) => void) | null;
  onend: ((e: Event) => void) | null;
  onstart: ((e: Event) => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionLike;
}

function getRecognitionCtor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isRecognitionAvailable(): boolean {
  return getRecognitionCtor() !== null;
}

export class SpeechRecognizer {
  private recognition: SpeechRecognitionLike | null = null;
  private opts: RecognitionOptions;
  private listening = false;

  constructor(opts: RecognitionOptions = {}) {
    this.opts = opts;
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;
    const r = new Ctor();
    r.lang = opts.lang ?? "en-US";
    r.continuous = opts.continuous ?? false;
    r.interimResults = opts.interimResults ?? true;
    r.maxAlternatives = 1;

    r.onresult = (e: Event) => {
      const ev = e as unknown as {
        results: ArrayLike<ArrayLike<{ transcript: string; confidence: number }> & { isFinal: boolean }>;
        resultIndex: number;
      };
      let finalText = "";
      let interimText = "";
      let lastConfidence = 0;
      for (let i = 0; i < ev.results.length; i++) {
        const res = ev.results[i];
        const alt = res[0];
        if (res.isFinal) {
          finalText += alt.transcript;
          lastConfidence = alt.confidence ?? lastConfidence;
        } else {
          interimText += alt.transcript;
        }
      }
      const combined = (finalText + interimText).replace(/\s+/g, " ").trim();
      const allFinal = interimText === "" && finalText !== "";
      this.opts.onResult?.({
        transcript: combined,
        confidence: lastConfidence,
        isFinal: allFinal,
      });
    };
    r.onerror = (e: Event) => {
      const ev = e as unknown as { error: string };
      this.opts.onError?.(ev.error || "unknown error");
    };
    r.onend = () => {
      this.listening = false;
      this.opts.onEnd?.();
    };
    r.onstart = () => {
      this.listening = true;
      this.opts.onStart?.();
    };
    this.recognition = r;
  }

  start(): boolean {
    if (!this.recognition || this.listening) return false;
    try {
      this.recognition.start();
      return true;
    } catch {
      return false;
    }
  }

  stop(): void {
    if (!this.recognition || !this.listening) return;
    try {
      this.recognition.stop();
    } catch {
      // ignore
    }
  }

  abort(): void {
    if (!this.recognition) return;
    try {
      this.recognition.abort();
    } catch {
      // ignore
    }
  }

  get isListening(): boolean {
    return this.listening;
  }
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,!?'"`-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function pronunciationScore(spoken: string, target: string): number {
  const a = normalize(spoken).split(" ").filter(Boolean);
  const b = normalize(target).split(" ").filter(Boolean);
  if (a.length === 0 || b.length === 0) return 0;
  let matched = 0;
  const used = new Set<number>();
  for (const wa of a) {
    const idx = b.findIndex((wb, i) => !used.has(i) && wa === wb);
    if (idx >= 0) {
      matched++;
      used.add(idx);
    }
  }
  return Math.round((matched / Math.max(a.length, b.length)) * 100);
}
