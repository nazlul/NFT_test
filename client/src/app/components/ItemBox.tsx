import React, { useContext, useEffect, useState } from 'react';
import { TransactionContext } from '../../context/TransactionContext';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../../utils/constants';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface ItemBoxProps {
  tokenId: number;
  imageUrl: string;
  title: string;
  price: string;
  likes: number;
  seller: string;
  owner: string;
  chain: string;
}

const ItemBox: React.FC<ItemBoxProps> = ({
  tokenId,
  imageUrl,
  title,
  price,
  likes,
  seller,
  owner,
  chain,
}) => {
  const context = useContext(TransactionContext);
  const [selectedChain, setSelectedChain] = useState<'basesepolia' | 'sepolia'>(
    'basesepolia'
  );
  const { currentAccount, connectWallet } = context || {};
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      const initProvider = async () => {
        const prov = new ethers.BrowserProvider(window.ethereum);
        setProvider(prov);
        const signer = await prov.getSigner();
        setSigner(signer);
        const contractInstance = new ethers.Contract(
          contractAddress[selectedChain],
          contractABI,
          signer
        );
        setContract(contractInstance);
      };
      initProvider();
    }
  }, [selectedChain]);

  const handleBuy = async () => {
    if (!currentAccount) {
      alert('Please connect your wallet first.');
      if (connectWallet) await connectWallet();
    } else if (contract) {
      try {
        const priceInWei = ethers.parseEther(price);
        const tx = await contract.createMarketSale(tokenId, { value: priceInWei });
        await tx.wait();
        alert('NFT purchased successfully!');
      } catch (error) {
        alert('Transaction failed, please try again.');
      }
    }
  };

  const handleLike = async () => {
    if (!currentAccount) {
      alert('Please connect your wallet first.');
      if (connectWallet) await connectWallet();
    } else if (contract) {
      try {
        const tx = await contract.likeNFT(tokenId);
        await tx.wait();
        alert('NFT liked successfully!');
      } catch (error) {
        alert('Failed to like NFT, please try again.');
      }
    }
  };

  const isOwnedByConnectedWallet = owner.toLowerCase() === currentAccount?.toLowerCase();

  if (chain !== selectedChain) return null;

  return (
    <div className="border rounded-lg shadow-lg p-4 bg-white w-80">
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover rounded-md" />
      <div className="mt-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-gray-500">Price: {price} ETH</p>
        <p className="text-sm text-gray-500">Likes: {likes}</p>
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={handleLike}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500"
          >
            🤍
          </button>
          {!isOwnedByConnectedWallet && (
            <button
              onClick={handleBuy}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Buy
            </button>
          )}
        </div>
        {isOwnedByConnectedWallet && (
          <p className="text-xs text-green-500 mt-2">Owned by you</p>
        )}
      </div>
    </div>
  );
};

export default ItemBox;
