"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    if (!auth) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <main className="min-h-full bg-gradient-to-b from-white to-emerald-50 dark:from-slate-950 dark:to-emerald-950/20">
      <div className="mx-auto w-full max-w-5xl px-6 py-12">
        <div className="rounded-3xl border border-emerald-100 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-emerald-950/40 dark:bg-slate-950/60">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <p className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Personal Playground
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-slate-100">
                Lacha Dashboard
              </h1>
              <p className="max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                혼자 쓰는 게임과 생산성 도구 모음. 스도쿠/지뢰찾기 같은 가벼운 게임부터 메모,
                To Do, 일정관리까지 한 곳에서 빠르게 열어볼 수 있게 만들고 있어.
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/sudoku"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                스도쿠 시작
              </Link>
              <Link
                href="/minesweeper"
                className="inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
              >
                지뢰찾기
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/sudoku"
              className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow dark:border-slate-800 dark:bg-slate-950/60"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">스도쿠</h2>
                  <p className="mt-1 text-sm text-slate-600">새 게임 생성, 빠른 플레이</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                  Game
                </span>
              </div>
              <p className="mt-4 text-xs text-slate-500 group-hover:text-slate-600">
                집중 모드로 퍼즐 한 판.
              </p>
            </Link>

            <Link
              href="/minesweeper"
              className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow dark:border-slate-800 dark:bg-slate-950/60"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">지뢰찾기</h2>
                  <p className="mt-1 text-sm text-slate-600">가벼운 뇌풀기</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                  Game
                </span>
              </div>
              <p className="mt-4 text-xs text-slate-500 group-hover:text-slate-600">
                운과 논리의 밸런스.
              </p>
            </Link>

            <Link
              href="/notes"
              className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow dark:border-slate-800 dark:bg-slate-950/60"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">메모장</h2>
                  <p className="mt-1 text-sm text-slate-600">아이디어/링크/임시 기록</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                  Tool
                </span>
              </div>
              <p className="mt-4 text-xs text-slate-500">빠른 메모 + 검색/태그</p>
            </Link>

            <Link
              href="/todo"
              className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow dark:border-slate-800 dark:bg-slate-950/60"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">To Do List</h2>
                  <p className="mt-1 text-sm text-slate-600">오늘 할 일 정리</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                  Tool
                </span>
              </div>
              <p className="mt-4 text-xs text-slate-500">캘린더 연동/반복 작업</p>
            </Link>

            <Link
              href="/calendar"
              className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow dark:border-slate-800 dark:bg-slate-950/60"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">일정관리</h2>
                  <p className="mt-1 text-sm text-slate-600">개인 캘린더</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                  Tool
                </span>
              </div>
              <p className="mt-4 text-xs text-slate-500">주간/월간 뷰, 알림</p>
            </Link>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Quick Notes</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">지금 떠오른 것</p>
              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                오늘의 목표: 작은 기능 하나 완성하기
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between px-1 text-xs text-slate-500 dark:text-slate-400">
          <p>Built for one — simple, fast, private.</p>
          <p className="text-slate-400">v0.1</p>
        </div>
      </div>
    </main>
  );
}
