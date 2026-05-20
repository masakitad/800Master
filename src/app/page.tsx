"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, BookText, MessageSquare, Bot, Flame, TrendingUp, Clock, Target, Ear, Trophy, type LucideIcon } from "lucide-react";
import { loadProgress } from "@/lib/storage";
import { UserProgress } from "@/lib/types";
import { estimateToeicScore } from "@/data/toeic-questions";

export default function HomePage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const latestScore = progress?.quizResults && progress.quizResults.length > 0
    ? estimateToeicScore(
        progress.quizResults[progress.quizResults.length - 1].correctCount,
        progress.quizResults[progress.quizResults.length - 1].totalCount
      )
    : 0;

  return (
    <div className="space-y-6">
      <header className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white shadow-md">
        <h1 className="text-3xl font-bold mb-2">800Master</h1>
        <p className="text-primary-100">TOEIC 800点突破を目指す総合英会話学習アプリ</p>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Flame} label="連続学習" value={progress?.currentStreak ?? 0} unit="日" color="orange" />
        <StatCard icon={TrendingUp} label="最新スコア" value={latestScore} unit="点" color="green" />
        <StatCard icon={Clock} label="総学習時間" value={progress?.totalStudyMinutes ?? 0} unit="分" color="blue" />
        <StatCard icon={Target} label="最長連続" value={progress?.longestStreak ?? 0} unit="日" color="purple" />
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4 text-slate-800">学習メニュー</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MenuCard
            href="/toeic"
            icon={BookOpen}
            title="TOEIC Part 1-7 演習"
            description="リスニング・リーディングの各パート対策"
            color="bg-blue-500"
          />
          <MenuCard
            href="/mock"
            icon={Trophy}
            title="模擬試験"
            description="全Partから出題、推定スコアと弱点分析"
            color="bg-amber-500"
          />
          <MenuCard
            href="/listening"
            icon={Ear}
            title="リスニング集中"
            description="音声クイズ・ディクテーション・音声カード"
            color="bg-cyan-500"
          />
          <MenuCard
            href="/vocab"
            icon={BookText}
            title="単語・熟語暗記"
            description="フラッシュカードと間隔反復学習"
            color="bg-green-500"
          />
          <MenuCard
            href="/phrases"
            icon={MessageSquare}
            title="シーン別フレーズ"
            description="ビジネス・日常・旅行の表現"
            color="bg-purple-500"
          />
          <MenuCard
            href="/chat"
            icon={Bot}
            title="AI英会話チャット"
            description="AIと自由に英会話練習"
            color="bg-rose-500"
          />
        </div>
      </section>

      <section className="card">
        <h2 className="text-lg font-bold mb-3 text-slate-800">今日のおすすめ</h2>
        <p className="text-slate-600 text-sm mb-4">
          毎日少しずつ続けることが800点突破の近道です。まずは1日15分から始めましょう。
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/toeic?part=part5" className="btn-primary text-sm">
            Part 5 短文穴埋め
          </Link>
          <Link href="/vocab" className="btn-outline text-sm">
            今日の単語10個
          </Link>
          <Link href="/phrases" className="btn-outline text-sm">
            ビジネスフレーズ
          </Link>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  color,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  unit: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
  };
  return (
    <div className="card !p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon size={20} />
        </div>
        <div>
          <div className="text-xs text-slate-500">{label}</div>
          <div className="text-xl font-bold text-slate-800">
            {value}
            <span className="text-sm font-normal text-slate-500 ml-1">{unit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuCard({
  href,
  icon: Icon,
  title,
  description,
  color,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <Link href={href} className="card hover:shadow-md transition-shadow group">
      <div className="flex items-start gap-4">
        <div className={`${color} text-white p-3 rounded-xl`}>
          <Icon size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-800 group-hover:text-primary-700 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-slate-600 mt-1">{description}</p>
        </div>
      </div>
    </Link>
  );
}
