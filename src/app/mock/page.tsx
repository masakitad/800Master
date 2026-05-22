"use client";

import { useState, useEffect, useRef } from "react";
import { ToeicQuestion } from "@/lib/types";
import { getMockExamQuestions, estimateToeicScore } from "@/data/toeic-questions";
import { addQuizResult, addStudyRecord, recordIncorrectAnswer, markQuestionResolved } from "@/lib/storage";
import { speak, stopSpeech } from "@/lib/speech";
import { loadVoiceSettings, getVoiceByURI } from "@/components/VoiceSettings";
import { Check, X, ChevronRight, RotateCcw, Play, Trophy, Clock } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";

function speakWithSettings(text: string) {
  const s = loadVoiceSettings();
  speak(text, { voice: getVoiceByURI(s.voiceURI), rate: s.rate, lang: s.lang });
}

export default function MockExamPage() {
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<ToeicQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<{ part: string; correct: boolean }[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [done, setDone] = useState(false);
  const audioTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearAudioTimers() {
    audioTimers.current.forEach((id) => clearTimeout(id));
    audioTimers.current = [];
  }

  function startExam() {
    clearAudioTimers();
    stopSpeech();
    const qs = getMockExamQuestions();
    setQuestions(qs);
    setIdx(0);
    setSelected(null);
    setShowResult(false);
    setAnswers([]);
    setStartTime(Date.now());
    setDone(false);
    setStarted(true);
  }

  const current = questions[idx];
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

  useEffect(
    () => () => {
      clearAudioTimers();
      stopSpeech();
    },
    []
  );

  function handleAnswer() {
    if (selected === null || !current) return;
    clearAudioTimers();
    stopSpeech();
    const correct = selected === current.correctIndex;
    setAnswers([...answers, { part: current.part, correct }]);
    if (correct) {
      markQuestionResolved(current.id);
    } else {
      recordIncorrectAnswer(current.id, current.part);
    }
    setShowResult(true);
  }

  function handleNext() {
    clearAudioTimers();
    stopSpeech();
    setSelected(null);
    setShowResult(false);
    if (idx + 1 < questions.length) {
      setIdx(idx + 1);
    } else {
      finishExam();
    }
  }

  function finishExam() {
    clearAudioTimers();
    stopSpeech();
    const correctCount = answers.filter((a) => a.correct).length;
    const totalCount = answers.length;
    const minutes = Math.max(1, Math.round((Date.now() - startTime) / 60000));
    addQuizResult({
      part: "mock",
      correctCount,
      totalCount,
      estimatedScore: estimateToeicScore(correctCount, totalCount),
    });
    addStudyRecord({
      activity: "toeic",
      durationMinutes: minutes,
      correctCount,
      totalCount,
    });
    setDone(true);
  }

  function partAccuracy() {
    const map: Record<string, { correct: number; total: number }> = {};
    answers.forEach((a) => {
      if (!map[a.part]) map[a.part] = { correct: 0, total: 0 };
      map[a.part].total++;
      if (a.correct) map[a.part].correct++;
    });
    return map;
  }

  if (!started) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Trophy className="text-amber-500" /> 模擬試験モード
          </h1>
          <p className="text-slate-600 mt-1">全 Part からランダム出題で実力チェック</p>
        </header>

        <div className="card bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <h2 className="text-lg font-bold text-slate-800 mb-3">出題内容</h2>
          <ul className="text-sm text-slate-700 space-y-1">
            <li>• 各 Part から最大3問ずつ、合計 約20問</li>
            <li>• リスニング Part は音声自動再生</li>
            <li>• 解答後に推定 TOEIC スコアと Part 別正答率を表示</li>
            <li>• 結果は進捗ダッシュボードに保存</li>
          </ul>
        </div>

        <div className="flex gap-2">
          <button onClick={startExam} className="btn-primary flex-1 flex items-center justify-center gap-2">
            <Play size={18} /> 開始する
          </button>
          <Link href="/toeic" className="btn-outline flex items-center">
            Part別演習に戻る
          </Link>
        </div>
      </div>
    );
  }

  if (done) {
    const correctCount = answers.filter((a) => a.correct).length;
    const totalCount = answers.length;
    const score = estimateToeicScore(correctCount, totalCount);
    const partStats = partAccuracy();

    return (
      <div className="space-y-6">
        <div className="card text-center bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <Trophy className="text-amber-500 mx-auto mb-2" size={48} />
          <h2 className="text-2xl font-bold text-slate-800 mb-4">模擬試験完了!</h2>
          <div className="text-6xl font-bold text-amber-600 mb-2">{score}<span className="text-2xl text-slate-400 ml-1">点</span></div>
          <p className="text-slate-600 mb-2">
            {correctCount} / {totalCount} 問正解 ({Math.round((correctCount / totalCount) * 100)}%)
          </p>
        </div>

        <section className="card">
          <h3 className="text-lg font-bold text-slate-800 mb-3">Part 別の正答率</h3>
          <div className="space-y-2">
            {Object.entries(partStats).sort(([a], [b]) => a.localeCompare(b)).map(([part, s]) => {
              const rate = Math.round((s.correct / s.total) * 100);
              return (
                <div key={part} className="flex items-center gap-3">
                  <div className="w-16 text-sm font-medium text-slate-700">{part.replace("part", "Part ")}</div>
                  <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={clsx(
                        "h-full transition-all",
                        rate >= 80 ? "bg-green-500" : rate >= 60 ? "bg-yellow-500" : "bg-red-500"
                      )}
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                  <div className="text-sm font-medium w-16 text-right">{s.correct}/{s.total} ({rate}%)</div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="flex gap-2">
          <button onClick={startExam} className="btn-primary flex-1 flex items-center justify-center gap-2">
            <RotateCcw size={18} /> もう一度
          </button>
          <Link href="/progress" className="btn-outline flex items-center">
            進捗を見る
          </Link>
        </div>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-amber-600 font-medium flex items-center gap-1">
            <Trophy size={14} /> 模擬試験
          </span>
          <h1 className="text-lg font-bold text-slate-800">{current.part.replace("part", "Part ")}</h1>
        </div>
        <span className="text-sm text-slate-600 font-medium flex items-center gap-1">
          <Clock size={14} /> {idx + 1} / {questions.length}
        </span>
      </div>

      <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
        <div className="bg-amber-500 h-full transition-all" style={{ width: `${((idx + 1) / questions.length) * 100}%` }} />
      </div>

      <div className="card space-y-4">
        {current.photoCaption && current.part === "part1" && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-500 italic">
            (写真の状況をイメージしてください)
          </div>
        )}
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
              <Play size={14} /> 音声を再再生
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
                  "w-full text-left p-3 rounded-lg border-2 transition-all flex items-center gap-3",
                  showResult && isCorrect && "border-green-500 bg-green-50",
                  showResult && isSelected && !isCorrect && "border-red-500 bg-red-50",
                  !showResult && isSelected && "border-amber-500 bg-amber-50",
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

        {showResult && current && (
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
                  <div className="font-bold text-green-800 text-lg">正解!</div>
                  <div className="text-sm text-green-700">
                    {String.fromCharCode(65 + current.correctIndex)}. {current.choices[current.correctIndex]}
                  </div>
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
                    正解は <strong>{String.fromCharCode(65 + current.correctIndex)}. {current.choices[current.correctIndex]}</strong>
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

        <div className="flex justify-end">
          {!showResult ? (
            <button onClick={handleAnswer} disabled={selected === null} className="btn-primary disabled:opacity-50">
              回答する
            </button>
          ) : (
            <button onClick={handleNext} className="btn-primary flex items-center gap-1">
              {idx + 1 < questions.length ? "次へ" : "結果"} <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
