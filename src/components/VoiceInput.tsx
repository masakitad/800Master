"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, AlertCircle } from "lucide-react";
import { SpeechRecognizer, isRecognitionAvailable } from "@/lib/recognition";
import clsx from "clsx";

export interface VoiceInputProps {
  lang?: "en-US" | "en-GB" | "ja-JP";
  onTranscript: (text: string, isFinal: boolean) => void;
  onError?: (msg: string) => void;
  className?: string;
  label?: string;
}

export default function VoiceInput({
  lang = "en-US",
  onTranscript,
  onError,
  className,
  label,
}: VoiceInputProps) {
  const [listening, setListening] = useState(false);
  const [available, setAvailable] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const recognizerRef = useRef<SpeechRecognizer | null>(null);

  useEffect(() => {
    setAvailable(isRecognitionAvailable());
  }, []);

  useEffect(() => () => recognizerRef.current?.abort(), []);

  function toggle() {
    if (!available) return;
    if (listening) {
      recognizerRef.current?.stop();
      return;
    }
    setError(null);
    const recognizer = new SpeechRecognizer({
      lang,
      interimResults: true,
      continuous: false,
      onResult: (r) => onTranscript(r.transcript, r.isFinal),
      onError: (e) => {
        setError(e);
        onError?.(e);
        setListening(false);
      },
      onStart: () => setListening(true),
      onEnd: () => setListening(false),
    });
    recognizerRef.current = recognizer;
    const ok = recognizer.start();
    if (!ok) setError("マイクの開始に失敗しました");
  }

  if (!available) {
    return (
      <button
        disabled
        className={clsx("p-2 rounded-lg bg-slate-100 text-slate-400 cursor-not-allowed", className)}
        title="このブラウザは音声入力に対応していません"
      >
        <MicOff size={20} />
      </button>
    );
  }

  return (
    <div className="relative inline-flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        className={clsx(
          "p-2 rounded-lg transition-all",
          listening
            ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-300"
            : "bg-primary-100 text-primary-700 hover:bg-primary-200",
          className
        )}
        aria-label={listening ? "停止" : "話す"}
        title={listening ? "停止 (もう一度クリック)" : label ?? "クリックして話す"}
      >
        <Mic size={20} />
      </button>
      {error && (
        <span className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </span>
      )}
    </div>
  );
}
