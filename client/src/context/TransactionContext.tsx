"use client"

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../utils/constants';

interface TransactionContextType {
  connectWallet: () => void;
  currentAccount: string;
  formData: { tokenURI: string; price: string };
  setFormData: React.Dispatch<React.SetStateAction<{ tokenURI: string; price: string }>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
  mintNFT: () => void;
  createMarketSale: (tokenId: number) => void;
  transactions: any[]; 
  isLoading: boolean;
  getEthereumContract: () => Promise<ethers.Contract>; 
}

export const TransactionContext = React.createContext<TransactionContextType | null>(null);

const ethereum = (window as any).ethereum;

interface TransactionProviderProps {
  children: React.ReactNode;
}

const getEthereumContract = async () => {
  if (!ethereum) throw new Error('Ethereum is not available');
  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  const network = await provider.getNetwork();
  let selectedAddress: string;

  switch (network.chainId) {
    case BigInt(11155111): 
      selectedAddress = contractAddress.sepolia;
      break;
    case BigInt(84531): 
      selectedAddress = contractAddress.basesepolia;
      break;
    default:
      throw new Error('Unsupported network');
  }

  return new ethers.Contract(selectedAddress, contractABI, signer);
};

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [formData, setFormData] = useState({ tokenURI: '', price: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getAllMarketItems = async () => {
    try {
      if (!ethereum) return alert('Please install MetaMask');

      const contract = await getEthereumContract();
      const availableItems = await contract.fetchMarketItems();

      const structuredItems = availableItems.map((item: any) => ({
        tokenId: item.tokenId.toNumber(),
        seller: item.seller,
        price: ethers.formatEther(item.price),
        sold: item.sold,
      }));

      setTransactions(structuredItems);
    } catch (error) {
      console.log('Error fetching market items:', error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert('Please install MetaMask');

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        getAllMarketItems();
      } else {
        console.log('No accounts found');
      }
    } catch (error) {
      console.log('Error checking wallet connection:', error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask");
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        alert("Wallet connected!");
      }
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      if (error.code === 4001) {
        alert("User rejected the request.");
      } else {
        alert("Failed to connect wallet. Please try again.");
      }
    }
  };

  const mintNFT = async () => {
    try {
      if (!ethereum) return alert('Please install MetaMask');

      const { tokenURI, price } = formData;
      const contract = await getEthereumContract();
      const parsedPrice = ethers.parseEther(price);

      setIsLoading(true);
      console.log('Transaction in progress...');

      const transaction = await contract.mintToken(tokenURI, parsedPrice, {
        value: ethers.parseEther('0.0025'), 
      });
      await transaction.wait();
      console.log('NFT minted successfully!');
    } catch (error) {
      console.log('Error minting NFT:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createMarketSale = async (tokenId: number) => {
    try {
      if (!ethereum) return alert('Please install MetaMask');

      const contract = await getEthereumContract();
      const price = await contract.idToMarketItem(tokenId);

      setIsLoading(true);
      console.log('Transaction in progress...');

      const transaction = await contract.createMarketSale(tokenId, {
        value: price.price,
      });

      await transaction.wait();
      console.log('NFT bought successfully!');
    } catch (error) {
      console.log('Error creating market sale:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await checkIfWalletIsConnected();
      } catch (error) {
        console.error('Error initializing wallet:', error);
      }
    };

    init();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        setFormData,
        handleChange,
        mintNFT,
        createMarketSale,
        transactions,
        isLoading,
        getEthereumContract, 
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
