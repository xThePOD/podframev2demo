import { Metadata } from 'next';

// Generate metadata for the frame
export const metadata: Metadata = {
  title: 'Audio NFT Player Frame',
  description: 'Search and play audio NFTs in Farcaster',
  openGraph: {
    title: 'Audio NFT Player Frame',
    description: 'Search and play audio NFTs in Farcaster',
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/api/og/search`],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${process.env.NEXT_PUBLIC_BASE_URL}/api/og/search`,
    'fc:frame:input:text': 'Enter NFT contract address',
    'fc:frame:button:1': 'Search NFTs',
    'fc:frame:post_url': `${process.env.NEXT_PUBLIC_BASE_URL}/api/frames/audio`,
  },
};

export default function AudioFramePage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Audio NFT Player Frame</h1>
      <p>This is a Farcaster Frame for playing audio NFTs.</p>
      <p className="text-sm text-gray-600 mt-2">
        View this page in Warpcast to interact with the frame.
      </p>
    </div>
  );
} 