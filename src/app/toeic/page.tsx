"use client";

import { useState, useEffect, useRef } from "react";
import { ToeicPart, ToeicQuestion } from "@/lib/types";
import { getQuestionsByPart, estimateToeicScore } from "@/data/toeic-questions";
import { addQuizResult, addStudyRecord } from "@/lib/storage";
import { speak, stopSpeech } from "@/lib/speech";
import { loadVoiceSettings, getVoiceByURI } from "@/components/VoiceSettings";
import { Check, X, ChevronRight, RotateCcw, Play, Eye, EyeOff, Headphones, BookText, ImageIcon, Trophy } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";

const partLabels: Record<ToeicPart, { title: string; desc: string; category: "listening" | "reading" }> = {
  part1: { title: "Part 1", desc: "写真描写問題", category: "listening" },
  part2: { title: "Part 2", desc: "応答問題", category: "listening" },
  part3: { title: "Part 3", desc: "会話問題", category: "listening" },
  part4: { title: "Part 4", desc: "説明文問題", category: "listening" },
  part5: { title: "Part 5", desc: "短文穴埋め問題", category: "reading" },
  part6: { title: "Part 6", desc: "長文穴埋め問題", category: "reading" },
  part7: { title: "Part 7", desc: "読解問題", category: "reading" },
};

function speakWithSettings(text: string) {
  const s = loadVoiceSettings();
  speak(text, { voice: getVoiceByURI(s.voiceURI), rate: s.rate, lang: s.lang });
}

