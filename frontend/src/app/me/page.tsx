"use client";

import { apiGet } from "@/lib/api";
import { useEffect, useState } from "react";
import CategoryManager from "@/components/settings/CategoryManager";

export default function MyPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await apiGet("/user/my");
        setUser(data);
      } catch (e) {
        console.error("Failed to load user info", e);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return (
    <main className="min-h-full bg-gradient-to-b from-white to-emerald-50 dark:from-slate-950 dark:to-emerald-950/20">
      <div className="mx-auto w-full max-w-2xl px-6 py-10">
        <div className="mb-8">
          <p className="text-xs font-semibold text-emerald-700 tracking-wider uppercase">Account</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            MyPage
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            개인 설정과 카테고리 기물을 관리합니다.
          </p>
        </div>

        <div className="mb-10 rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-emerald-950/40 dark:bg-slate-950/60">
          <h2 className="mb-4 text-lg font-bold text-slate-800 dark:text-slate-200">기본 정보</h2>
          {loading ? (
             <p className="text-sm text-slate-400 animate-pulse">Loading...</p>
          ) : user ? (
            <div className="space-y-3">
              <div className="flex justify-between border-b border-slate-50 dark:border-slate-800 pb-2">
                <span className="text-sm font-semibold text-slate-500">이름</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{user.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 dark:border-slate-800 pb-2">
                <span className="text-sm font-semibold text-slate-500">이메일</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{user.email}</span>
              </div>
              <div className="flex justify-between">
                 <span className="text-sm font-semibold text-slate-500">가입일</span>
                 <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-rose-500">사용자 정보를 불러올 수 없습니다.</p>
          )}
        </div>

        <div className="mt-12">
          <h2 className="mb-6 text-lg font-bold text-slate-800 dark:text-slate-200">통합 카테고리 관리</h2>
          <CategoryManager />
        </div>
      </div>
    </main>
  );
}
