import style from "./MineSweeperBoard.module.css";
import { Poppins } from "next/font/google";

type Props = {};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
});

export default function MineSweeperBoard({}: Props) {
  return (
    <div className={`${style.container} ${poppins.className}`}>
      <div>난이도 선택</div>
      <div></div>
    </div>
  );
}
