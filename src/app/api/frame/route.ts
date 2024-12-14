import { NextRequest } from "next/server";
import { searchAudioNFTs } from "@/lib/nftSearch";

const appUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req: NextRequest) {
  const data = await req.json();
  const buttonIndex = data.untrustedData.buttonIndex;
  const inputText = data.untrustedData.inputText || '';
  
  // Get current state
  const stateData = data.state ? JSON.parse(data.state) : { 
    currentNftIndex: 0,
    searchResults: [],
    lastSearch: ''
  };

  let { currentNftIndex, searchResults, lastSearch } = stateData;

  // If there's new search input, perform search
  if (inputText && inputText !== lastSearch) {
    searchResults = await searchAudioNFTs(inputText);
    currentNftIndex = 0;
    lastSearch = inputText;
  }

  // Handle button actions
  switch (buttonIndex) {
    case 1: // Play Media
      break;
    case 2: // Next NFT
      if (searchResults.length > 0) {
        currentNftIndex = (currentNftIndex + 1) % searchResults.length;
      }
      break;
    case 3: // Previous NFT
      if (searchResults.length > 0) {
        currentNftIndex = (currentNftIndex - 1 + searchResults.length) % searchResults.length;
      }
      break;
  }

  // Get current NFT if available
  const currentNft = searchResults[currentNftIndex];

  // Default image if no NFT is selected
  const defaultImage = `${appUrl}/api/og`;
  
  // Prepare response
  const response = {
    version: "vNext",
    image: currentNft 
      ? `${appUrl}/api/og?contract=${currentNft.contractAddress}&tokenId=${currentNft.tokenId}`
      : defaultImage,
    buttons: [
      {
        label: "Play Media",
      },
      {
        label: "Next NFT",
      },
      {
        label: "Previous NFT",
      },
    ],
    input: {
      text: "Search for audio NFTs...",
    },
    state: JSON.stringify({ 
      currentNftIndex,
      searchResults,
      lastSearch
    }),
  };

  return new Response(
    JSON.stringify(response),
    {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    }
  );
} 