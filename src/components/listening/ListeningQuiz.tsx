"use client";

import { useEffect, useState } from "react";
import { vocabulary } from "@/data/vocabulary";
import { phraseScenes } from "@/data/phrases";
import { speak } from "@/lib/speech";
import { loadVoiceSettings, getVoiceByURI } from "@/components/VoiceSettings";
import { addStudyRecord } from "@/lib/storage";
import { Play, Check, X, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import clsx from "clsx";

interface QuizItem {
  audio: string;
  correct: string;
  choices: string[];
}

function buildVocabQuiz(): QuizItem[] {
  const pool = [...vocabulary];
  return pool
    .sort(() => Math.random() - 0.5)
    .slice(0, 10)
    .map((word) => {
      const distractors = vocabulary
        .filter((v) => v.id !== word.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((v) => v.meaning);
      const choices = [word.meaning, ...distractors].sort(() => Math.random() - 0.5);
      return { audio: word.word, correct: word.meaning, choices };
    });
}

function buildPhraseQuiz(): QuizItem[] {
  const allPhrases = phraseScenes.flatMap((s) => s.phrases);
  const pool = [...allPhrases];
  return pool
    .sort(() => Math.random() - 0.5)
    .slice(0, 10)
    .map((phrase) => {
      const distractors = allPhrases
        .filter((p) => p.jp !== phrase.jp)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((p) => p.jp);
      const choices = [phrase.jp, ...distractors].sort(() => Math.random() - 0.5);
      return { audio: phrase.en, correct: phrase.jp, choices };
    });
}

export default function ListeningQuiz({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<"select" | "vocab" | "phrase">("select");
  const [items, setItems] = useState<QuizItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [done, setDone] = useState(false);
  const [startTime, setStartTime] = useState(0);

  const current = items[idx];

  useEffect(() => {
    if (mode === "vocab") setItems(buildVocabQuiz());
    if (mode === "phrase") setItems(buildPhraseQuiz());
    setIdx(0);
    setSelected(null);
    setShowResult(false);
    setStats({ correct: 0, total: 0 });
    setDone(false);
    setStartTime(Date.now());
  }, [mode]);

  useEffect(() => {
    if (current) playAudio();
  }, [idx, current?.audio]); // eslint-disable-line react-hooks/exhaustive-deps

  function playAudio() {
    if (!current) return;
    const s = loadVoiceSettings();
    speak(current.audio, { voice: getVoiceByURI(s.voiceURI), rate: s.rate, lang: s.lang });
  }

  function handleAnswer() {
    if (!current || selected === null) return;
    const correct = selected === current.correct;
    setStats((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    setShowResult(true);
  }

  function handleNext() {
    if (idx + 1 >= items.length) {
      const minutes = Math.max(1, Math.round((Date.now() - startTime) / 60000));
      addStudyRecord({
        activity: mode === "vocab" ? "vocab" : "phrases",
        durationMinutes: minutes,
        correctCount: stats.correct,
        totalCount: stats.total,
      });
      setDone(true);
    } else {
      setIdx(idx + 1);
      setSelected(null);
      setShowResult(false);
    }
  }

  if (mode === "select") {
    return (
      <div className="space-y-6">
        <button onClick={onBack} className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium">
          <ChevronLeft size={18} /> 戻る
        </button>
        <header>
          <h1 className="text-2xl font-bold text-slate-800">リスニングクイズ</h1>
          <p className="text-slate-600 mt-1">音声を聞いて、対応する意味を4択から選びます</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button onClick={() => setMode("vocab")} className="card text-left hover:shadow-md">
            <h3 className="font-bold text-slate-800">単語 (10問)</h3>
            <p className="text-sm text-slate-600 mt-1">音声 → 日本語の意味を選択</p>
          </button>
          <button onClick={() => setMode("phrase")} className="card text-left hover:shadow-md">
            <h3 className="font-bold text-slate-800">フレーズ (10問)</h3>
            <p className="text-sm text-slate-600 mt-1">音声 → 日本語訳を選択</p>
          </button>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="space-y-6">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">完了!</h2>
          <div className="text-6xl font-bold text-primary-600 mb-2">
            {stats.correct}<span className="text-2xl text-slate-400">/{stats.total}</span>
          </div>
          <p className="text-slate-600">
            正答率 {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setMode("select")} className="btn-outline flex items-center justify-center gap-2">
            <RotateCcw size={18} /> もう一度
          </button>
          <button onClick={onBack} className="btn-primary">メニューへ</button>
        </div>
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

      <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
        <div className="bg-primary-500 h-full transition-all" style={{ width: `${((idx + 1) / items.length) * 100}%` }} />
      </div>

      <div className="card space-y-4">
        <div className="flex items-center justify-center py-6">
          <button
            onClick={playAudio}
            className="bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-full p-8 transition-all"
            aria-label="再生"
          >
            <Play size={48} />
          </button>
        </div>
        <p className="text-center text-sm text-slate-600">音声を聞いて答えを選んでください</p>

        <div className="space-y-2">
          {current.choices.map((choice) => {
            const isCorrect = choice === current.correct;
            const isSelected = selected === choice;
            return (
              <button
                key={choice}
                onClick={() => !showResult && setSelected(choice)}
                disabled={showResult}
                className={clsx(
                  "w-full text-left p-4 rounded-lg border-2 transition-all flex items-center justify-between gap-2",
                  showResult && isCorrect && "border-green-500 bg-green-50",
                  showResult && isSelected && !isCorrect && "border-red-500 bg-red-50",
                  !showResult && isSelected && "border-primary-500 bg-primary-50",
                  !showResult && !isSelected && "border-slate-200 hover:border-slate-300"
                )}
              >
                <span className="text-slate-800">{choice}</span>
                {showResult && isCorrect && <Check className="text-green-600" size={20} />}
                {showResult && isSelected && !isCorrect && <X className="text-red-600" size={20} />}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div
            className={clsx(
              "rounded-lg p-4 flex items-center gap-3 border-2",
              selected === current.correct
                ? "bg-green-50 border-green-400"
                : "bg-red-50 border-red-400"
            )}
          >
            {selected === current.correct ? (
              <>
                <div className="bg-green-500 text-white rounded-full p-2 flex-shrink-0">
                  <Check size={24} />
                </div>
                <div>
                  <div className="font-bold text-green-800 text-lg">正解!</div>
                  <div className="text-sm text-green-700">{current.correct}</div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-red-500 text-white rounded-full p-2 flex-shrink-0">
                  <X size={24} />
                </div>
                <div>
                  <div className="font-bold text-red-800 text-lg">不正解</div>
                  <div className="text-sm text-red-700">
                    正解は <strong>{current.correct}</strong>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {showResult && (
          <div className="bg-blue-50 p-3 rounded text-sm">
            <span className="text-slate-500">英語: </span>
            <span className="font-medium text-slate-800">{current.audio}</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          {!showResult ? (
            <button onClick={handleAnswer} disabled={selected === null} className="btn-primary disabled:opacity-50">
              回答
            </button>
          ) : (
            <button onClick={handleNext} className="btn-primary flex items-center gap-1">
              {idx + 1 < items.length ? "次の問題" : "結果"} <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
