import MineSweeperBoard from "@/components/minesweeper/MineSweeperBoard";

export default function MineSweeperMain() {
  return (
    <main className="min-h-full bg-gradient-to-b from-white to-emerald-50">
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="mb-6">
          <p className="text-xs font-semibold text-emerald-700">Game</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            지뢰찾기
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            빠르게 안전지대를 찾고, 지뢰는 피해가자.
          </p>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-white/80 p-4 shadow-sm backdrop-blur md:p-6">
          <MineSweeperBoard />
        </div>
      </div>
    </main>
  );
}
