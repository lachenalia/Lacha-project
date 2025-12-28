"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { setAuth } from "@/lib/auth";
import { apiPost } from "@/lib/api";
import { LoginResponse } from "@/type/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await apiPost<
        LoginResponse,
        { email: string; password: string }
      >("/auth/login", { email, password });

      if (!data.loginResult) {
        setError(data.failCode === 401 ? "비밀번호가 틀렸어." : "로그인 실패");
        return;
      }

      setAuth({
        userInfo: data.userInfo,
        token: data.token,
        tokenValidBefore: data.tokenValidBefore,
      });
      router.replace("/");
    } catch {
      setError("로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-full bg-gradient-to-b from-white to-emerald-50 dark:from-slate-950 dark:to-emerald-950/20">
      <div className="mx-auto w-full max-w-md px-6 py-14">
        <div className="rounded-3xl border border-emerald-100 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-emerald-950/40 dark:bg-slate-950/60">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Login
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            이메일과 비밀번호로 로그인해.
          </p>

          <form className="mt-6 space-y-4" onSubmit={submit}>
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-emerald-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-emerald-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>

            <div className="pt-2">
              <Link
                href="/signup"
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-center text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
              >
                회원가입
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
