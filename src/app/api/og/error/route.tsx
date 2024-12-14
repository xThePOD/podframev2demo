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
          backgroundColor: '#fee2e2',
          padding: '40px',
        }}
      >
        <div
          style={{
            fontSize: 60,
            marginBottom: '20px',
          }}
        >
          ⚠️
        </div>
        <p
          style={{
            fontSize: 40,
            textAlign: 'center',
            color: '#991b1b',
            maxWidth: '80%',
          }}
        >
          Something went wrong. Please try again.
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
} 