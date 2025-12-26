"use client";

import { apiGet } from "@/lib/api";
import { useEffect, useState } from "react";

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
    <main className="min-h-full bg-gradient-to-b from-white to-emerald-50">
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="mb-6">
          <p className="text-xs font-semibold text-emerald-700">Account</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            MyPage
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            개인 설정과 간단한 상태 정보를 모아둘 공간.
          </p>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur">
          {loading ? (
             <p className="text-sm text-slate-600">Loading...</p>
          ) : user ? (
            <div className="space-y-4">
              <div>
                <span className="font-semibold text-slate-900">Name:</span>{" "}
                <span className="text-slate-700">{user.name}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900">Email:</span>{" "}
                <span className="text-slate-700">{user.email}</span>
              </div>
              <div>
                 <span className="font-semibold text-slate-900">Joined:</span>{" "}
                 <span className="text-slate-700">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-600">사용자 정보를 불러올 수 없습니다.</p>
          )}
        </div>
      </div>
    </main>
  );
}
