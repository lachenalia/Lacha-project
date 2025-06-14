"use client";

import { useState } from "react";

export default function GetSudoku() {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:3000/sudoku");
      console.log(res);
      if (!res.ok) throw new Error("API Call Fail");
      const resData = await res.json();
      setData(resData);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleClick} disabled={loading}>
        {loading ? "불러오는 중입니다." : "Get Data"}
      </button>

      {error && <p style={{ color: "red" }}>에러: {error} </p>}
      {data && (
        <pre
          style={{
            backgroundColor: "#eee",
            padding: "10px",
            marginTop: "20px",
            whiteSpace: "pre-wrap",
          }}
        >
          {data}
        </pre>
      )}
    </div>
  );
}
