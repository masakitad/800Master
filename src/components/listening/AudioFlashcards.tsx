"use client";

import { useEffect, useState } from "react";
import { vocabulary } from "@/data/vocabulary";
import { VocabWord } from "@/lib/types";
import { speak } from "@/lib/speech";
import { loadVoiceSettings, getVoiceByURI } from "@/components/VoiceSettings";
import { addStudyRecord, updateVocabProgress } from "@/lib/storage";
import { Play, Check, X, ChevronLeft, RotateCcw } from "lucide-react";

export default function AudioFlashcards({ onBack }: { onBack: () => void }) {
  const [cards, setCards] = useState<VocabWord[]>([]);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  const [done, setDone] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const pool = [...vocabulary].sort(() => Math.random() - 0.5).slice(0, 15);
    setCards(pool);
  }, []);

  const current = cards[idx];

  useEffect(() => {
    if (current && !revealed) playAudio();
  }, [idx, current?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function playAudio() {
    if (!current) return;
    const s = loadVoiceSettings();
    speak(current.word, { voice: getVoiceByURI(s.voiceURI), rate: s.rate, lang: s.lang });
  }

  function handleAnswer(correct: boolean) {
    if (!current) return;
    updateVocabProgress(current.id, correct);
    setStats({
      correct: stats.correct + (correct ? 1 : 0),
      incorrect: stats.incorrect + (correct ? 0 : 1),
    });
    if (idx + 1 >= cards.length) {
      const minutes = Math.max(1, Math.round((Date.now() - startTime) / 60000));
      addStudyRecord({
        activity: "vocab",
        durationMinutes: minutes,
        correctCount: stats.correct + (correct ? 1 : 0),
        totalCount: cards.length,
      });
      setDone(true);
    } else {
      setIdx(idx + 1);
      setRevealed(false);
    }
  }

  if (done) {
    return (
      <div className="space-y-6">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">完了!</h2>
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-green-700">{stats.correct}</div>
              <div className="text-sm text-green-600">わかった</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-red-700">{stats.incorrect}</div>
              <div className="text-sm text-red-600">要復習</div>
            </div>
          </div>
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
        <span className="text-sm text-slate-600 font-medium">{idx + 1} / {cards.length}</span>
      </div>

      <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
        <div className="bg-emerald-500 h-full transition-all" style={{ width: `${((idx + 1) / cards.length) * 100}%` }} />
      </div>

      <div className="card min-h-[360px] flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <button
            onClick={playAudio}
            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-full p-8 transition-all"
            aria-label="再生"
          >
            <Play size={48} />
          </button>
          <p className="text-sm text-slate-500">音声を聞いて意味を思い浮かべてください</p>

          {revealed && (
            <div className="text-center space-y-3 mt-4 w-full max-w-md">
              <div className="text-xs text-slate-500 uppercase tracking-wider">{current.partOfSpeech}</div>
              <div className="text-3xl font-bold text-slate-800">{current.word}</div>
              <div className="text-xl text-primary-700 font-semibold">{current.meaning}</div>
              <div className="bg-slate-50 p-3 rounded-lg text-left text-sm">
                <div className="italic text-slate-800">"{current.example}"</div>
                <div className="text-slate-600 mt-1">{current.exampleJp}</div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100">
          {!revealed ? (
            <button onClick={() => setRevealed(true)} className="btn-primary w-full">
              答えを見る
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAnswer(false)}
                className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 font-medium px-4 py-3 rounded-lg"
              >
                <X size={18} /> わからない
              </button>
              <button
                onClick={() => handleAnswer(true)}
                className="flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 font-medium px-4 py-3 rounded-lg"
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
