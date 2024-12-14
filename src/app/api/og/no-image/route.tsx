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
          backgroundColor: '#f3f4f6',
          padding: '40px',
        }}
      >
        <div
          style={{
            fontSize: 60,
            marginBottom: '20px',
          }}
        >
          🎵
        </div>
        <p
          style={{
            fontSize: 40,
            textAlign: 'center',
            color: '#666',
          }}
        >
          No image available
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
} 