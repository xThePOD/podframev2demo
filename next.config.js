/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'ipfs.io',
      'gateway.ipfscdn.io',
      'arweave.net',
      'cloudflare-ipfs.com',
      'ipfs.filebase.io',
      'ipfs.infura.io',
      'nft-cdn.alchemy.com',
      'res.cloudinary.com',
      'i.seadn.io',
      'openseauserdata.com',
      'metadata.ens.domains',
      'storage.googleapis.com',
      'sound.xyz',
      'f4.bcbits.com',
      'assets.sound.xyz',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src',
      '~': './src',
    };
    return config;
  },
};

module.exports = nextConfig;
