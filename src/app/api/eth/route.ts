import { NextResponse } from 'next/server';

// Use multiple RPC endpoints for redundancy
const RPC_URLS = [
  'https://eth-mainnet.g.alchemy.com/v2/demo',
  'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  'https://rpc.ankr.com/eth',
];

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: Request) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const body = await request.json();
    console.log('RPC Request:', body);

    // Try each RPC endpoint until one works
    for (const rpcUrl of RPC_URLS) {
      try {
        const response = await fetch(rpcUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          console.log(`RPC ${rpcUrl} failed with status:`, response.status);
          continue;
        }

        const data = await response.json();
        console.log('RPC Response:', data);
        
        return NextResponse.json(data, { headers });
      } catch (error) {
        console.error(`Error with ${rpcUrl}:`, error);
        continue;
      }
    }

    throw new Error('All RPC endpoints failed');
  } catch (error) {
    console.error('Final RPC Error:', error);
    return NextResponse.json(
      { error: 'RPC request failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 502, headers }
    );
  }
} 