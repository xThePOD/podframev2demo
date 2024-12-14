import { Metadata } from "next";
import App from "./app";

const appUrl = process.env.NEXT_PUBLIC_BASE_URL;

const frame = {
  version: "next",
  imageUrl: `${appUrl}/api/og`,
  button: {
    title: "Launch Audio NFT Player",
    action: {
      type: "launch_frame",
      name: "Audio NFT Player",
      url: `${appUrl}/frames/audio`,
      splashImageUrl: `${appUrl}/api/og`,
      splashBackgroundColor: "#000000",
    },
  },
};

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Audio NFT Player",
    openGraph: {
      title: "Audio NFT Player",
      description: "Search and play audio NFTs in Farcaster",
      images: [`${appUrl}/api/og`],
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Home() {
  return <App />;
}
