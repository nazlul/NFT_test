"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { NavBar } from "./components";
import ItemBox from "./components/ItemBox";

export default function Home() {
  const { isConnected } = useAccount();
  const [currentPage, setCurrentPage] = useState("marketplace");

  const items = [
    {
      tokenId: 1,
      imageUrl: "/images/item1.png",
      title: "y00ts #1",
      price: "0.1",
      likes: 12,
      seller: "0x1234...abcd",
      owner: "0x5678...efgh",
      chain: "sepolia",
    },
    {
      tokenId: 2,
      imageUrl: "/images/item2.png",
      title: "y00ts #2",
      price: "0.2",
      likes: 20,
      seller: "0x1234...abcd",
      owner: "0x5678...efgh",
      chain: "sepolia",
    },
    {
      tokenId: 3,
      imageUrl: "/images/item3.png",
      title: "y00ts #2",
      price: "0.2",
      likes: 20,
      seller: "0x1234...abcd",
      owner: "0x5678...efgh",
      chain: "basesepolia",
    },
  ];

  const renderContent = () => {
    switch (currentPage) {
      case "marketplace":
        return (
          <div className="text-center text-[#034f84]">
            <h1 className="text-4xl font-bold mb-4 p-4">Marketplace</h1>
            <p className="text-lg">Buy and Sell your favourite NFTs</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {items.map((item) => (
                <ItemBox key={item.tokenId} {...item} />
              ))}
            </div>
          </div>
        );
      case "launchpad":
        return (
          <div className="text-center text-[#034f84]">
            <h1 className="text-4xl font-bold mb-4 p-4">Launchpad</h1>
            <p className="text-lg">Participate in new launches</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen px-8 pb-12 flex-1 flex flex-col items-center bg-[#b7d7e8]">
      <header className="w-full flex justify-between items-center bg-[#b7d7e8] fixed top-0 left-0 z-10">
        <div className="flex items-center">
          <NavBar setCurrentPage={setCurrentPage} />
        </div>
        <div className="flex items-center">
          <w3m-button />
        </div>
      </header>
      <div className="mt-24 w-full">{renderContent()}</div>
    </main>
  );
}
