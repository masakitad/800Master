"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ToeicQuestion } from "@/lib/types";
import { toeicQuestions } from "@/data/toeic-questions";
import {
  listIncorrectQuestions,
  recordIncorrectAnswer,
  markQuestionResolved,
  addStudyRecord,
} from "@/lib/storage";
import { speak, stopSpeech } from "@/lib/speech";
import { loadVoiceSettings, getVoiceByURI } from "@/components/VoiceSettings";
import {
  Check,
  X,
  ChevronRight,
  RotateCcw,
  Play,
  RefreshCw,
  Inbox,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";

function speakWithSettings(text: string) {
  const s = loadVoiceSettings();
  speak(text, { voice: getVoiceByURI(s.voiceURI), rate: s.rate, lang: s.lang });
}

export default function ReviewPage() {
  const [started, setStarted] = useState(false);
  const [items, setItems] = useState<ToeicQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [done, setDone] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const audioTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearAudioTimers() {
    audioTimers.current.forEach((id) => clearTimeout(id));
    audioTimers.current = [];
  }

  useEffect(() => () => {
    clearAudioTimers();
    stopSpeech();
  }, []);

  const unresolvedList = listIncorrectQuestions({ onlyUnresolved: true });
  const unresolvedQuestions = unresolvedList
    .map((iq) => toeicQuestions.find((q) => q.id === iq.questionId))
    .filter((q): q is ToeicQuestion => !!q);

  const groupedByPart = unresolvedQuestions.reduce<Record<string, ToeicQuestion[]>>(
    (acc, q) => {
      acc[q.part] = acc[q.part] ?? [];
      acc[q.part].push(q);
      return acc;
    },
    {}
  );

  const current = items[idx];
  const isListening = current && ["part1", "part2", "part3", "part4"].includes(current.part);

  useEffect(() => {
    if (!started || !current || !isListening || showResult) return;
    clearAudioTimers();
    if (current.questionAudio) speakWithSettings(current.questionAudio);
    else if (current.audioScript) speakWithSettings(current.audioScript);
    if (current.choiceAudios && (current.part === "part1" || current.part === "part2")) {
      const baseDelay = current.questionAudio || current.audioScript ? 2500 : 0;
      current.choiceAudios.forEach((c, i) => {
        const id = setTimeout(() => speakWithSettings(c), baseDelay + i * 2800);
        audioTimers.current.push(id);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, started, current?.id]);

  function startReview(subset: ToeicQuestion[]) {
    if (subset.length === 0) return;
    setItems([...subset].sort(() => Math.random() - 0.5));
    setIdx(0);
    setSelected(null);
    setShowResult(false);
    setStats({ correct: 0, total: 0 });
    setStartTime(Date.now());
    setDone(false);
    setStarted(true);
  }

  function handleAnswer() {
    if (selected === null || !current) return;
    clearAudioTimers();
    stopSpeech();
    const correct = selected === current.correctIndex;
    if (correct) {
      markQuestionResolved(current.id);
    } else {
      recordIncorrectAnswer(current.id, current.part);
    }
    setStats((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    setShowResult(true);
  }

  function handleNext() {
    clearAudioTimers();
    stopSpeech();
    if (idx + 1 >= items.length) {
      const minutes = Math.max(1, Math.round((Date.now() - startTime) / 60000));
      addStudyRecord({
        activity: "toeic",
        durationMinutes: minutes,
        correctCount: stats.correct,
        totalCount: stats.total,
      });
      setDone(true);
    } else {
      setSelected(null);
      setShowResult(false);
      setIdx(idx + 1);
    }
  }

  function reset() {
    clearAudioTimers();
    stopSpeech();
    setStarted(false);
    setItems([]);
    setIdx(0);
    setDone(false);
  }

  if (!started) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <RefreshCw className="text-rose-500" /> 間違えた問題の復習
          </h1>
          <p className="text-slate-600 mt-1">
            過去に間違えた問題だけを再演習。正解すると「習得済み」になります。
          </p>
        </header>

        {unresolvedQuestions.length === 0 ? (
          <div className="card text-center py-12 space-y-3">
            <Inbox size={48} className="mx-auto text-slate-300" />
            <h2 className="text-lg font-bold text-slate-700">復習リストは空です</h2>
            <p className="text-sm text-slate-500">
              TOEIC演習で問題を間違えると、ここに追加されます。
            </p>
            <Link href="/toeic" className="btn-primary inline-flex">演習に進む</Link>
          </div>
        ) : (
          <>
            <div className="card bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs text-rose-700 font-medium">未習得の問題</div>
                  <div className="text-3xl font-bold text-rose-700">
                    {unresolvedQuestions.length} <span className="text-base font-normal">問</span>
                  </div>
                </div>
                <Sparkles className="text-rose-400" size={32} />
              </div>
              <button
                onClick={() => startReview(unresolvedQuestions)}
                className="btn-primary w-full"
              >
                すべて復習する ({unresolvedQuestions.length}問)
              </button>
            </div>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-slate-500 uppercase">Part 別に絞り込み</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {Object.entries(groupedByPart)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([part, qs]) => (
                    <button
                      key={part}
                      onClick={() => startReview(qs)}
                      className="card !p-3 text-left hover:border-rose-300"
                    >
                      <div className="font-bold text-slate-800">{part.replace("part", "Part ")}</div>
                      <div className="text-xs text-slate-500">{qs.length} 問</div>
                    </button>
                  ))}
              </div>
            </section>
          </>
        )}
      </div>
    );
  }

  if (done) {
    return (
      <div className="space-y-6">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">復習完了!</h2>
          <div className="text-6xl font-bold text-primary-600 mb-2">
            {stats.correct}<span className="text-2xl text-slate-400">/{stats.total}</span>
          </div>
          <p className="text-slate-600">
            正答率 {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%
          </p>
          <p className="text-sm text-slate-500 mt-2">
            正解した問題は復習リストから外れます。
          </p>
        </div>
        <button onClick={reset} className="btn-primary w-full flex items-center justify-center gap-2">
          <RotateCcw size={18} /> 復習リストに戻る
        </button>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-rose-600 font-medium flex items-center gap-1">
            <RefreshCw size={14} /> 復習モード
          </span>
          <h1 className="text-lg font-bold text-slate-800">{current.part.replace("part", "Part ")}</h1>
        </div>
        <span className="text-sm text-slate-600 font-medium">{idx + 1} / {items.length}</span>
      </div>

      <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
        <div className="bg-rose-500 h-full transition-all" style={{ width: `${((idx + 1) / items.length) * 100}%` }} />
      </div>

      <div className="card space-y-4">
        {current.passage && (
          <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
            {current.passage}
          </div>
        )}
        {isListening && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded text-sm">
            <button
              onClick={() => {
                clearAudioTimers();
                stopSpeech();
                if (current.questionAudio) speakWithSettings(current.questionAudio);
                else if (current.audioScript) speakWithSettings(current.audioScript);
                if (current.choiceAudios && (current.part === "part1" || current.part === "part2")) {
                  const baseDelay = current.questionAudio || current.audioScript ? 2500 : 0;
                  current.choiceAudios.forEach((c, i) => {
                    const id = setTimeout(() => speakWithSettings(c), baseDelay + i * 2800);
                    audioTimers.current.push(id);
                  });
                }
              }}
              className="btn-primary !py-1.5 !px-3 text-sm flex items-center gap-1"
            >
              <Play size={14} /> 音声を再生
            </button>
          </div>
        )}

        <h2 className="text-lg font-medium text-slate-800">{current.question}</h2>

        <div className="space-y-2">
          {current.choices.map((choice, i) => {
            const isCorrect = i === current.correctIndex;
            const isSelected = selected === i;
            return (
              <button
                key={i}
                onClick={() => !showResult && setSelected(i)}
                disabled={showResult}
                className={clsx(
                  "w-full text-left p-3 rounded-lg border-2 flex items-center gap-3 transition-all",
                  showResult && isCorrect && "border-green-500 bg-green-50",
                  showResult && isSelected && !isCorrect && "border-red-500 bg-red-50",
                  !showResult && isSelected && "border-rose-500 bg-rose-50",
                  !showResult && !isSelected && "border-slate-200 hover:border-slate-300"
                )}
              >
                <span className="font-bold text-slate-600 min-w-[24px]">{String.fromCharCode(65 + i)}.</span>
                <span className="flex-1 text-slate-800">{choice}</span>
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
              selected === current.correctIndex
                ? "bg-green-50 border-green-400"
                : "bg-red-50 border-red-400"
            )}
          >
            {selected === current.correctIndex ? (
              <>
                <div className="bg-green-500 text-white rounded-full p-2 flex-shrink-0">
                  <Check size={24} />
                </div>
                <div>
                  <div className="font-bold text-green-800 text-lg">正解! 復習リストから外しました</div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-red-500 text-white rounded-full p-2 flex-shrink-0">
                  <X size={24} />
                </div>
                <div>
                  <div className="font-bold text-red-800 text-lg">もう一度復習</div>
                  <div className="text-sm text-red-700">
                    正解: <strong>{String.fromCharCode(65 + current.correctIndex)}. {current.choices[current.correctIndex]}</strong>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {showResult && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded text-sm whitespace-pre-wrap text-slate-700">
            <div className="text-xs font-bold text-amber-800 mb-1">解説</div>
            {current.explanation}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button onClick={reset} className="btn-secondary">中断</button>
          {!showResult ? (
            <button onClick={handleAnswer} disabled={selected === null} className="btn-primary disabled:opacity-50">
              回答
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
