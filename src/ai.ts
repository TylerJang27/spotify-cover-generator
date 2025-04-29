import { Playlist, PlaylistedTrack, Track } from "@spotify/web-api-ts-sdk";
import { writeFile } from "node:fs/promises";
import logger from "./logger";

const generateImage = async (data: object) => {
  const response = await fetch(
    "https://router.huggingface.co/together/v1/images/generations",
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGING_FACE_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    },
  );
  if (!response.ok) {
    throw new Error(`Failed to generate image: ${response.status}`);
  }

  const result = await response.json();
  return result.data[0].b64_json;
};

export const generateCoverImage = async (
  playlist: Playlist,
  tracks: PlaylistedTrack<Track>[],
) => {
  const outputFile = "coverPhoto.png";

  const prompt = `
Generate an abstract image that encapsulates these song titles:

The generated image should include motifs from multiple song titles and encapsulate the
overall mood of the track list. Moving left to right, the image should change to reflect the 
changing song moods.

${tracks.map((t) => `${t.track.name} (${t.track.album.name})`).join("\n")}`;

  const result = await generateImage({
    prompt: prompt,
    height: 1024,
    width: 1024,
    guidance_scale: 3.5,
    response_format: "base64",
    model: "black-forest-labs/FLUX.1-dev",
  });
  const image_bytes = Buffer.from(result, "base64");
  await writeFile(outputFile, image_bytes);

  logger.info(`Wrote image to ${outputFile}`);

  return outputFile;
};
