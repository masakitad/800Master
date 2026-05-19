"use client";

import { useState, useEffect } from "react";
import { ToeicPart, ToeicQuestion } from "@/lib/types";
import { toeicQuestions, getQuestionsByPart, estimateToeicScore } from "@/data/toeic-questions";
import { addQuizResult, addStudyRecord } from "@/lib/storage";
import { speak } from "@/lib/speech";
import { loadVoiceSettings, getVoiceByURI } from "@/components/VoiceSettings";
import { Check, X, ChevronRight, RotateCcw, Play, Eye, EyeOff } from "lucide-react";
import clsx from "clsx";

const partLabels: Record<ToeicPart, { title: string; desc: string }> = {
  part1: { title: "Part 1", desc: "写真描写問題" },
  part2: { title: "Part 2", desc: "応答問題" },
  part3: { title: "Part 3", desc: "会話問題" },
  part4: { title: "Part 4", desc: "説明文問題" },
  part5: { title: "Part 5", desc: "短文穴埋め問題" },
  part6: { title: "Part 6", desc: "長文穴埋め問題" },
  part7: { title: "Part 7", desc: "読解問題" },
};

export default function ToeicPage() {
  const [selectedPart, setSelectedPart] = useState<ToeicPart | null>(null);
  const [questions, setQuestions] = useState<ToeicQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<{ questionId: string; selected: number; correct: boolean }[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [scriptVisible, setScriptVisible] = useState(false);
  const [playCount, setPlayCount] = useState(0);

  useEffect(() => {
    if (selectedPart) {
      const qs = getQuestionsByPart(selectedPart);
      setQuestions(qs);
      setCurrentIdx(0);
      setSelected(null);
      setShowResult(false);
      setAnswers([]);
      setStartTime(Date.now());
      setScriptVisible(false);
      setPlayCount(0);
    }
  }, [selectedPart]);

  const current = questions[currentIdx];
  const allDone = currentIdx >= questions.length && questions.length > 0;
  const isListeningPart = selectedPart && ["part1", "part2", "part3", "part4"].includes(selectedPart);

  useEffect(() => {
    if (current?.audioScript && isListeningPart && !showResult) {
      const s = loadVoiceSettings();
      speak(current.audioScript, { voice: getVoiceByURI(s.voiceURI), rate: s.rate, lang: s.lang });
      setPlayCount(1);
      setScriptVisible(false);
    }
  }, [currentIdx, current?.audioScript, isListeningPart, showResult]);

  function playAudio() {
    if (!current?.audioScript) return;
    const s = loadVoiceSettings();
    speak(current.audioScript, { voice: getVoiceByURI(s.voiceURI), rate: s.rate, lang: s.lang });
    setPlayCount(playCount + 1);
  }

  function handleAnswer() {
    if (selected === null || !current) return;
    const isCorrect = selected === current.correctIndex;
    setAnswers([...answers, { questionId: current.id, selected, correct: isCorrect }]);
    setShowResult(true);
  }

  function handleNext() {
    setSelected(null);
    setShowResult(false);
    setCurrentIdx(currentIdx + 1);
  }

  function handleFinish() {
    if (!selectedPart) return;
    const correctCount = answers.filter((a) => a.correct).length;
    const totalCount = answers.length;
    const durationMinutes = Math.max(1, Math.round((Date.now() - startTime) / 60000));

    addQuizResult({
      part: selectedPart,
      correctCount,
      totalCount,
      estimatedScore: estimateToeicScore(correctCount, totalCount),
    });
    addStudyRecord({
      activity: "toeic",
      part: selectedPart,
      durationMinutes,
      correctCount,
      totalCount,
    });
  }

  function handleReset() {
    setSelectedPart(null);
    setQuestions([]);
    setCurrentIdx(0);
    setSelected(null);
    setShowResult(false);
    setAnswers([]);
  }

  if (!selectedPart) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-slate-800">TOEIC Part 別演習</h1>
          <p className="text-slate-600 mt-1">取り組みたいパートを選択してください</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(partLabels) as ToeicPart[]).map((part) => {
            const count = getQuestionsByPart(part).length;
            return (
              <button
                key={part}
                onClick={() => setSelectedPart(part)}
                disabled={count === 0}
                className={clsx(
                  "card text-left transition-all",
                  count === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-md hover:border-primary-300 cursor-pointer"
                )}
              >
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-800">{partLabels[part].title}</h3>
                  <span className="text-xs text-slate-500">{count}問</span>
                </div>
                <p className="text-sm text-slate-600">{partLabels[part].desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (allDone || questions.length === 0) {
    const correctCount = answers.filter((a) => a.correct).length;
    const totalCount = answers.length;
    const score = estimateToeicScore(correctCount, totalCount);

    if (totalCount > 0 && !window.sessionStorage.getItem(`saved_${startTime}`)) {
      handleFinish();
      window.sessionStorage.setItem(`saved_${startTime}`, "1");
    }

    return (
      <div className="space-y-6">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">演習結果</h2>
          <div className="text-6xl font-bold text-primary-600 mb-2">
            {correctCount}<span className="text-2xl text-slate-400">/{totalCount}</span>
          </div>
          <p className="text-slate-600 mb-4">正答率 {totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0}%</p>
          <div className="bg-primary-50 rounded-xl p-4 inline-block">
            <div className="text-sm text-slate-600">推定スコア</div>
            <div className="text-3xl font-bold text-primary-700">{score} 点</div>
          </div>
        </div>
        <button onClick={handleReset} className="btn-primary w-full flex items-center justify-center gap-2">
          <RotateCcw size={18} />
          別のパートに挑戦
        </button>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-slate-500">{partLabels[selectedPart].title}</span>
          <h1 className="text-xl font-bold text-slate-800">{partLabels[selectedPart].desc}</h1>
        </div>
        <button onClick={handleReset} className="btn-secondary text-sm">
          中断
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary-500 h-full transition-all"
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-sm text-slate-600 font-medium">
          {currentIdx + 1} / {questions.length}
        </span>
      </div>

      <div className="card space-y-4">
        {current.passage && (
          <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
            {current.passage}
          </div>
        )}
        {current.audioScript && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded text-sm space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button onClick={playAudio} className="btn-primary !py-1.5 !px-3 text-sm flex items-center gap-1">
                  <Play size={14} /> {playCount === 0 ? "再生" : "もう一度聞く"}
                </button>
                <span className="text-xs text-slate-500">再生回数: {playCount}</span>
              </div>
              <button
                onClick={() => setScriptVisible(!scriptVisible)}
                className="text-xs text-blue-700 hover:text-blue-900 flex items-center gap-1"
              >
                {scriptVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                {scriptVisible ? "スクリプトを隠す" : "スクリプトを表示"}
              </button>
            </div>
            {scriptVisible && (
              <div className="text-slate-700 whitespace-pre-wrap pt-2 border-t border-blue-200">
                {current.audioScript}
              </div>
            )}
          </div>
        )}
        <h2 className="text-lg font-medium text-slate-800">{current.question}</h2>

        <div className="space-y-2">
          {current.choices.map((choice, idx) => {
            const isCorrect = idx === current.correctIndex;
            const isSelected = selected === idx;
            return (
              <button
                key={idx}
                onClick={() => !showResult && setSelected(idx)}
                disabled={showResult}
                className={clsx(
                  "w-full text-left p-4 rounded-lg border-2 transition-all flex items-start gap-3",
                  showResult && isCorrect && "border-green-500 bg-green-50",
                  showResult && isSelected && !isCorrect && "border-red-500 bg-red-50",
                  !showResult && isSelected && "border-primary-500 bg-primary-50",
                  !showResult && !isSelected && "border-slate-200 hover:border-slate-300 bg-white"
                )}
              >
                <span className="font-bold text-slate-600 min-w-[24px]">{String.fromCharCode(65 + idx)}.</span>
                <span className="flex-1 text-slate-800">{choice}</span>
                {showResult && isCorrect && <Check className="text-green-600" size={20} />}
                {showResult && isSelected && !isCorrect && <X className="text-red-600" size={20} />}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
            <div className="text-xs font-bold text-amber-800 mb-1">解説</div>
            <p className="text-sm text-slate-700">{current.explanation}</p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          {!showResult ? (
            <button onClick={handleAnswer} disabled={selected === null} className="btn-primary disabled:opacity-50">
              回答する
            </button>
          ) : (
            <button onClick={handleNext} className="btn-primary flex items-center gap-1">
              {currentIdx + 1 < questions.length ? "次の問題" : "結果を見る"}
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
