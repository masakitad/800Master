"use client";

import { useEffect, useState } from "react";
import { listEnglishVoices, loadVoices, speak } from "@/lib/speech";
import { Settings, Volume2, X } from "lucide-react";

const SETTINGS_KEY = "800master_voice_settings";

export interface VoiceSettings {
  voiceURI: string | null;
  rate: number;
  lang: "en-US" | "en-GB";
}

export function loadVoiceSettings(): VoiceSettings {
  if (typeof window === "undefined") return { voiceURI: null, rate: 0.95, lang: "en-US" };
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { voiceURI: null, rate: 0.95, lang: "en-US" };
    return { voiceURI: null, rate: 0.95, lang: "en-US", ...JSON.parse(raw) };
  } catch {
    return { voiceURI: null, rate: 0.95, lang: "en-US" };
  }
}

export function saveVoiceSettings(s: VoiceSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

export function getVoiceByURI(uri: string | null): SpeechSynthesisVoice | null {
  if (!uri) return null;
  const voices = listEnglishVoices();
  return voices.find((v) => v.voiceURI === uri) ?? null;
}

export default function VoiceSettingsPanel() {
  const [open, setOpen] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [settings, setSettings] = useState<VoiceSettings>({ voiceURI: null, rate: 0.95, lang: "en-US" });

  useEffect(() => {
    loadVoices().then(() => {
      setVoices(listEnglishVoices());
      setSettings(loadVoiceSettings());
    });
  }, [open]);

  function update<K extends keyof VoiceSettings>(key: K, value: VoiceSettings[K]) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    saveVoiceSettings(next);
  }

  function testVoice() {
    speak("This is a sample sentence to test the audio quality.", {
      voice: getVoiceByURI(settings.voiceURI),
      rate: settings.rate,
      lang: settings.lang,
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 bg-white shadow-lg border border-slate-200 rounded-full p-3 hover:bg-slate-50 z-20"
        aria-label="音声設定"
      >
        <Settings size={20} className="text-slate-700" />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-30 flex items-end sm:items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Volume2 size={20} /> 音声設定
              </h2>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">音声 (Voice)</label>
              <select
                value={settings.voiceURI ?? ""}
                onChange={(e) => update("voiceURI", e.target.value || null)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              >
                <option value="">自動 (推奨高品質を選択)</option>
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang}){v.localService ? " 🔵" : " ☁️"}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">
                🔵=端末内蔵、☁️=オンライン (高品質な場合が多い)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                発音アクセント
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["en-US", "en-GB"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => update("lang", lang)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      settings.lang === lang
                        ? "bg-primary-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {lang === "en-US" ? "米国 (US)" : "英国 (UK)"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                話す速度: <span className="font-bold">{settings.rate.toFixed(2)}x</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={settings.rate}
                onChange={(e) => update("rate", parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>遅い</span>
                <span>標準</span>
                <span>速い</span>
              </div>
            </div>

            <button onClick={testVoice} className="btn-primary w-full">
              テスト再生
            </button>
          </div>
        </div>
      )}
    </>
  );
}
