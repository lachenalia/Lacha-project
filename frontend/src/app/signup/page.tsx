"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { setAuth } from "@/lib/auth";
import { apiPost } from "@/lib/api";

type CheckEmailResponse = { available: boolean };
type SignupResponse = { ok: boolean; message?: string };
type LoginResponse =
  | {
      loginResult: true;
      userInfo: { email: string; name: string; userId?: number };
      token?: string;
      tokenValidBefore?: string;
    }
  | { loginResult: false; failCode?: number };

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [emailChecked, setEmailChecked] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

  const [loadingEmailCheck, setLoadingEmailCheck] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const passwordsMatch = useMemo(
    () =>
      password.length > 0 &&
      passwordConfirm.length > 0 &&
      password === passwordConfirm,
    [password, passwordConfirm],
  );

  const canSubmit =
    email.length > 0 &&
    name.length > 0 &&
    password.length > 0 &&
    passwordConfirm.length > 0 &&
    passwordsMatch &&
    emailChecked &&
    emailAvailable === true;

  const checkEmail = async () => {
    setError(null);
    setSuccess(null);

    if (!email) {
      setError("이메일을 입력해줘.");
      return;
    }

    setLoadingEmailCheck(true);
    try {
      const data = await apiPost<CheckEmailResponse, { email: string }>(
        "/auth/check-email",
        { email },
      );

      setEmailChecked(true);
      setEmailAvailable(data.available);
      setSuccess(
        data.available
          ? "사용 가능한 이메일이야."
          : "이미 사용 중인 이메일이야.",
      );
    } catch {
      setError("이메일 중복확인에 실패했어.");
      setEmailChecked(false);
      setEmailAvailable(null);
    } finally {
      setLoadingEmailCheck(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!passwordsMatch) {
      setError("비밀번호가 일치하지 않아.");
      return;
    }

    if (!canSubmit) {
      setError("입력값을 확인해줘.");
      return;
    }

    setLoadingSubmit(true);
    try {
      const data = await apiPost<
        SignupResponse,
        { email: string; name: string; password: string }
      >("/auth/signup", { email, name, password });

      // Auto-login after successful signup
      const loginData = await apiPost<
        LoginResponse,
        { email: string; password: string }
      >("/auth/login", { email, password });

      if (!loginData.loginResult) {
        setSuccess("가입 완료! 로그인 페이지로 이동할게.");
        router.replace("/login");
        return;
      }

      setAuth({
        userInfo: loginData.userInfo,
        token: loginData.token,
        tokenValidBefore: loginData.tokenValidBefore,
      });
      router.replace("/");
    } catch {
      setError("가입에 실패했어.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const onChangeEmail = (v: string) => {
    setEmail(v);
    setEmailChecked(false);
    setEmailAvailable(null);
  };

  return (
    <main className="min-h-full bg-gradient-to-b from-white to-emerald-50 dark:from-slate-950 dark:to-emerald-950/20">
      <div className="mx-auto w-full max-w-md px-6 py-14">
        <div className="rounded-3xl border border-emerald-100 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-emerald-950/40 dark:bg-slate-950/60">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Signup
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                필요한 정보를 입력하고 가입해.
              </p>
            </div>
            <Link
              href="/login"
              className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300"
            >
              로그인
            </Link>
          </div>

          <form className="mt-6 space-y-4" onSubmit={submit}>
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Email
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  value={email}
                  onChange={(e) => onChangeEmail(e.target.value)}
                  type="email"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-emerald-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={checkEmail}
                  disabled={loadingEmailCheck}
                  className="whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
                >
                  {loadingEmailCheck ? "확인중..." : "중복확인"}
                </button>
              </div>
              {emailChecked && emailAvailable !== null && (
                <p
                  className={`mt-2 text-xs font-semibold ${
                    emailAvailable
                      ? "text-emerald-700 dark:text-emerald-300"
                      : "text-rose-700 dark:text-rose-200"
                  }`}
                >
                  {emailAvailable ? "사용 가능" : "사용 불가"}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
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

            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Password Confirm
              </label>
              <input
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                type="password"
                required
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-emerald-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
              {password.length > 0 &&
                passwordConfirm.length > 0 &&
                !passwordsMatch && (
                  <p className="mt-2 text-xs font-semibold text-rose-700 dark:text-rose-200">
                    비밀번호가 일치하지 않아.
                  </p>
                )}
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-100">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loadingSubmit || !canSubmit}
              className="w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {loadingSubmit ? "가입 중..." : "가입하기"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
