import MineSweeperBoard from "@/components/minesweeper/MineSweeperBoard";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
});

export default function MineSweeperMain() {
  return (
    <main>
      <div className={`${poppins.className}`}>
        <MineSweeperBoard />
      </div>
    </main>
  );
}
