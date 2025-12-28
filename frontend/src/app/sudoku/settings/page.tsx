"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SudokuSettings } from "@/type/sudoku";

export default function SudokuSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<SudokuSettings>({
    showRemaining: true,
    enableHints: false,
    useLive: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem("sudoku_settings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem("sudoku_settings", JSON.stringify(settings));
    router.back();
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <main className="min-h-full bg-gradient-to-b from-white to-emerald-50">
      <div className="mx-auto w-full max-w-xl px-6 py-10">
        <div className="mb-6 flex items-center gap-2">
          <button onClick={() => router.back()} className="rounded-full p-2 hover:bg-slate-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-slate-600">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            게임 설정
          </h1>
        </div>

        <div className="space-y-4 rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur">
          
          {/* Show Remaining Counts */}
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-semibold text-slate-800">남은 카운트 표시</p>
              <p className="text-xs text-slate-500">숫자 버튼 위에 남은 개수를 표시합니다.</p>
            </div>
            <button
              onClick={() => toggleSetting("showRemaining")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.showRemaining ? "bg-[rgb(var(--primary))]" : "bg-slate-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.showRemaining ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <hr className="border-slate-100" />

          {/* Enable Hints */}
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-semibold text-slate-800">힌트 활성화</p>
              <p className="text-xs text-slate-500">게임을 풀 때 힌트를 사용할 수 있습니다.</p>
            </div>
            <button
              onClick={() => toggleSetting("enableHints")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.enableHints ? "bg-[rgb(var(--primary))]" : "bg-slate-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.enableHints ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <hr className="border-slate-100" />

          {/* Use Live */}
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-semibold text-slate-800">생명력(Life) 사용</p>
              <p className="text-xs text-slate-500">틀리면 하트가 줄어들고 게임이 끝납니다.</p>
            </div>
            <button
              onClick={() => toggleSetting("useLive")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.useLive ? "bg-[rgb(var(--primary))]" : "bg-slate-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.useLive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={saveSettings}
            className="rounded-lg bg-[rgb(var(--primary))] px-6 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            저장
          </button>
        </div>
        
      </div>
    </main>
  );
}
