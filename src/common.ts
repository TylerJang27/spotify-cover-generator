import { SpotifyApi } from "@spotify/web-api-ts-sdk";

export const getSdk = () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set");
  }

  return SpotifyApi.withClientCredentials(clientId, clientSecret);
};
