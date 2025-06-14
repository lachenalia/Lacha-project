"use client";

import { JSX, useEffect, useMemo, useState } from "react";
import style from "./SudokuBoard.module.css";
import { range } from "@/lib/utils";

type Props = {};

type CellStatus = "fixed" | "empty" | "correct" | "wrong";

type Cell = {
  row: number;
  col: number;
  answer: number;
  inputValue?: number;
  status: CellStatus;
};

function setNewBoard(board: number[][]) {
  const tempBoard: Cell[][] = [];

  for (const i of range(0, 9)) {
    const row: Cell[] = [];
    for (const j of range(0, 9)) {
      if (board[i] && board[i][j]) {
        row.push({
          row: i,
          col: j,
          answer: board[i][j],
          status: Math.random() > 0.5 ? "fixed" : "empty",
        });
      }
    }
    tempBoard.push(row);
  }

  return tempBoard;
}

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
  const [board, setBoard] = useState<number[][]>([]);

  useEffect(() => {
    setGameBoard(setNewBoard(board));
    setLife(3);
  }, [board]);

  useEffect(() => {
    if (life < 0) {
      alert("Game Over!");
    }
  }, [life]);

  const buttons: JSX.Element[] = [];
  for (const i of range(1, 9)) {
    buttons.push(
      <div key={i} onClick={() => clickBtn(i)}>
        {i}
      </div>
    );
  }

  const clickCell = (rowIndex: number, colIndex: number) => {
    if (!gameBoard || life < 0) return;
    setClicked(gameBoard[rowIndex][colIndex]);
  };

  function clickBtn(num: number) {
    if (!gameBoard) return;
    if (!clicked) return;

    if (clicked.status == "fixed" || clicked.status == "correct") return;

    setGameBoard((prev) => {
      if (!prev) return prev;
      const newBoard = prev.map((row) => [...row]);
      newBoard[clicked.row][clicked.col].inputValue = num;
      if (newBoard[clicked.row][clicked.col].answer === num) {
        newBoard[clicked.row][clicked.col].status = "correct";
      } else {
        newBoard[clicked.row][clicked.col].status = "wrong";
        setLife(life - 1);
      }
      return newBoard;
    });

    if (checkGameEnd(gameBoard)) alert("게임이 끝났습니다!");
  }

  const handleClick = async () => {
    try {
      const res = await fetch("http://localhost:3000/sudoku");
      if (!res.ok) throw new Error("API Call Fail");
      const resData = await res.json();
      setBoard(resData);
    } catch (e: any) {
    } finally {
    }
  };

  return (
    <div className={style.container}>
      <div className={style.gameInfo}>
        <button onClick={handleClick}>Get New</button>
        <p>난이도: 쉬움</p>
        <div className="flex">
          {life > 0 && <img src="/images/life.png" width={50} />}
          {life > 1 && <img src="/images/life.png" width={50} />}
          {life > 2 && <img src="/images/life.png" width={50} />}
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
