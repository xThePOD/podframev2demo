'use client';

import { useState } from 'react';
import MediaPlayer from './MediaPlayer';

// Default NFT to display initially
const DEFAULT_NFT = {
  contractAddress: '0x2B5426A5B98a3E366230ebA9f95a24f09Ae4a584',
  tokenId: '2'
};

export default function FramePlayer() {
  const [contractAddress, setContractAddress] = useState<string>(DEFAULT_NFT.contractAddress);
  const [tokenId, setTokenId] = useState<string>(DEFAULT_NFT.tokenId);
  const [isSearchMode, setIsSearchMode] = useState(false);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">NFT Media Player Frame</h1>
          <button
            onClick={() => setIsSearchMode(!isSearchMode)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {isSearchMode ? 'Hide Search' : 'Search NFT'}
          </button>
        </div>

        {isSearchMode && (
          <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Contract Address</label>
              <input
                type="text"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                placeholder="0x..."
                className="w-full p-2 border rounded-lg"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Token ID</label>
              <input
                type="text"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                placeholder="1"
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>
        )}

        <MediaPlayer 
          contractAddress={contractAddress as `0x${string}`}
          tokenId={tokenId}
        />

        {/* Frame Instructions */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">How to Use</h2>
          <div className="space-y-2">
            <p>1. Use the Search NFT button to look up specific NFTs</p>
            <p>2. Or use the Frame buttons in Farcaster:</p>
            <ul className="list-disc pl-6">
              <li>Play Media - Start/Stop playback</li>
              <li>Next NFT - View next curated NFT</li>
              <li>Previous NFT - View previous curated NFT</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
} 