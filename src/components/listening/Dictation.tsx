"use client";

import { useEffect, useState } from "react";
import { phraseScenes } from "@/data/phrases";
import { speak } from "@/lib/speech";
import { loadVoiceSettings, getVoiceByURI } from "@/components/VoiceSettings";
import { addStudyRecord } from "@/lib/storage";
import { Play, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import clsx from "clsx";

interface DictItem {
  en: string;
  jp: string;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.,!?'"`-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function tokensSimilarity(a: string, b: string): number {
  const ta = normalize(a).split(" ").filter(Boolean);
  const tb = normalize(b).split(" ").filter(Boolean);
  if (ta.length === 0 || tb.length === 0) return 0;
  let match = 0;
  const used = new Set<number>();
  for (const wa of ta) {
    const found = tb.findIndex((wb, i) => !used.has(i) && wa === wb);
    if (found >= 0) {
      match++;
      used.add(found);
    }
  }
  return match / Math.max(ta.length, tb.length);
}

function buildItems(): DictItem[] {
  const all = phraseScenes.flatMap((s) => s.phrases.map((p) => ({ en: p.en, jp: p.jp })));
  return all.sort(() => Math.random() - 0.5).slice(0, 10);
}

export default function Dictation({ onBack }: { onBack: () => void }) {
  const [items, setItems] = useState<DictItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [similarity, setSimilarity] = useState(0);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [done, setDone] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    setItems(buildItems());
  }, []);

  const current = items[idx];

  useEffect(() => {
    if (current) playAudio();
  }, [idx, current?.en]); // eslint-disable-line react-hooks/exhaustive-deps

  function playAudio() {
    if (!current) return;
    const s = loadVoiceSettings();
    speak(current.en, { voice: getVoiceByURI(s.voiceURI), rate: s.rate, lang: s.lang });
  }

  function handleCheck() {
    if (!current) return;
    const sim = tokensSimilarity(input, current.en);
    setSimilarity(sim);
    setShowResult(true);
    setStats((s) => ({
      correct: s.correct + (sim >= 0.8 ? 1 : 0),
      total: s.total + 1,
    }));
  }

  function handleNext() {
    if (idx + 1 >= items.length) {
      const minutes = Math.max(1, Math.round((Date.now() - startTime) / 60000));
      addStudyRecord({ activity: "phrases", durationMinutes: minutes, correctCount: stats.correct, totalCount: stats.total });
      setDone(true);
    } else {
      setIdx(idx + 1);
      setInput("");
      setShowResult(false);
      setSimilarity(0);
    }
  }

  if (done) {
    return (
      <div className="space-y-6">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">ディクテーション完了!</h2>
          <div className="text-6xl font-bold text-primary-600 mb-2">
            {stats.correct}<span className="text-2xl text-slate-400">/{stats.total}</span>
          </div>
          <p className="text-slate-600">
            正答率 {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}% (80%以上の類似度を正解)
          </p>
        </div>
        <button onClick={onBack} className="btn-primary w-full flex items-center justify-center gap-2">
          <RotateCcw size={18} /> メニューへ
        </button>
      </div>
    );
  }

  if (!current) return <div className="card">読み込み中...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium">
          <ChevronLeft size={18} /> 中断
        </button>
        <span className="text-sm text-slate-600 font-medium">{idx + 1} / {items.length}</span>
      </div>

      <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
        <div className="bg-purple-500 h-full transition-all" style={{ width: `${((idx + 1) / items.length) * 100}%` }} />
      </div>

      <div className="card space-y-4">
        <div className="flex items-center justify-center py-4">
          <button
            onClick={playAudio}
            className="bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full p-6 transition-all"
            aria-label="再生"
          >
            <Play size={36} />
          </button>
        </div>
        <p className="text-center text-sm text-slate-600">音声を聞いて、英文をタイピングしてください</p>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={showResult}
          placeholder="Type what you hear..."
          rows={3}
          className="w-full p-3 border border-slate-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none disabled:bg-slate-50"
        />

        {showResult && (
          <div
            className={clsx(
              "p-4 rounded-lg",
              similarity >= 0.8 ? "bg-green-50 border-l-4 border-green-400" : "bg-amber-50 border-l-4 border-amber-400"
            )}
          >
            <div className="text-sm font-bold mb-2">
              類似度: {Math.round(similarity * 100)}%
              {similarity >= 0.8 ? " ✓ 正解!" : " 要復習"}
            </div>
            <div className="text-xs text-slate-500 mb-1">正解:</div>
            <div className="font-medium text-slate-800">{current.en}</div>
            <div className="text-sm text-slate-600 mt-2">{current.jp}</div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          {!showResult ? (
            <button onClick={handleCheck} disabled={!input.trim()} className="btn-primary disabled:opacity-50">
              答え合わせ
            </button>
          ) : (
            <button onClick={handleNext} className="btn-primary flex items-center gap-1">
              {idx + 1 < items.length ? "次へ" : "結果"} <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
