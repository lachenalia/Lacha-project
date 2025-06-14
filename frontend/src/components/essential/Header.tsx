"use client";

import { useRouter } from "next/navigation";
import style from "./Header.module.css";
import { Sour_Gummy } from "next/font/google";

export default function Header() {
  const router = useRouter();

  const goToHome = () => {
    router.push("/");
  };

  const goToMenu = (menuName: string) => {
    router.push(`/${menuName}`);
  };

  return (
    <header>
      <div className={style.header}>
        <div className={style.logo} onClick={goToHome}>
          <img src="/images/pichu3d.webp" alt="pichu" width={70} height={70} />
          <h2>Pichu Project</h2>
        </div>
        <div className={style.topMenu}>
          <div onClick={() => goToMenu("sudoku")}>스도쿠</div>
          <div onClick={() => goToMenu("minesweeper")}>지뢰찾기</div>
        </div>
        <div className={style.setting}>MyPage</div>
      </div>
    </header>
  );
}
