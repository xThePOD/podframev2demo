import { Network, Alchemy } from 'alchemy-sdk';

const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

interface NFTResult {
  contractAddress: string;
  tokenId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  audioUrl?: string;
}

async function resolveIpfsUrl(url: string): Promise<string> {
  if (!url) return '';
  
  // Convert IPFS URLs to HTTPS
  if (url.startsWith('ipfs://')) {
    return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }
  
  return url;
}

export async function searchAudioNFTs(query: string): Promise<NFTResult[]> {
  try {
    // Search for NFTs in the contract
    const response = await alchemy.nft.getNftsForContract(
      query,
      {
        pageSize: 100,
        omitMetadata: false,
      }
    );

    // Transform the results into our expected format
    const nfts = await Promise.all(
      response.nfts.map(async (nft): Promise<NFTResult | null> => {
        try {
          // Get the full NFT metadata
          const metadata = await alchemy.nft.getNftMetadata(
            nft.contract.address,
            nft.tokenId
          );

          // Try to get the raw metadata
          let tokenData = metadata.raw?.metadata || {};
          
          // If we have a token URI, try to fetch it directly
          if (metadata.tokenUri?.gateway) {
            try {
              const response = await fetch(metadata.tokenUri.gateway);
              const data = await response.json();
              tokenData = { ...tokenData, ...data };
            } catch (error) {
              console.error('Error fetching token URI data:', error);
            }
          }

          // Look for audio in various metadata fields
          const possibleAudioUrls = [
            tokenData.animation_url,
            tokenData.audio,
            tokenData.audio_url,
            metadata.media?.find((m: any) => 
              m.format?.toLowerCase().includes('audio') ||
              m.raw?.toLowerCase().includes('.mp3') ||
              m.gateway?.toLowerCase().includes('.mp3')
            )?.gateway,
            // Add more potential audio URL fields here
          ].filter(Boolean);

          // If we don't find any audio URLs, skip this NFT
          if (possibleAudioUrls.length === 0) {
            return null;
          }

          // Get the first valid audio URL
          const audioUrl = await resolveIpfsUrl(possibleAudioUrls[0]);

          // Look for image in various metadata fields
          const possibleImageUrls = [
            tokenData.image,
            tokenData.image_url,
            metadata.media?.[0]?.gateway,
            // Add more potential image URL fields here
          ].filter(Boolean);

          const imageUrl = await resolveIpfsUrl(possibleImageUrls[0] || '');

          return {
            contractAddress: nft.contract.address,
            tokenId: nft.tokenId.toString(),
            name: tokenData.name || metadata.title || 'Untitled NFT',
            description: tokenData.description || metadata.description,
            imageUrl,
            audioUrl,
          };
        } catch (error) {
          console.error('Error processing NFT:', error);
          return null;
        }
      })
    );

    // Filter out null results and NFTs without audio
    return nfts.filter((nft): nft is NFTResult => 
      nft !== null && !!nft.audioUrl
    );
  } catch (error) {
    console.error('Error searching NFTs:', error);
    return [];
  }
} 