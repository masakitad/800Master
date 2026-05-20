"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Languages } from "lucide-react";
import { ChatMessage } from "@/lib/types";
import { addStudyRecord } from "@/lib/storage";
import VoiceInput from "@/components/VoiceInput";
import clsx from "clsx";

const TOPICS = [
  { en: "Talk about my hobbies", jp: "趣味について話す" },
  { en: "Order food at a restaurant", jp: "レストランで注文する" },
  { en: "Job interview practice", jp: "面接の練習" },
  { en: "Travel and vacation", jp: "旅行と休暇" },
  { en: "Business meeting", jp: "ビジネス会議" },
  { en: "Make small talk", jp: "雑談する" },
];

const STARTER_RESPONSES: Record<string, string[]> = {
  hobby: [
    "That sounds interesting! How long have you been doing it?",
    "What do you enjoy most about it?",
    "Do you do it alone or with friends?",
  ],
  food: [
    "That's a great choice! Would you like anything to drink with that?",
    "Excellent. How would you like it prepared?",
    "Sure. Would you like to start with an appetizer?",
  ],
  interview: [
    "Thank you for coming today. Could you tell me about yourself?",
    "What are your greatest strengths?",
    "Why are you interested in this position?",
  ],
  travel: [
    "Where would you like to go?",
    "What kind of activities do you enjoy on vacation?",
    "Have you traveled abroad before?",
  ],
  business: [
    "Good morning. Shall we get started?",
    "Could you walk me through the proposal?",
    "What are your thoughts on the budget?",
  ],
  smalltalk: [
    "How's your day going?",
    "Did you do anything fun over the weekend?",
    "The weather has been nice lately, hasn't it?",
  ],
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [topic, setTopic] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [startTime] = useState(Date.now());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (messages.length > 2) {
        const minutes = Math.max(1, Math.round((Date.now() - startTime) / 60000));
        addStudyRecord({ activity: "chat", durationMinutes: minutes });
      }
    };
  }, [messages.length, startTime]);

  function startTopic(topicEn: string) {
    setTopic(topicEn);
    const key = topicEn.toLowerCase().includes("hobby")
      ? "hobby"
      : topicEn.toLowerCase().includes("food") || topicEn.toLowerCase().includes("restaurant")
      ? "food"
      : topicEn.toLowerCase().includes("interview")
      ? "interview"
      : topicEn.toLowerCase().includes("travel")
      ? "travel"
      : topicEn.toLowerCase().includes("business")
      ? "business"
      : "smalltalk";
    const responses = STARTER_RESPONSES[key];
    const starter = responses[0];
    setMessages([
      {
        role: "assistant",
        content: starter,
        timestamp: new Date().toISOString(),
      },
    ]);
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = {
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          topic,
        }),
      });
      const data = await res.json();
      const reply: ChatMessage = {
        role: "assistant",
        content: data.reply || generateMockReply(userMsg.content, topic),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, reply]);
    } catch {
      const reply: ChatMessage = {
        role: "assistant",
        content: generateMockReply(userMsg.content, topic),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, reply]);
    } finally {
      setLoading(false);
    }
  }

  function generateMockReply(userText: string, currentTopic: string | null): string {
    const key = !currentTopic
      ? "smalltalk"
      : currentTopic.toLowerCase().includes("hobby")
      ? "hobby"
      : currentTopic.toLowerCase().includes("food") || currentTopic.toLowerCase().includes("restaurant")
      ? "food"
      : currentTopic.toLowerCase().includes("interview")
      ? "interview"
      : currentTopic.toLowerCase().includes("travel")
      ? "travel"
      : currentTopic.toLowerCase().includes("business")
      ? "business"
      : "smalltalk";
    const responses = STARTER_RESPONSES[key];
    const idx = Math.min(messages.filter((m) => m.role === "assistant").length, responses.length - 1);
    return responses[idx];
  }

  async function translateMessage(idx: number, text: string) {
    if (showTranslation[idx]) {
      setShowTranslation((prev) => {
        const next = { ...prev };
        delete next[idx];
        return next;
      });
      return;
    }
    setShowTranslation((prev) => ({ ...prev, [idx]: "翻訳中..." }));
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setShowTranslation((prev) => ({ ...prev, [idx]: data.translation || "翻訳機能はAPI設定後に利用できます" }));
    } catch {
      setShowTranslation((prev) => ({ ...prev, [idx]: "翻訳機能はAPI設定後に利用できます" }));
    }
  }

  function reset() {
    setTopic(null);
    setMessages([]);
    setShowTranslation({});
  }

  if (!topic) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Bot className="text-rose-500" /> AI英会話チャット
          </h1>
          <p className="text-slate-600 mt-1">AIと英語で会話練習。話したいトピックを選んでください。</p>
        </header>

        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded text-sm">
          <p className="text-amber-800">
            <strong>注意:</strong> OpenAI API キーを <code>.env.local</code> に設定するとリアルなAI会話ができます。
            未設定の場合は定型応答モードで動作します。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TOPICS.map((t) => (
            <button
              key={t.en}
              onClick={() => startTopic(t.en)}
              className="card text-left hover:shadow-md hover:border-rose-300 transition-all flex items-start gap-3"
            >
              <Sparkles className="text-rose-400 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <div className="font-bold text-slate-800">{t.en}</div>
                <div className="text-sm text-slate-600">{t.jp}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs text-slate-500">Topic</div>
          <h1 className="text-lg font-bold text-slate-800">{topic}</h1>
        </div>
        <button onClick={reset} className="btn-secondary text-sm">トピック変更</button>
      </div>

      <div className="flex-1 overflow-y-auto card !p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={clsx("flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}>
            {msg.role === "assistant" && (
              <div className="bg-rose-100 text-rose-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                <Bot size={18} />
              </div>
            )}
            <div className="max-w-[75%]">
              <div
                className={clsx(
                  "px-4 py-2 rounded-2xl",
                  msg.role === "user"
                    ? "bg-primary-600 text-white rounded-tr-sm"
                    : "bg-slate-100 text-slate-800 rounded-tl-sm"
                )}
              >
                {msg.content}
              </div>
              {msg.role === "assistant" && (
                <div className="flex items-center gap-2 mt-1 ml-1">
                  <button
                    onClick={() => translateMessage(idx, msg.content)}
                    className="text-xs text-slate-500 hover:text-primary-600 flex items-center gap-1"
                  >
                    <Languages size={12} /> 訳
                  </button>
                  {showTranslation[idx] && (
                    <span className="text-xs text-slate-600 italic">{showTranslation[idx]}</span>
                  )}
                </div>
              )}
            </div>
            {msg.role === "user" && (
              <div className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                <User size={18} />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-2 justify-start">
            <div className="bg-rose-100 text-rose-600 rounded-full w-8 h-8 flex items-center justify-center">
              <Bot size={18} />
            </div>
            <div className="bg-slate-100 px-4 py-2 rounded-2xl text-slate-500">考え中...</div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="mt-3 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or speak in English..."
          className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
          disabled={loading}
        />
        <VoiceInput
          lang="en-US"
          label="クリックして英語を話す"
          onTranscript={(text, isFinal) => {
            setInput(text);
          }}
          className="!p-3"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="btn-primary disabled:opacity-50 flex items-center gap-1"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
