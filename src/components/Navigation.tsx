"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, BookText, MessageSquare, Bot, BarChart3, Ear, Trophy } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/toeic", label: "TOEIC演習", icon: BookOpen },
  { href: "/mock", label: "模試", icon: Trophy },
  { href: "/listening", label: "リスニング", icon: Ear },
  { href: "/vocab", label: "単語", icon: BookText },
  { href: "/phrases", label: "フレーズ", icon: MessageSquare },
  { href: "/chat", label: "AI会話", icon: Bot },
  { href: "/progress", label: "進捗", icon: BarChart3 },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary-700">
            <span className="bg-primary-600 text-white rounded-md px-2 py-1 text-sm">800</span>
            <span className="hidden sm:inline">Master</span>
          </Link>
          <div className="flex items-center gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                    active
                      ? "bg-primary-50 text-primary-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon size={16} />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
