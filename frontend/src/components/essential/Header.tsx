"use client";

import Link from "next/link";
import {
  IconCalendarEvent,
  IconDeviceGamepad2,
  IconNotebook,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearAuth, getAuth } from "@/lib/auth";
import { apiPost } from "@/lib/api";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (href: string) => pathname === href;
  const isActivePrefix = (prefix: string) =>
    pathname === prefix || pathname.startsWith(prefix + "/");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [openMenu, setOpenMenu] = useState<
    "calendar" | "notes" | "games" | null
  >(null);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const saved =
      (localStorage.getItem("theme") as "light" | "dark" | null) ?? "light";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
    document.documentElement.classList.toggle("light", saved === "light");

    setIsAuthed(!!getAuth());
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setIsAuthed(!!getAuth());
  }, [pathname]);

  const logout = async () => {
    clearAuth();
    setIsAuthed(false);
    try {
      await apiPost("/auth/logout");
    } catch {
      // ignore
    }
    router.replace("/login");
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      document.documentElement.classList.toggle("dark", next === "dark");
      document.documentElement.classList.toggle("light", next === "light");
      return next;
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/80 backdrop-blur dark:border-emerald-950/40 dark:bg-slate-950/70">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-6">
        <Link
          href="/"
          className="flex items-end gap-2 rounded-xl px-2 py-1 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
        >
          <img
            src="/images/lacha.png"
            alt="lacha-logo"
            width={44}
            height={44}
          />
          <img
            src="/images/lacha-text.png"
            alt="lacha-text"
            width={110}
            height={28}
          />
        </Link>

        <nav className="flex flex-1 items-center justify-center gap-2">
          <div
            className="relative"
            onMouseEnter={() => setOpenMenu("calendar")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button
              type="button"
              aria-label="일정 메뉴"
              onFocus={() => setOpenMenu("calendar")}
              className={
                "flex h-10 w-10 items-center justify-center rounded-xl border text-slate-700 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-400 " +
                (isActivePrefix("/calendar")
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-100"
                  : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900")
              }
            >
              <IconCalendarEvent size={20} />
            </button>

            <div
              className={
                (openMenu === "calendar"
                  ? "visible translate-y-0 opacity-100"
                  : "invisible translate-y-1 opacity-0") +
                " absolute left-0 top-[calc(100%+8px)] w-44 rounded-2xl border border-slate-100 bg-white p-2 shadow-lg transition dark:border-slate-800 dark:bg-slate-950"
              }
            >
              <Link
                href="/calendar"
                onClick={() => setOpenMenu(null)}
                className={
                  "block rounded-xl px-3 py-2 text-sm font-semibold transition " +
                  (isActive("/calendar")
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100"
                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-900")
                }
              >
                일정관리
              </Link>
            </div>
          </div>

          <div
            className="relative"
            onMouseEnter={() => setOpenMenu("notes")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button
              type="button"
              aria-label="노트 메뉴"
              onFocus={() => setOpenMenu("notes")}
              className={
                "flex h-10 w-10 items-center justify-center rounded-xl border text-slate-700 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-400 " +
                (isActivePrefix("/notes") || isActivePrefix("/todo")
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-100"
                  : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900")
              }
            >
              <IconNotebook size={20} />
            </button>

            <div
              className={
                (openMenu === "notes"
                  ? "visible translate-y-0 opacity-100"
                  : "invisible translate-y-1 opacity-0") +
                " absolute left-0 top-[calc(100%+8px)] w-44 rounded-2xl border border-slate-100 bg-white p-2 shadow-lg transition dark:border-slate-800 dark:bg-slate-950"
              }
            >
              <Link
                href="/notes"
                onClick={() => setOpenMenu(null)}
                className={
                  "block rounded-xl px-3 py-2 text-sm font-semibold transition " +
                  (isActivePrefix("/notes")
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100"
                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-900")
                }
              >
                메모장
              </Link>
              <Link
                href="/todo"
                onClick={() => setOpenMenu(null)}
                className={
                  "block rounded-xl px-3 py-2 text-sm font-semibold transition " +
                  (isActivePrefix("/todo")
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100"
                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-900")
                }
              >
                To Do List
              </Link>
            </div>
          </div>

          <div
            className="relative"
            onMouseEnter={() => setOpenMenu("games")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button
              type="button"
              aria-label="게임 메뉴"
              onFocus={() => setOpenMenu("games")}
              className={
                "flex h-10 w-10 items-center justify-center rounded-xl border text-slate-700 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-400 " +
                (isActivePrefix("/sudoku") || isActivePrefix("/minesweeper")
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-100"
                  : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900")
              }
            >
              <IconDeviceGamepad2 size={20} />
            </button>

            <div
              className={
                (openMenu === "games"
                  ? "visible translate-y-0 opacity-100"
                  : "invisible translate-y-1 opacity-0") +
                " absolute left-0 top-[calc(100%+8px)] w-44 rounded-2xl border border-slate-100 bg-white p-2 shadow-lg transition dark:border-slate-800 dark:bg-slate-950"
              }
            >
              <Link
                href="/sudoku"
                onClick={() => setOpenMenu(null)}
                className={
                  "block rounded-xl px-3 py-2 text-sm font-semibold transition " +
                  (isActivePrefix("/sudoku")
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100"
                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-900")
                }
              >
                스도쿠
              </Link>
              <Link
                href="/minesweeper"
                onClick={() => setOpenMenu(null)}
                className={
                  "block rounded-xl px-3 py-2 text-sm font-semibold transition " +
                  (isActivePrefix("/minesweeper")
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100"
                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-900")
                }
              >
                지뢰찾기
              </Link>
            </div>
          </div>
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-200">
            Private
          </span>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <Link
            href="/me"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
          >
            MyPage
          </Link>

          {isAuthed && (
            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-700 shadow-sm transition hover:bg-rose-50 dark:border-rose-900/40 dark:bg-slate-950 dark:text-rose-200 dark:hover:bg-rose-950/30"
              aria-label="Logout"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
