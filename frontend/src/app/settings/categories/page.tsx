"use client";

import { useRouter } from "next/navigation";
import CategoryManager from "@/components/settings/CategoryManager";

export default function CategoriesPage() {
  const router = useRouter();

  return (
    <main className="min-h-full bg-gradient-to-b from-white to-emerald-50 dark:from-slate-950 dark:to-emerald-950/20">
      <div className="mx-auto w-full max-w-2xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-700 tracking-wider uppercase">Settings</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              통합 카테고리 관리
            </h1>
          </div>
          <button
            onClick={() => router.back()}
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 shadow-sm border border-transparent hover:border-emerald-100 transition-all"
          >
            돌아가기
          </button>
        </div>

        <CategoryManager />
      </div>
    </main>
  );
}
