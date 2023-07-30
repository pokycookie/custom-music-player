import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Player from "./components/layout/player";
import Sidebar from "./components/layout/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Custom Youtube Music",
  description: "Custom music web application with youtube iframe api",
};

interface IProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: IProps) {
  return (
    <html lang="en">
      <body className={inter.className + " " + "flex h-screen"}>
        <section className="flex grow">
          <Sidebar />
          <main className="grow bg-zinc-700">{children}</main>
        </section>
        <Player />
      </body>
    </html>
  );
}
