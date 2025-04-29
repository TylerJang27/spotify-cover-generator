import { Command } from "commander";
import "dotenv/config";
import { findPlaylist, listTracks } from "./playlist";
import logger from "./logger";
import { generateCoverImage } from "./ai";

const query = async (userId: string, playlistName: string) => {
  const playlist = await findPlaylist(userId, playlistName);
  const tracks = await listTracks(playlist);
  logger.info(
    `Retrieved ${tracks.length} tracks from playlist \`${playlist.name}\``,
  );

  const image = await generateCoverImage(playlist, tracks);

  logger.info("image result", image);
};

const main = () => {
  const program = new Command();

  program
    .name("spotify-cover-generator")
    .description("CLI to query Spotify and generate playlist images")
    .version("0.1.0");
  program
    .command("query")
    .argument(
      "<userId>",
      "userId to search for playlists, usually alphanumeric",
    )
    // TODO(Tyler): Make playlist names optional and use a picker.
    .argument("<playlistRegex>", "The name/regex of the playlist to evaluate")
    .action(query);

  program.parse(process.argv);
};

main();
