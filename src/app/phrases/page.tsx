"use client";

import { useState } from "react";
import { phraseScenes } from "@/data/phrases";
import { addStudyRecord } from "@/lib/storage";
import { Volume2, ChevronLeft } from "lucide-react";

export default function PhrasesPage() {
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(0);

  function speak(text: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  }

  function selectScene(id: string) {
    setSelectedSceneId(id);
    setStartTime(Date.now());
  }

  function back() {
    if (selectedSceneId && startTime > 0) {
      const minutes = Math.max(1, Math.round((Date.now() - startTime) / 60000));
      addStudyRecord({ activity: "phrases", durationMinutes: minutes });
    }
    setSelectedSceneId(null);
    setStartTime(0);
  }

  const selected = selectedSceneId ? phraseScenes.find((s) => s.id === selectedSceneId) : null;

  if (!selected) {
    const categories = Array.from(new Set(phraseScenes.map((s) => s.category)));
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-slate-800">シーン別フレーズ</h1>
          <p className="text-slate-600 mt-1">よく使われる英語表現をシーン別に学習</p>
        </header>

        {categories.map((cat) => (
          <section key={cat}>
            <h2 className="text-lg font-bold text-slate-700 mb-3">{cat}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {phraseScenes
                .filter((s) => s.category === cat)
                .map((scene) => (
                  <button
                    key={scene.id}
                    onClick={() => selectScene(scene.id)}
                    className="card text-left hover:shadow-md hover:border-primary-300 transition-all"
                  >
                    <h3 className="font-bold text-slate-800">{scene.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{scene.phrases.length} フレーズ</p>
                  </button>
                ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button onClick={back} className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium">
        <ChevronLeft size={18} /> 一覧に戻る
      </button>
      <header>
        <div className="text-sm text-slate-500">{selected.category}</div>
        <h1 className="text-2xl font-bold text-slate-800">{selected.title}</h1>
      </header>

      <div className="space-y-2">
        {selected.phrases.map((p, idx) => (
          <div key={idx} className="card !p-4 flex items-start gap-3">
            <div className="bg-primary-50 text-primary-700 font-bold rounded-md w-8 h-8 flex items-center justify-center flex-shrink-0">
              {idx + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="font-medium text-slate-800">{p.en}</div>
                <button
                  onClick={() => speak(p.en)}
                  className="text-slate-400 hover:text-primary-600 flex-shrink-0"
                  aria-label="読み上げ"
                >
                  <Volume2 size={18} />
                </button>
              </div>
              <div className="text-sm text-slate-600 mt-1">{p.jp}</div>
              {p.note && <div className="text-xs text-slate-500 mt-1">💡 {p.note}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
