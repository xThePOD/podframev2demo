const apiKey = process.env.NEYNAR_API_KEY || "";

interface SignerEvent {
  signerEventBody: {
    key: string;
  };
}

interface NeynarResponse {
  events: SignerEvent[];
}

export async function isSignerValid({
  fid,
  signerPublicKey,
}: {
  fid: number;
  signerPublicKey: string;
}): Promise<boolean> {
  const url = new URL("https://hub-api.neynar.com/v1/onChainSignersByFid");
  url.searchParams.append("fid", fid.toString());

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-api-key": apiKey,
    },
  });

  if (response.status !== 200) {
    throw new Error(await response.text());
  }

  const responseJson = await response.json() as NeynarResponse;
  const signerPublicKeyLC = signerPublicKey.toLowerCase();

  const signerExists = responseJson.events.find(
    (event) => event.signerEventBody.key.toLowerCase() === signerPublicKeyLC
  );

  return !!signerExists;
}
