"use client";

import { useState, useEffect } from "react";
import { vocabulary, getVocabByLevel } from "@/data/vocabulary";
import { VocabWord } from "@/lib/types";
import { updateVocabProgress, addStudyRecord, getDueWords, loadProgress } from "@/lib/storage";
import { speak } from "@/lib/speech";
import { loadVoiceSettings, getVoiceByURI } from "@/components/VoiceSettings";
import { RotateCcw, Check, X, Volume2 } from "lucide-react";
import clsx from "clsx";

type Level = "all" | "basic" | "intermediate" | "advanced" | "due";

const levelLabels: Record<Level, string> = {
  all: "全て",
  basic: "基礎 (500-600)",
  intermediate: "中級 (600-750)",
  advanced: "上級 (750-900)",
  due: "復習が必要",
};

export default function VocabPage() {
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [words, setWords] = useState<VocabWord[]>([]);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  const [startTime, setStartTime] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (selectedLevel) {
      let list: VocabWord[];
      if (selectedLevel === "all") list = [...vocabulary];
      else if (selectedLevel === "due") {
        const dueIds = getDueWords(vocabulary.map((v) => v.id));
        list = vocabulary.filter((v) => dueIds.includes(v.id));
      } else {
        list = getVocabByLevel(selectedLevel);
      }
      list.sort(() => Math.random() - 0.5);
      setWords(list);
      setIdx(0);
      setRevealed(false);
      setStats({ correct: 0, incorrect: 0 });
      setDone(false);
      setStartTime(Date.now());
    }
  }, [selectedLevel]);

  const current = words[idx];

  function speakWord(text: string) {
    const s = loadVoiceSettings();
    speak(text, { voice: getVoiceByURI(s.voiceURI), rate: s.rate, lang: s.lang });
  }

  function handleAnswer(correct: boolean) {
    if (!current) return;
    updateVocabProgress(current.id, correct);
    setStats({
      correct: stats.correct + (correct ? 1 : 0),
      incorrect: stats.incorrect + (correct ? 0 : 1),
    });
    if (idx + 1 < words.length) {
      setIdx(idx + 1);
      setRevealed(false);
    } else {
      const durationMinutes = Math.max(1, Math.round((Date.now() - startTime) / 60000));
      addStudyRecord({
        activity: "vocab",
        durationMinutes,
        correctCount: stats.correct + (correct ? 1 : 0),
        totalCount: words.length,
      });
      setDone(true);
    }
  }

  function reset() {
    setSelectedLevel(null);
    setWords([]);
    setIdx(0);
    setRevealed(false);
    setDone(false);
  }

  if (!selectedLevel) {
    const progress = typeof window !== "undefined" ? loadProgress() : null;
    const masteredCount = progress
      ? Object.values(progress.vocabProgress).filter((p) => p.mastery >= 4).length
      : 0;

    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-slate-800">単語・熟語暗記</h1>
          <p className="text-slate-600 mt-1">フラッシュカードで効率的に覚えましょう</p>
        </header>

        <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-green-700 font-medium">習得済み</div>
              <div className="text-3xl font-bold text-green-800">
                {masteredCount} <span className="text-base font-normal">/ {vocabulary.length} 語</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-green-700 font-medium">習得率</div>
              <div className="text-2xl font-bold text-green-800">
                {Math.round((masteredCount / vocabulary.length) * 100)}%
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(Object.keys(levelLabels) as Level[]).map((level) => {
            const count = level === "all"
              ? vocabulary.length
              : level === "due"
              ? getDueWords(vocabulary.map((v) => v.id)).length
              : getVocabByLevel(level).length;
            return (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                disabled={count === 0}
                className={clsx(
                  "card text-left transition-all",
                  count === 0 ? "opacity-50 cursor-not-allowed" : "hover:shadow-md hover:border-primary-300"
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">{levelLabels[level]}</h3>
                  <span className="text-sm bg-slate-100 text-slate-600 px-2 py-1 rounded">{count}語</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (done) {
    const total = stats.correct + stats.incorrect;
    return (
      <div className="space-y-6">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">学習完了!</h2>
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-green-700">{stats.correct}</div>
              <div className="text-sm text-green-600">覚えた</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-red-700">{stats.incorrect}</div>
              <div className="text-sm text-red-600">要復習</div>
            </div>
          </div>
          <p className="text-slate-600 mt-4">
            正答率 {total > 0 ? Math.round((stats.correct / total) * 100) : 0}%
          </p>
        </div>
        <button onClick={reset} className="btn-primary w-full flex items-center justify-center gap-2">
          <RotateCcw size={18} />
          別のレベルに挑戦
        </button>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="card text-center">
        <p className="text-slate-600">対象の単語がありません。</p>
        <button onClick={reset} className="btn-primary mt-4">戻る</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">{levelLabels[selectedLevel]}</h1>
        <button onClick={reset} className="btn-secondary text-sm">中断</button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
          <div className="bg-green-500 h-full transition-all" style={{ width: `${((idx + 1) / words.length) * 100}%` }} />
        </div>
        <span className="text-sm text-slate-600 font-medium">{idx + 1} / {words.length}</span>
      </div>

      <div className="card min-h-[400px] flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
          <div className="text-xs text-slate-500 uppercase tracking-wider">{current.partOfSpeech}</div>
          <div className="flex items-center gap-2">
            <h2 className="text-4xl font-bold text-slate-800">{current.word}</h2>
            <button onClick={() => speakWord(current.word)} className="p-2 text-slate-400 hover:text-primary-600">
              <Volume2 size={24} />
            </button>
          </div>

          {revealed && (
            <div className="space-y-3 w-full max-w-md mt-4">
              <div className="text-2xl text-primary-700 font-semibold">{current.meaning}</div>
              <div className="bg-slate-50 p-4 rounded-lg text-left">
                <div className="text-sm text-slate-800 italic">"{current.example}"</div>
                <div className="text-sm text-slate-600 mt-2">{current.exampleJp}</div>
                <button onClick={() => speakWord(current.example)} className="mt-2 text-slate-400 hover:text-primary-600">
                  <Volume2 size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100">
          {!revealed ? (
            <button onClick={() => setRevealed(true)} className="btn-primary w-full">
              意味を見る
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAnswer(false)}
                className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 font-medium px-4 py-3 rounded-lg transition-colors"
              >
                <X size={18} /> わからない
              </button>
              <button
                onClick={() => handleAnswer(true)}
                className="flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 font-medium px-4 py-3 rounded-lg transition-colors"
              >
                <Check size={18} /> わかった
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
