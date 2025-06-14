import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1> Hello My name is pichu.</h1>
      <Link href="/sudoku">Go Sudoku</Link>
    </main>
  );
}
