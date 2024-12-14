import { NextRequest } from 'next/server';
import { searchAudioNFTs } from '@/lib/nftSearch';

// Store NFT state in memory (in production, use a proper database)
const STATE: {
  [key: string]: {
    results: any[];
    currentIndex: number;
  };
} = {};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { untrustedData, trustedData } = body;
    const { buttonIndex, inputText } = untrustedData;
    const stateKey = trustedData?.stateData || 'default';

    let state = STATE[stateKey] || { results: [], currentIndex: 0 };
    STATE[stateKey] = state;

    // Handle search input
    if (inputText) {
      const results = await searchAudioNFTs(inputText);
      state.results = results;
      state.currentIndex = 0;
    }

    // Handle navigation buttons
    if (buttonIndex === 1) { // Previous
      state.currentIndex = (state.currentIndex - 1 + state.results.length) % state.results.length;
    } else if (buttonIndex === 2) { // Next
      state.currentIndex = (state.currentIndex + 1) % state.results.length;
    }

    const currentNft = state.results[state.currentIndex];

    // If no results yet, show search frame
    if (!currentNft) {
      return new Response(
        JSON.stringify({
          frames: [{
            version: 'vNext',
            image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/og/search`,
            buttons: [
              {
                label: 'Search NFTs',
                action: 'post_redirect'
              }
            ],
            input: {
              text: 'Enter NFT contract address',
            },
          }],
          state: stateKey,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Show NFT player frame
    return new Response(
      JSON.stringify({
        frames: [{
          version: 'vNext',
          image: currentNft.imageUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/api/og/no-image`,
          buttons: [
            {
              label: '⬅️ Previous',
              action: 'post'
            },
            {
              label: '➡️ Next',
              action: 'post'
            },
            {
              label: '🎵 Play Audio',
              action: 'link',
              target: currentNft.audioUrl
            }
          ],
          input: {
            text: 'Search another contract',
          },
        }],
        state: stateKey,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in frame route:', error);
    return new Response(
      JSON.stringify({
        frames: [{
          version: 'vNext',
          image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/og/error`,
          buttons: [
            {
              label: 'Try Again',
              action: 'post_redirect'
            }
          ],
        }],
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 