export default function ToeicPage() {
  const [selectedPart, setSelectedPart] = useState<ToeicPart | null>(null);
  const [questions, setQuestions] = useState<ToeicQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<{ questionId: string; selected: number; correct: boolean }[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [scriptVisible, setScriptVisible] = useState(false);
  const [choicesTextVisible, setChoicesTextVisible] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const audioTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearAudioTimers() {
    audioTimers.current.forEach((id) => clearTimeout(id));
    audioTimers.current = [];
  }

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
      setChoicesTextVisible(false);
      setPlayCount(0);
    }
  }, [selectedPart]);

  const current = questions[currentIdx];
  const allDone = currentIdx >= questions.length && questions.length > 0;
  const partInfo = selectedPart ? partLabels[selectedPart] : null;
  const isListeningPart = partInfo?.category === "listening";

  useEffect(() => {
    if (!current || !isListeningPart || showResult) return;
    playFullAudio();
    setPlayCount(1);
    setScriptVisible(false);
    setChoicesTextVisible(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, current?.id]);

  useEffect(
    () => () => {
      clearAudioTimers();
      stopSpeech();
    },
    []
  );

  async function playFullAudio() {
    if (!current) return;
    clearAudioTimers();
    if (current.questionAudio) {
      speakWithSettings(current.questionAudio);
    } else if (current.audioScript) {
      speakWithSettings(current.audioScript);
    }
    if (current.choiceAudios && selectedPart && (selectedPart === "part1" || selectedPart === "part2")) {
      const baseDelay = current.questionAudio || current.audioScript ? 2500 : 0;
      current.choiceAudios.forEach((c, i) => {
        const id = setTimeout(() => speakWithSettings(c), baseDelay + i * 2800);
        audioTimers.current.push(id);
      });
    }
  }

  function replayAll() {
    clearAudioTimers();
    stopSpeech();
    playFullAudio();
    setPlayCount(playCount + 1);
  }

  function playChoice(idx: number) {
    if (!current?.choiceAudios) return;
    speakWithSettings(current.choiceAudios[idx]);
  }

  function handleAnswer() {
    if (selected === null || !current) return;
    clearAudioTimers();
    stopSpeech();
    const isCorrect = selected === current.correctIndex;
    setAnswers([...answers, { questionId: current.id, selected, correct: isCorrect }]);
    setShowResult(true);
    setChoicesTextVisible(true);
  }

  function handleNext() {
    clearAudioTimers();
    stopSpeech();
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
    clearAudioTimers();
    stopSpeech();
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

        <Link
          href="/mock"
          className="block card bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 text-white p-3 rounded-xl">
              <Trophy size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800">模擬試験モード</h3>
              <p className="text-sm text-slate-600 mt-0.5">全 Part からランダム出題、推定スコアと弱点分析</p>
            </div>
            <ChevronRight className="text-slate-400" />
          </div>
        </Link>

        <section>
          <h2 className="text-sm font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
            <Headphones size={14} /> リスニングセクション (Part 1-4)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {(["part1", "part2", "part3", "part4"] as ToeicPart[]).map((part) => {
              const count = getQuestionsByPart(part).length;
              return (
                <PartCard key={part} part={part} count={count} onClick={() => setSelectedPart(part)} />
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
            <BookText size={14} /> リーディングセクション (Part 5-7)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(["part5", "part6", "part7"] as ToeicPart[]).map((part) => {
              const count = getQuestionsByPart(part).length;
              return (
                <PartCard key={part} part={part} count={count} onClick={() => setSelectedPart(part)} />
              );
            })}
          </div>
        </section>
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
          <p className="text-slate-600 mb-4">
            正答率 {totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0}%
          </p>
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

  if (!current || !partInfo) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-slate-500 flex items-center gap-1">
            {partInfo.category === "listening" ? <Headphones size={14} /> : <BookText size={14} />}
            {partInfo.title}
          </span>
          <h1 className="text-xl font-bold text-slate-800">{partInfo.desc}</h1>
        </div>
        <button onClick={handleReset} className="btn-secondary text-sm">中断</button>
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
        {/* Part 1: 写真の代わりに写真説明 (回答後のみ表示) */}
        {selectedPart === "part1" && current.photoCaption && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center gap-3">
            <div className="bg-slate-200 text-slate-500 p-3 rounded-lg flex-shrink-0">
              <ImageIcon size={32} />
            </div>
            <div className="flex-1 text-sm">
              {showResult ? (
                <>
                  <div className="text-xs text-slate-500 mb-1">写真の状況</div>
                  <div className="text-slate-700">{current.photoCaption}</div>
                </>
              ) : (
                <div className="text-slate-500 italic">
                  写真を想像してください (実試験では写真表示)。回答後にヒントを公開します。
                </div>
              )}
            </div>
          </div>
        )}

        {/* リーディング用の passage */}
        {partInfo.category === "reading" && current.passage && (
          <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700 whitespace-pre-wrap leading-relaxed border border-slate-200">
            {current.passage}
          </div>
        )}

        {/* リスニング用の音声コントロール */}
        {isListeningPart && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded text-sm space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button onClick={replayAll} className="btn-primary !py-1.5 !px-3 text-sm flex items-center gap-1">
                  <Play size={14} /> {playCount === 0 ? "再生" : "全体を再再生"}
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
              <div className="text-slate-700 whitespace-pre-wrap pt-2 border-t border-blue-200 space-y-1">
                {current.questionAudio && (
                  <div>
                    <span className="text-xs text-blue-700">Q: </span>
                    {current.questionAudio}
                  </div>
                )}
                {current.audioScript && <div>{current.audioScript}</div>}
                {current.choiceAudios && (selectedPart === "part1" || selectedPart === "part2") && (
                  <div className="pt-2 border-t border-blue-200">
                    {current.choiceAudios.map((c, i) => (
                      <div key={i}>
                        <span className="text-xs text-blue-700">{String.fromCharCode(65 + i)}: </span>
                        {c}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <h2 className="text-lg font-medium text-slate-800">{current.question}</h2>

        <div className="space-y-2">
          {current.choices.map((choice, idx) => {
            const isCorrect = idx === current.correctIndex;
            const isSelected = selected === idx;
            const hasChoiceAudio = !!current.choiceAudios && (selectedPart === "part1" || selectedPart === "part2");
            const hideTextInChoice = hasChoiceAudio && !choicesTextVisible && !showResult;

            return (
              <div
                key={idx}
                className={clsx(
                  "w-full p-3 rounded-lg border-2 transition-all flex items-center gap-3",
                  showResult && isCorrect && "border-green-500 bg-green-50",
                  showResult && isSelected && !isCorrect && "border-red-500 bg-red-50",
                  !showResult && isSelected && "border-primary-500 bg-primary-50",
                  !showResult && !isSelected && "border-slate-200 hover:border-slate-300 bg-white"
                )}
              >
                <button
                  onClick={() => !showResult && setSelected(idx)}
                  disabled={showResult}
                  className="flex items-center gap-3 flex-1 text-left disabled:cursor-default"
                >
                  <span className="font-bold text-slate-600 min-w-[24px] text-lg">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span className="flex-1 text-slate-800">
                    {hideTextInChoice ? (
                      <span className="text-slate-400 italic text-sm">音声を聞いて選択</span>
                    ) : (
                      choice
                    )}
                  </span>
                  {showResult && isCorrect && <Check className="text-green-600" size={20} />}
                  {showResult && isSelected && !isCorrect && <X className="text-red-600" size={20} />}
                </button>
                {hasChoiceAudio && (
                  <button
                    onClick={() => playChoice(idx)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg flex-shrink-0"
                    aria-label={`選択肢${String.fromCharCode(65 + idx)}を再生`}
                  >
                    <Play size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {!showResult &&
          isListeningPart &&
          current.choiceAudios &&
          (selectedPart === "part1" || selectedPart === "part2") &&
          !choicesTextVisible && (
            <button
              onClick={() => setChoicesTextVisible(true)}
              className="text-xs text-slate-500 hover:text-slate-700 underline"
            >
              選択肢のテキストを表示 (本来の試験では音声のみ)
            </button>
          )}

        {showResult && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
            <div className="text-xs font-bold text-amber-800 mb-1">解説</div>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{current.explanation}</p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          {!showResult ? (
            <button
              onClick={handleAnswer}
              disabled={selected === null}
              className="btn-primary disabled:opacity-50"
            >
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

function PartCard({ part, count, onClick }: { part: ToeicPart; count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={count === 0}
      className={clsx(
        "card text-left transition-all !p-4",
        count === 0 ? "opacity-50 cursor-not-allowed" : "hover:shadow-md hover:border-primary-300 cursor-pointer"
      )}
    >
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="text-lg font-bold text-slate-800">{partLabels[part].title}</h3>
        <span className="text-xs text-slate-500">{count}問</span>
      </div>
      <p className="text-sm text-slate-600">{partLabels[part].desc}</p>
    </button>
  );
}
