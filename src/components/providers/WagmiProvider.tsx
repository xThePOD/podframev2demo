'use client';

import { createConfig, http } from 'wagmi';
import { base, mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider as WagmiCore } from 'wagmi';

const queryClient = new QueryClient();

export const config = createConfig({
  chains: [mainnet, base],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
});

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiCore config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiCore>
  );
}
