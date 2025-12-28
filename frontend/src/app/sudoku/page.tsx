import SudokuBoard from "@/components/sudoku/SudokuBoard";
import PageHeader from "@/components/essential/PageHeader";

export default function SudokuMain() {
  return (
    <main className="min-h-full bg-gradient-to-b from-white to-emerald-50 dark:from-slate-950 dark:to-emerald-950/20">
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <PageHeader
          label="Game"
          title="스도쿠"
          description="새 게임을 만들고, 실수 없이 끝까지 풀어보자."
          settingHref="/sudoku/settings"
        />

        <div className="rounded-3xl border border-emerald-100 bg-white/80 p-4 shadow-sm backdrop-blur md:p-6">
          <SudokuBoard />
        </div>
      </div>
    </main>
  );
}
