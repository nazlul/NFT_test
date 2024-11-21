import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { cookieStorage, createStorage } from 'wagmi';
import { baseSepolia, sepolia } from 'wagmi/chains';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error('Project ID is not defined');

const metadata = {
  name: 'NFT Marketplace',
  description: 'NFT Marketplace',
  url: '',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const chains = [baseSepolia, sepolia] as const;
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  auth: {
    showWallets: true,
    walletFeatures: true,
    socials:[],
    email:false,
  },
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
});