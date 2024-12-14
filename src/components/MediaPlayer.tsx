'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useContractRead } from 'wagmi';
import { erc721Abi } from 'viem';

// Dynamically import ReactPlayer to avoid SSR issues
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

interface MediaPlayerProps {
  contractAddress: `0x${string}`;
  tokenId: string;
}

interface TokenMetadata {
  name?: string;
  description?: string;
  image?: string;
  animation_url?: string;
  properties?: {
    [key: string]: any;
  };
}

export default function MediaPlayer({ contractAddress, tokenId }: MediaPlayerProps) {
  const [metadata, setMetadata] = useState<TokenMetadata | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read token URI from contract
  const { data: tokenUri } = useContractRead({
    address: contractAddress,
    abi: erc721Abi,
    functionName: 'tokenURI',
    args: [BigInt(tokenId)],
  });

  useEffect(() => {
    async function fetchMetadata() {
      if (!tokenUri) return;

      try {
        // Handle IPFS URLs
        const url = tokenUri.toString().replace('ipfs://', 'https://ipfs.io/ipfs/');
        const response = await fetch(url);
        const data = await response.json();
        setMetadata(data);

        // Set media URL
        const mediaUrl = data.animation_url || data.image;
        if (mediaUrl) {
          setMediaUrl(mediaUrl.replace('ipfs://', 'https://ipfs.io/ipfs/'));
        }
      } catch (err) {
        setError('Failed to fetch NFT metadata');
        console.error('Error fetching metadata:', err);
      }
    }

    fetchMetadata();
  }, [tokenUri]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleError = (error: Error) => {
    setError('Failed to load media');
    console.error('Media playback error:', error);
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-lg">
        {error}
      </div>
    );
  }

  if (!metadata) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg animate-pulse">
        Loading NFT metadata...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg overflow-hidden">
        {mediaUrl && (
          <ReactPlayer
            url={mediaUrl}
            width="100%"
            height="100%"
            controls={true}
            playing={isPlaying}
            style={{ maxWidth: '100%', margin: '0 auto' }}
            config={{
              file: {
                forceAudio: mediaUrl.toLowerCase().endsWith('.mp3'),
                attributes: {
                  controlsList: 'nodownload',
                  style: {
                    width: '100%',
                    height: '100%',
                    maxHeight: '500px',
                  },
                },
              },
            }}
            onError={handleError}
          />
        )}
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{metadata.name}</h2>
        {metadata.description && (
          <p className="text-gray-600">{metadata.description}</p>
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handlePlayPause}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
    </div>
  );
} 