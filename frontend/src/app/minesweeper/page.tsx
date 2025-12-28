import MineSweeperBoard from "@/components/minesweeper/MineSweeperBoard";
import PageHeader from "@/components/essential/PageHeader";

export default function MineSweeperMain() {
  return (
    <main className="min-h-full bg-gradient-to-b from-white to-emerald-50 dark:from-slate-950 dark:to-emerald-950/20">
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <PageHeader
          label="Game"
          title="지뢰찾기"
          description="빠르게 안전지대를 찾고, 지뢰는 피해가자."
        />

        <div className="rounded-3xl border border-emerald-100 bg-white/80 p-4 shadow-sm backdrop-blur md:p-6">
          <MineSweeperBoard />
        </div>
      </div>
    </main>
  );
}
