import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import VoiceSettingsPanel from "@/components/VoiceSettings";

export const metadata: Metadata = {
  title: "800Master - 総合英会話・TOEIC学習アプリ",
  description: "TOEIC 800点を目指す総合英会話学習アプリ。問題演習、単語暗記、フレーズ学習、AI会話、進捗管理。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-slate-50">
        <Navigation />
        <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
        <VoiceSettingsPanel />
      </body>
    </html>
  );
}
