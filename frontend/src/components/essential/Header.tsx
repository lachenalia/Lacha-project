"use client";

import { useRouter } from "next/navigation";
import style from "./Header.module.css";
import { Sour_Gummy } from "next/font/google";

const SourGummy = Sour_Gummy({});

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
          <div className={style.logoImg}>
            <img src="/images/lacha.png" alt="lacha-logo" width={70} />
          </div>
          <div className={style.logoText}>
            <img src="/images/lacha-text.png" alt="lacha-text" width={150} />
          </div>
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
