"use client";

import { useEffect, useRef, useState } from "react";
import { phraseScenes } from "@/data/phrases";
import { speak, stopSpeech } from "@/lib/speech";
import { loadVoiceSettings, getVoiceByURI } from "@/components/VoiceSettings";
import { SpeechRecognizer, isRecognitionAvailable, pronunciationScore } from "@/lib/recognition";
import { addStudyRecord } from "@/lib/storage";
import { Mic, MicOff, Play, RotateCcw, ChevronRight, ChevronLeft, AlertCircle, Volume2 } from "lucide-react";
import clsx from "clsx";

interface Item {
  en: string;
  jp: string;
}

function buildItems(category?: string): Item[] {
  const all = phraseScenes
    .filter((s) => !category || s.category === category)
    .flatMap((s) => s.phrases);
  return [...all].sort(() => Math.random() - 0.5).slice(0, 10);
}

export default function PronunciationPage() {
  const [category, setCategory] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [idx, setIdx] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const [startTime] = useState(Date.now());
  const recognizerRef = useRef<SpeechRecognizer | null>(null);
  const available = isRecognitionAvailable();

  const current = items[idx];

  useEffect(
    () => () => {
      recognizerRef.current?.abort();
      stopSpeech();
    },
    []
  );

  function startSession(cat: string | null) {
    setCategory(cat);
    setItems(buildItems(cat ?? undefined));
    setIdx(0);
    setTranscript("");
    setScore(null);
    setListening(false);
    setError(null);
    setDone(false);
    setHistory([]);
  }

  function playReference() {
    if (!current) return;
    const s = loadVoiceSettings();
    speak(current.en, { voice: getVoiceByURI(s.voiceURI), rate: s.rate, lang: s.lang });
  }

  function startListening() {
    if (!current || !available) return;
    setTranscript("");
    setScore(null);
    setError(null);
    const recognizer = new SpeechRecognizer({
      lang: "en-US",
      interimResults: true,
      continuous: false,
      onResult: (r) => {
        setTranscript(r.transcript);
        if (r.isFinal) {
          const s = pronunciationScore(r.transcript, current.en);
          setScore(s);
        }
      },
      onError: (e) => {
        setError(e);
        setListening(false);
      },
      onStart: () => setListening(true),
      onEnd: () => setListening(false),
    });
    recognizerRef.current = recognizer;
    recognizer.start();
  }

  function stopListening() {
    recognizerRef.current?.stop();
  }

  function nextItem() {
    if (score != null) setHistory([...history, score]);
    if (idx + 1 >= items.length) {
      const finalHistory = score != null ? [...history, score] : history;
      const avg = finalHistory.length > 0
        ? Math.round(finalHistory.reduce((a, b) => a + b, 0) / finalHistory.length)
        : 0;
      const minutes = Math.max(1, Math.round((Date.now() - startTime) / 60000));
      addStudyRecord({
        activity: "phrases",
        durationMinutes: minutes,
        correctCount: finalHistory.filter((s) => s >= 80).length,
        totalCount: finalHistory.length,
      });
      setDone(true);
      return;
    }
    setIdx(idx + 1);
    setTranscript("");
    setScore(null);
    setError(null);
  }

  function reset() {
    setCategory(null);
    setItems([]);
    setIdx(0);
    setDone(false);
    setHistory([]);
  }

  if (!available) {
    return (
      <div className="space-y-4">
        <header>
          <h1 className="text-2xl font-bold text-slate-800">発音練習</h1>
        </header>
        <div className="card bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-slate-800">音声認識に対応していません</h3>
              <p className="text-sm text-slate-600 mt-1">
                発音練習を使うには Chrome、Edge、Safari など SpeechRecognition API に対応したブラウザをご利用ください。
                マイクへのアクセス許可も必要です。
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!category && items.length === 0) {
    const categories = Array.from(new Set(phraseScenes.map((s) => s.category)));
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Mic className="text-emerald-500" /> 発音練習・シャドーイング
          </h1>
          <p className="text-slate-600 mt-1">
            お手本の音声 → 発音 → 一致度を採点。スピーキング力を伸ばします。
          </p>
        </header>

        <div className="card bg-emerald-50 border-emerald-200 text-sm text-emerald-900">
          <ol className="list-decimal ml-5 space-y-1">
            <li>「お手本を聞く」でネイティブ音声を再生</li>
            <li>「話す」をクリックして発音 (マイク許可が必要)</li>
            <li>認識結果と一致度スコアを確認 (80%以上で「正解」)</li>
          </ol>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button onClick={() => startSession(null)} className="card text-left hover:shadow-md">
            <h3 className="font-bold text-slate-800">全カテゴリから10問</h3>
            <p className="text-sm text-slate-600 mt-1">ランダムに10フレーズで練習</p>
          </button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => startSession(cat)} className="card text-left hover:shadow-md">
              <h3 className="font-bold text-slate-800">{cat}カテゴリ</h3>
              <p className="text-sm text-slate-600 mt-1">{cat}カテゴリから10問</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (done) {
    const avg = history.length > 0
      ? Math.round(history.reduce((a, b) => a + b, 0) / history.length)
      : 0;
    const goodCount = history.filter((s) => s >= 80).length;

    return (
      <div className="space-y-6">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">発音練習完了!</h2>
          <div className="text-6xl font-bold text-emerald-600 mb-1">{avg}<span className="text-2xl text-slate-400">点</span></div>
          <p className="text-slate-600">平均スコア</p>
          <div className="grid grid-cols-2 gap-3 mt-4 max-w-sm mx-auto">
            <div className="bg-green-50 rounded-xl p-3">
              <div className="text-2xl font-bold text-green-700">{goodCount}</div>
              <div className="text-xs text-green-600">80%以上</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-2xl font-bold text-slate-700">{history.length}</div>
              <div className="text-xs text-slate-600">挑戦数</div>
            </div>
          </div>
        </div>
        <button onClick={reset} className="btn-primary w-full flex items-center justify-center gap-2">
          <RotateCcw size={18} /> 別のカテゴリで挑戦
        </button>
      </div>
    );
  }

  if (!current) return <div className="card">読み込み中...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={reset} className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium">
          <ChevronLeft size={18} /> 中断
        </button>
        <span className="text-sm text-slate-600 font-medium">{idx + 1} / {items.length}</span>
      </div>

      <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
        <div className="bg-emerald-500 h-full transition-all" style={{ width: `${((idx + 1) / items.length) * 100}%` }} />
      </div>

      <div className="card space-y-4">
        <div className="text-center space-y-2">
          <div className="text-xs text-slate-500 uppercase tracking-wider">お手本</div>
          <div className="text-2xl font-bold text-slate-800 leading-relaxed">{current.en}</div>
          <div className="text-sm text-slate-600">{current.jp}</div>
          <button
            onClick={playReference}
            className="mt-2 inline-flex items-center gap-2 btn-outline text-sm"
          >
            <Volume2 size={16} /> お手本を聞く
          </button>
        </div>

        <div className="border-t border-slate-200 pt-4 space-y-3">
          <div className="text-center">
            <button
              onClick={listening ? stopListening : startListening}
              className={clsx(
                "rounded-full p-6 transition-all",
                listening
                  ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-300"
                  : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md"
              )}
              aria-label={listening ? "停止" : "話す"}
            >
              <Mic size={36} />
            </button>
            <p className="text-sm text-slate-600 mt-2">
              {listening ? "聞き取り中... 終わったら停止" : "ボタンを押して発音"}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm p-3 rounded flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {transcript && (
            <div className="bg-slate-50 p-3 rounded text-sm space-y-1">
              <div className="text-xs text-slate-500">あなたの発音 (認識結果)</div>
              <div className="text-slate-800">{transcript}</div>
            </div>
          )}

          {score != null && (
            <div
              className={clsx(
                "p-4 rounded-lg text-center",
                score >= 80
                  ? "bg-green-50 border-2 border-green-300"
                  : score >= 50
                  ? "bg-amber-50 border-2 border-amber-300"
                  : "bg-red-50 border-2 border-red-300"
              )}
            >
              <div className="text-4xl font-bold text-slate-800">{score}<span className="text-xl text-slate-500">%</span></div>
              <div className="text-sm text-slate-700 mt-1">
                {score >= 80 ? "✓ 良い発音!" : score >= 50 ? "もう少し!" : "再挑戦しましょう"}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button onClick={nextItem} disabled={score == null} className="btn-primary disabled:opacity-50 flex items-center gap-1">
            {idx + 1 < items.length ? "次へ" : "結果"} <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
