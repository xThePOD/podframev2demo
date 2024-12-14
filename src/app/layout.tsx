import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: 'Audio NFT Player',
    template: '%s | Audio NFT Player'
  },
  description: 'Search and play audio NFTs in Farcaster',
};

function RootLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>{children}</Providers>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RootLayoutInner>{children}</RootLayoutInner>
      </body>
    </html>
  );
}
