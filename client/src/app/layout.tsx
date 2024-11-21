import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter } from "next/font/google";
import { cookieToInitialState } from "wagmi";
import { config } from "../wagmi";
import Web3ModalProvider from "@/context";
import { TransactionProvider } from "@/context/TransactionContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Scope Marketplace",
  description: "Scope NFT Marketplace"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookie = await headers();
  const initialState = cookieToInitialState(config, cookie.get("cookie"));

  return (
    <html lang="en">
      <body>
        <Web3ModalProvider initialState={initialState}>
          <TransactionProvider>{children}</TransactionProvider>
        </Web3ModalProvider>
      </body>
    </html>
  );
}
