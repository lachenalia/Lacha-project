import Header from "@/components/Header";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Header />
      <h1> Hello My name is pichu.</h1>
      <Link href="/sudoku">Go Sudoku</Link>
    </main>
  );
}
