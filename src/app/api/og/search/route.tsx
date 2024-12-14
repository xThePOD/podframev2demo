import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #000',
            borderRadius: '20px',
            padding: '20px',
          }}
        >
          <h1
            style={{
              fontSize: 60,
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            🎵 Audio NFT Player
          </h1>
          <p
            style={{
              fontSize: 30,
              textAlign: 'center',
              color: '#666',
            }}
          >
            Enter a contract address to search for audio NFTs
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
} 