"use client";

import { JSX, SetStateAction, useEffect, useState } from "react";
import style from "./SudokuBoard.module.css";
import { apiGet, apiPost } from "@/lib/api";
import { range } from "@/lib/utils";

type Props = {};

import { Cell, CellStatus, SudokuSettings } from "@/type/sudoku";

function checkGameEnd(gameBoard: Cell[][]) {
  for (const row of gameBoard) {
    for (const cell of row) {
      if (cell.status === "wrong" || cell.status === "empty") return false;
    }
  }
  return true;
}

function checkHighlight(cell: Cell, clicked: Cell) {
  if (clicked.row === cell.row) return true;
  if (clicked.col === cell.col) return true;

  // 3*3 구역 색칠해야 함
  const clickedValue =
    clicked.status == "fixed" ? clicked.answer : clicked.inputValue;
  const cellValue = cell.status == "fixed" ? cell.answer : cell.inputValue;
  return clickedValue && cellValue && clickedValue === cellValue;
}

export default function SudokuBoard({}: Props) {
  const [gameBoard, setGameBoard] = useState<Cell[][] | null>(null);
  const [clicked, setClicked] = useState<Cell | null>(null);
  const [life, setLife] = useState<number>(3);
  const [settings, setSettings] = useState<SudokuSettings>({
    showRemaining: true,
    enableHints: false,
    useLive: true,
  });

  const [difficulty, setDifficulty] = useState("easy");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hintCount, setHintCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("sudoku_settings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const getNewGame = async () => {
    try {
      const data = await apiGet<{ solution: number[][]; puzzle: number[][] }>(
        `/sudoku?difficulty=${difficulty}`
      );
      
      const { solution, puzzle } = data;
      const newBoard: Cell[][] = [];
      for (const i of range(0, 9)) {
        const row: Cell[] = [];
        for (const j of range(0, 9)) {
          row.push({
            row: i,
            col: j,
            answer: solution[i][j],
            status: puzzle[i][j] !== 0 ? "fixed" : "empty",
            inputValue: puzzle[i][j] !== 0 ? puzzle[i][j] : undefined,
          });
        }
        newBoard.push(row);
      }
      setGameBoard(newBoard);
      setLife(3);
      setClicked(null);
      setElapsedTime(0);
      setIsGameOver(false);
      setHintCount(0);

    } catch (e: any) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!gameBoard) {
      getNewGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!gameBoard || isGameOver) return;
    if (settings.useLive && life < 0) return;
    
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameBoard, life, settings.useLive, isGameOver]);

  const finishGame = async (success: boolean) => {
    if (isGameOver) return;
    setIsGameOver(true);

    const diffMap: Record<string, number> = { easy: 0, medium: 1, hard: 2 };
    const logData = {
      difficulty: diffMap[difficulty] ?? 0,
      result: success,
      playTimeSec: elapsedTime,
      useHint: hintCount,
      lifeLost: 3 - Math.max(0, life),
      attemptCount: 1,
    };

    try {
      await apiPost("/sudoku/log", logData);
    } catch (e) {
      console.error("Failed to save sudoku log", e);
    }
  };

  useEffect(() => {
    if (settings.useLive && life < 0 && !isGameOver) {
      alert("Game Over!");
      finishGame(false);
    }
  }, [life, settings.useLive, isGameOver]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const numberCounts = Array(10).fill(0);
  if (gameBoard) {
    gameBoard.forEach((row) => {
      row.forEach((cell) => {
        if (cell.status === "fixed" || cell.status === "correct") {
          numberCounts[cell.answer]++;
        }
      });
    });
  }

  let totalFilled = 0;
  let remainingTypes = 0;
  for (const i of range(1, 9)) {
    totalFilled += numberCounts[i];
    if (numberCounts[i] < 9) remainingTypes++;
  }
  const remainingCells = 81 - totalFilled;
  const canAutoComplete = !isGameOver && remainingCells > 0 && (remainingCells <= 5 || remainingTypes === 1);

  const onAutoComplete = () => {
    if (!gameBoard || isGameOver) return;

    const targets: { r: number; c: number }[] = [];
    gameBoard.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell.status !== "fixed" && cell.status !== "correct") {
          targets.push({ r, c });
        }
      });
    });

    targets.forEach((pos, index) => {
      setTimeout(() => {
        setGameBoard((prev) => {
          if (!prev) return prev;
          const newBoard = prev.map((row) => [...row]);
          const targetCell = newBoard[pos.r][pos.c];
          newBoard[pos.r][pos.c] = {
            ...targetCell,
            inputValue: targetCell.answer,
            status: "correct",
          };
          return newBoard;
        });

        if (index === targets.length - 1) {
          setTimeout(() => {
            alert("게임이 끝났습니다!");
            finishGame(true);
          }, 100);
        }
      }, index * 500);
    });
  };

  const buttons: JSX.Element[] = [];
  for (const i of range(1, 9)) {
    const count = numberCounts[i];
    const isCompleted = count >= 9;
    
    // If showRemaining is false, we might still disable it, or not?
    // User requested "disable if count 9" earlier. "showRemaining" usually adds info.
    // I will keep disable logic as base feature, and add "count" display if setting on.
    
    buttons.push(
      <button
        key={i}
        onClick={() => clickBtn(i)}
        disabled={isCompleted}
        className={`relative flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold shadow-sm transition-all
          ${
            isCompleted
              ? "bg-slate-50 text-slate-300 cursor-not-allowed opacity-50"
              : "bg-slate-100 text-slate-700 hover:bg-[rgba(var(--primary),0.2)] hover:text-[rgb(var(--primary))] active:scale-95"
          }`}
      >
        {i}
        {settings.showRemaining && !isCompleted && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[10px] text-slate-500">
            {9 - count}
          </span>
        )}
      </button>,
    );
  }

  const clickCell = (rowIndex: number, colIndex: number) => {
    if (!gameBoard) return;
    if (settings.useLive && life < 0) return;
    setClicked(gameBoard[rowIndex][colIndex]);
  };

  function clickBtn(num: number) {
    if (!gameBoard || isGameOver) return;
    if (!clicked) return;
    
    if (clicked.status == "fixed" || clicked.status == "correct") return;

    let b: Cell[][] | null = null;
    setGameBoard((prev) => {
      if (!prev) return prev;
      const newBoard = prev.map((row) => [...row]);
      newBoard[clicked.row][clicked.col].inputValue = num;
      if (newBoard[clicked.row][clicked.col].answer === num) {
        newBoard[clicked.row][clicked.col].status = "correct";
      } else {
        newBoard[clicked.row][clicked.col].status = "wrong";
        if (settings.useLive) {
          setLife(life - 1);
        }
      }
      b = newBoard;
      return newBoard;
    });

    if (b && checkGameEnd(b)) {
      setTimeout(() => {
        alert("게임이 끝났습니다!");
        finishGame(true);
      }, 100);
    }
  }
  
  const useHint = () => {
    if (!clicked || !gameBoard || isGameOver) return;
    if (clicked.status === "fixed" || clicked.status === "correct") return;
    
    setHintCount(prev => prev + 1);
    
    let b: Cell[][] | null = null;
    setGameBoard((prev) => {
      if (!prev) return prev;
      const newBoard = prev.map((row) => [...row]);
      newBoard[clicked.row][clicked.col].inputValue = clicked.answer;
      newBoard[clicked.row][clicked.col].status = "correct";
      b = newBoard;
      return newBoard;
    });

    if (b && checkGameEnd(b)) {
      setTimeout(() => {
        alert("게임이 끝났습니다!");
        finishGame(true);
      }, 100);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.gameInfo}>
        <div className="flex gap-2">
          <button
            onClick={getNewGame}
            className="rounded-lg bg-[rgb(var(--primary))] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            새 게임
          </button>
          {settings.enableHints && (
            <button
              onClick={useHint}
              disabled={!clicked || clicked.status === "fixed" || clicked.status === "correct"}
              className="rounded-lg border border-[rgb(var(--primary))] text-[rgb(var(--primary))] px-3 py-2 text-sm font-medium hover:bg-[rgba(var(--primary),0.1)] disabled:opacity-50 disabled:hover:bg-transparent"
            >
              힌트
            </button>
          )}
          {canAutoComplete && (
            <button
              onClick={onAutoComplete}
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 transition-colors shadow-sm animate-pulse"
            >
              자동 완성
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-600">난이도:</span>
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
            className="rounded-lg border border-slate-200 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
          >
            <option value="easy">쉬움</option>
            <option value="medium">보통</option>
            <option value="hard">어려움</option>
          </select>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-slate-500 font-mono text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
            </svg>
            <span>{formatTime(elapsedTime)}</span>
          </div>

          {settings.useLive && (
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`w-6 h-6 transition-colors ${
                    i < life ? "text-red-500" : "text-slate-200"
                  }`}
                >
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 2.322 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              ))}
            </div>
          )}
        </div>
      </div>
      {gameBoard && (
        <div className={style.gameContainer}>
          <div className={style.board}>
            {gameBoard.map((row, rowIndex) => (
              <div key={rowIndex} className={style.boardRow}>
                {row.map((cell, colIndex) => (
                  <div
                    key={colIndex}
                    onClick={() => clickCell(rowIndex, colIndex)}
                    className={`${style.boardCell}
              ${style[cell.status]}
              ${
                clicked && checkHighlight(cell, clicked)
                  ? style.highlighted
                  : ""
              }
              ${clicked && clicked === cell ? style.clicked : ""}
              `}
                  >
                    {cell.status == "fixed" ? cell.answer : cell.inputValue}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className={style.btn}>{buttons}</div>
        </div>
      )}
    </div>
  );
}

