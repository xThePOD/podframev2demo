import { http, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';

// Use our own API proxy to avoid CORS issues
const PROXY_RPC = '/api/eth';

// Configure the mainnet with our proxy
const configuredMainnet = {
  ...mainnet,
  rpcUrls: {
    ...mainnet.rpcUrls,
    default: {
      http: [PROXY_RPC],
    },
    public: {
      http: [PROXY_RPC],
    },
  },
};

export const config = createConfig({
  chains: [configuredMainnet],
  transports: {
    [configuredMainnet.id]: http(),
  },
}); 