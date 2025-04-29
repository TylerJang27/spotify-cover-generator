import { Playlist, PlaylistedTrack } from "@spotify/web-api-ts-sdk";
import { getSdk } from "./common";
import logger from "./logger";

const MAX_PLAYLIST_PAGES = 5;
const PLAYLIST_PAGE_SIZE = 50;
const MAX_PLAYLIST_TRACK_PAGES = 10;
const PLAYLIST_TRACK_PAGE_SIZE = 50;

export const findPlaylist = async (userId: string, playlistName: string) => {
  const sdk = getSdk();
  let total = 0;
  const regex = new RegExp(playlistName);

  for (let i = 0; i < MAX_PLAYLIST_PAGES; i++) {
    // Playlists are sorted by recency of creation
    const playlistsResult = await sdk.playlists.getUsersPlaylists(
      userId,
      PLAYLIST_PAGE_SIZE,
      i * PLAYLIST_PAGE_SIZE,
    );
    total = playlistsResult.total;
    const playlist = playlistsResult.items.filter(
      ({ name }) => name.includes(playlistName) || regex.test(name),
    );
    if (playlist.length) {
      return playlist[0];
    }
  }
  throw new Error(
    `Playlist not found matching \`${playlistName}\`. Searched ${Math.min(total, MAX_PLAYLIST_PAGES * PLAYLIST_PAGE_SIZE)} of ${total} playlists`,
  );
};

export const listTracks = async (
  playlist: Playlist,
): Promise<PlaylistedTrack[]> => {
  const sdk = getSdk();
  const tracks = [];
  let total = 0;

  for (let i = 0; i < MAX_PLAYLIST_TRACK_PAGES; i++) {
    // "items(added_by.id,track(name,href,album(name,href)))"
    const pagedTracks = await sdk.playlists.getPlaylistItems(
      playlist.id,
      undefined,
      "items(track(album(name), artists, id, name, popularity, uri))",
      PLAYLIST_TRACK_PAGE_SIZE,
      i * PLAYLIST_TRACK_PAGE_SIZE,
    );
    tracks.push(...pagedTracks.items);
    total = pagedTracks.total;
    if (total < MAX_PLAYLIST_TRACK_PAGES * (i + 1)) {
      break;
    }
  }
  if (total > tracks.length) {
    logger.warn(`Truncated playlist size from ${total} to ${tracks.length}`);
  }
  return tracks;
};
