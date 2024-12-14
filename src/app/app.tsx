"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import sdk, { FrameContext } from '@farcaster/frame-sdk';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

export default function App() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentNftIndex, setCurrentNftIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Initialize Frame SDK
  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
      sdk.actions.ready({});
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  // Reset errors when NFT changes
  useEffect(() => {
    setImageError(false);
    setAudioError(false);
  }, [currentNftIndex]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery) return;
    setIsLoading(true);
    try {
      const { searchAudioNFTs } = await import('@/lib/nftSearch');
      const results = await searchAudioNFTs(searchQuery);
      if (results.length === 0) {
        alert('No audio NFTs found for this contract. Make sure to enter a valid contract address that contains audio NFTs.');
      }
      setSearchResults(results);
      setCurrentNftIndex(0);
    } catch (error) {
      console.error('Error searching NFTs:', error);
      alert('Error searching NFTs. Please make sure you entered a valid contract address.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  const handleNextNft = useCallback(() => {
    if (searchResults.length === 0) return;
    setCurrentNftIndex((prev) => (prev + 1) % searchResults.length);
  }, [searchResults.length]);

  const handlePreviousNft = useCallback(() => {
    if (searchResults.length === 0) return;
    setCurrentNftIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
  }, [searchResults.length]);

  const currentNft = searchResults[currentNftIndex];

  const handleAudioError = () => {
    setAudioError(true);
    console.error('Error loading audio:', currentNft?.audioUrl);
  };

  if (!isSDKLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-4 text-lg">Loading Frame SDK...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      {/* Search Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Search Audio NFTs</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter NFT contract address..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </div>

      {currentNft ? (
        <>
          {/* NFT Image */}
          <div className="relative w-full max-w-md mx-auto rounded-lg overflow-hidden bg-gray-100">
            <div className="aspect-square relative">
              {currentNft.imageUrl && !imageError ? (
                <Image
                  src={currentNft.imageUrl}
                  alt={currentNft.name || 'NFT Image'}
                  fill
                  className="object-contain"
                  onError={() => setImageError(true)}
                  priority
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </div>
          </div>

          {/* Media Player */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center">{currentNft.name || 'Untitled NFT'}</h2>
            {currentNft.audioUrl && !audioError ? (
              <div className="w-full max-w-md mx-auto">
                <audio
                  ref={audioRef}
                  className="w-full"
                  controls
                  src={currentNft.audioUrl}
                  onError={handleAudioError}
                />
              </div>
            ) : (
              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <p className="text-gray-500">
                  {audioError ? 'Error loading audio' : 'No audio available'}
                </p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button onClick={handlePreviousNft} variant="outline">
              Previous
            </Button>
            <Button onClick={handleNextNft} variant="outline">
              Next
            </Button>
          </div>

          {/* NFT Info */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <h3 className="font-semibold">NFT Details</h3>
            <p className="break-all"><strong>Contract:</strong> {currentNft.contractAddress}</p>
            <p><strong>Token ID:</strong> {currentNft.tokenId}</p>
            {currentNft.description && (
              <p className="text-sm text-gray-600 break-words">{currentNft.description}</p>
            )}
          </div>
        </>
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p>Enter an NFT contract address to search for audio NFTs</p>
          <p className="text-sm text-gray-500 mt-2">Example: 0x2B5426A5B98a3E366230ebA9f95a24f09Ae4a584 (Sound.xyz)</p>
        </div>
      )}
    </div>
  );
}
