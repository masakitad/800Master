"use client";

import { useEffect, useState } from "react";
import { loadProgress, resetProgress, setGoals } from "@/lib/storage";
import { UserProgress, ToeicPart } from "@/lib/types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { Flame, TrendingUp, Clock, Target, Calendar, Award, AlertTriangle, type LucideIcon } from "lucide-react";

const partLabels: Record<ToeicPart, string> = {
  part1: "Part 1",
  part2: "Part 2",
  part3: "Part 3",
  part4: "Part 4",
  part5: "Part 5",
  part6: "Part 6",
  part7: "Part 7",
};

export default function ProgressPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  function handleReset() {
    if (window.confirm("本当に全ての進捗データをリセットしますか? この操作は取り消せません。")) {
      resetProgress();
      setProgress(loadProgress());
    }
  }

  if (!progress) {
    return <div className="card">読み込み中...</div>;
  }

  const scoreData = progress.quizResults
    .filter((r) => r.estimatedScore != null)
    .map((r, idx) => ({
      session: idx + 1,
      score: r.estimatedScore,
      date: new Date(r.date).toLocaleDateString("ja-JP", { month: "short", day: "numeric" }),
    }));

  const partStats: Record<string, { correct: number; total: number }> = {};
  progress.quizResults.forEach((r) => {
    if (r.part === "mock") return;
    const key = partLabels[r.part as ToeicPart] ?? r.part;
    if (!partStats[key]) partStats[key] = { correct: 0, total: 0 };
    partStats[key].correct += r.correctCount;
    partStats[key].total += r.totalCount;
  });
  const partAccuracyData = Object.entries(partStats).map(([part, s]) => ({
    part,
    accuracy: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
  }));

  const weeklyData = generateWeeklyData(progress);
  const last7Days = generateLast7DaysData(progress);

  const totalQuestionsAnswered = progress.quizResults.reduce((sum, r) => sum + r.totalCount, 0);
  const totalCorrect = progress.quizResults.reduce((sum, r) => sum + r.correctCount, 0);
  const overallAccuracy = totalQuestionsAnswered > 0
    ? Math.round((totalCorrect / totalQuestionsAnswered) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">学習進捗</h1>
          <p className="text-slate-600 mt-1">あなたの学習状況を可視化</p>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
        >
          <AlertTriangle size={14} /> データリセット
        </button>
      </header>

      <section className="card">
        <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
          <Target size={20} className="text-indigo-600" /> 学習目標の設定
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">1日の目標 (分)</label>
            <input
              type="number"
              min="5"
              max="240"
              step="5"
              defaultValue={progress.goals?.dailyMinutesTarget ?? 20}
              onBlur={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!Number.isNaN(v)) {
                  setGoals({ dailyMinutesTarget: v });
                  setProgress(loadProgress());
                }
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">目標スコア (TOEIC)</label>
            <input
              type="number"
              min="0"
              max="990"
              step="10"
              defaultValue={progress.goals?.targetScore ?? ""}
              placeholder="例: 800"
              onBlur={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!Number.isNaN(v)) {
                  setGoals({ targetScore: v });
                  setProgress(loadProgress());
                }
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">目標達成日</label>
            <input
              type="date"
              defaultValue={progress.goals?.targetDate ?? ""}
              onBlur={(e) => {
                if (e.target.value) {
                  setGoals({ targetDate: e.target.value });
                  setProgress(loadProgress());
                }
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Flame} label="連続学習日数" value={progress.currentStreak} unit="日" color="orange" />
        <StatCard icon={Award} label="最長連続" value={progress.longestStreak} unit="日" color="purple" />
        <StatCard icon={Clock} label="総学習時間" value={progress.totalStudyMinutes} unit="分" color="blue" />
        <StatCard icon={Target} label="総合正答率" value={overallAccuracy} unit="%" color="green" />
      </section>

      <section className="card">
        <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
          <TrendingUp size={20} className="text-primary-600" />
          推定スコア推移
        </h2>
        {scoreData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis domain={[0, 990]} stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={2} dot={{ fill: "#2563eb" }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState message="まだ演習データがありません。TOEIC演習を始めましょう。" />
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="card">
          <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Target size={20} className="text-green-600" />
            Part別正答率
          </h2>
          {partAccuracyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={partAccuracyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="part" stroke="#64748b" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Bar dataKey="accuracy" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="Part別データなし" />
          )}
        </section>

        <section className="card">
          <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Calendar size={20} className="text-orange-600" />
            直近7日間の学習時間
          </h2>
          {last7Days.some((d) => d.minutes > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Bar dataKey="minutes" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="直近7日間のデータなし" />
          )}
        </section>
      </div>

      <section className="card">
        <h2 className="text-lg font-bold text-slate-800 mb-3">活動別学習時間 (週次)</h2>
        {weeklyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="toeic" stackId="a" fill="#3b82f6" name="TOEIC" />
              <Bar dataKey="vocab" stackId="a" fill="#10b981" name="単語" />
              <Bar dataKey="phrases" stackId="a" fill="#a855f7" name="フレーズ" />
              <Bar dataKey="chat" stackId="a" fill="#ec4899" name="AI会話" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState message="まだ学習記録がありません" />
        )}
      </section>

      <section className="card">
        <h2 className="text-lg font-bold text-slate-800 mb-3">最近の演習履歴</h2>
        {progress.quizResults.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-slate-500 text-xs uppercase">
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2">日付</th>
                  <th className="text-left py-2">Part</th>
                  <th className="text-right py-2">正答</th>
                  <th className="text-right py-2">推定スコア</th>
                </tr>
              </thead>
              <tbody>
                {[...progress.quizResults].reverse().slice(0, 10).map((r) => (
                  <tr key={r.id} className="border-b border-slate-100">
                    <td className="py-2 text-slate-600">
                      {new Date(r.date).toLocaleDateString("ja-JP")}
                    </td>
                    <td className="py-2">{partLabels[r.part as ToeicPart] ?? r.part}</td>
                    <td className="py-2 text-right">
                      {r.correctCount}/{r.totalCount}
                      <span className="text-slate-500 ml-1">
                        ({Math.round((r.correctCount / r.totalCount) * 100)}%)
                      </span>
                    </td>
                    <td className="py-2 text-right font-bold text-primary-700">{r.estimatedScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="演習履歴なし" />
        )}
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

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-10 text-slate-400 text-sm">{message}</div>
  );
}

function generateLast7DaysData(progress: UserProgress) {
  const result: { day: string; minutes: number }[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const minutes = progress.studyRecords
      .filter((r) => r.date === iso)
      .reduce((sum, r) => sum + r.durationMinutes, 0);
    result.push({
      day: d.toLocaleDateString("ja-JP", { weekday: "short" }),
      minutes,
    });
  }
  return result;
}

function generateWeeklyData(progress: UserProgress) {
  const weekMap: Record<string, { toeic: number; vocab: number; phrases: number; chat: number }> = {};
  progress.studyRecords.forEach((r) => {
    const d = new Date(r.date);
    const sunday = new Date(d);
    sunday.setDate(d.getDate() - d.getDay());
    const weekKey = sunday.toISOString().slice(0, 10);
    if (!weekMap[weekKey]) weekMap[weekKey] = { toeic: 0, vocab: 0, phrases: 0, chat: 0 };
    weekMap[weekKey][r.activity] += r.durationMinutes;
  });
  return Object.entries(weekMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-8)
    .map(([week, data]) => ({
      week: new Date(week).toLocaleDateString("ja-JP", { month: "short", day: "numeric" }),
      ...data,
    }));
}
