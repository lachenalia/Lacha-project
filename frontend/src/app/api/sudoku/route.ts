import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch("http://localhost:3000/sudoku", {
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    return new NextResponse(text, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data, { status: 200 });
}
