import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const contract = searchParams.get('contract');
  const tokenId = searchParams.get('tokenId');

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
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        <div style={{ marginBottom: 20, color: '#1d4ed8' }}>
          NFT Media Player
        </div>
        <div style={{ fontSize: 24, color: '#374151' }}>
          Contract: {contract?.slice(0, 6)}...{contract?.slice(-4)}
        </div>
        <div style={{ fontSize: 24, color: '#374151' }}>
          Token ID: {tokenId}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
} 