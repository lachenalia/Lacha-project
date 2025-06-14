import SudokuBoard from "@/components/sudoku/SudokuBoard";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
});

export default function SudokuMain() {
  return (
    <main>
      <div className={`${poppins.className}`}>
        <SudokuBoard />
      </div>
    </main>
  );
}
