import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../styles/globals.css";
import Header from "@/components/essential/Header";

export const metadata: Metadata = {
  title: "Lacha",
  description: "Lacha Project",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="light">
      <body className={poppins.className}>
        <Header />
        <div className="body-container">{children}</div>
        <div className="footer"></div>
      </body>
    </html>
  );
}
