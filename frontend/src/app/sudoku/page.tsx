import SudokuBoard from "@/components/sudoku/SudokuBoard";

export default function SudokuMain() {
  return (
    <main className="min-h-full bg-gradient-to-b from-white to-emerald-50">
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="mb-6">
          <p className="text-xs font-semibold text-emerald-700">Game</p>
          <div className="flex items-center gap-2">
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              스도쿠
            </h1>
            <a
              href="/sudoku/settings"
              className="mt-1 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            새 게임을 만들고, 실수 없이 끝까지 풀어보자.
          </p>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-white/80 p-4 shadow-sm backdrop-blur md:p-6">
          <SudokuBoard />
        </div>
      </div>
    </main>
  );
}
