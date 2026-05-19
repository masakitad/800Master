"use client";

import { useState } from "react";
import ListeningQuiz from "@/components/listening/ListeningQuiz";
import Dictation from "@/components/listening/Dictation";
import AudioFlashcards from "@/components/listening/AudioFlashcards";
import { Ear, Keyboard, Layers, type LucideIcon } from "lucide-react";
import clsx from "clsx";

type Mode = "menu" | "quiz" | "dictation" | "flashcard";

export default function ListeningPage() {
  const [mode, setMode] = useState<Mode>("menu");

  if (mode === "quiz") return <ListeningQuiz onBack={() => setMode("menu")} />;
  if (mode === "dictation") return <Dictation onBack={() => setMode("menu")} />;
  if (mode === "flashcard") return <AudioFlashcards onBack={() => setMode("menu")} />;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">リスニング集中トレーニング</h1>
        <p className="text-slate-600 mt-1">音声中心のクイズで耳を鍛えます</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ModeCard
          icon={Ear}
          title="リスニングクイズ"
          description="音声を聞いて意味を選択 (4択)"
          color="bg-blue-500"
          onClick={() => setMode("quiz")}
        />
        <ModeCard
          icon={Keyboard}
          title="ディクテーション"
          description="聞いた英文をタイピング"
          color="bg-purple-500"
          onClick={() => setMode("dictation")}
        />
        <ModeCard
          icon={Layers}
          title="音声フラッシュカード"
          description="音声→意味のフラッシュ訓練"
          color="bg-emerald-500"
          onClick={() => setMode("flashcard")}
        />
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded text-sm">
        <p className="text-amber-800">
          💡 <strong>音声品質を向上させるには:</strong> 画面右下の歯車アイコンから音声を選べます。
          ブラウザによってはオンライン音声(☁️)の方が自然で聞き取りやすい場合があります。
        </p>
      </div>
    </div>
  );
}

function ModeCard({
  icon: Icon,
  title,
  description,
  color,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className={clsx("card text-left hover:shadow-md transition-all")}>
      <div className={`${color} text-white p-3 rounded-xl inline-block mb-3`}>
        <Icon size={24} />
      </div>
      <h3 className="font-bold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-600 mt-1">{description}</p>
    </button>
  );
}
