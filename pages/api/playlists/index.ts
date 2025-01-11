import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";

export default async function playlists(req: NextApiRequest, res: NextApiResponse) {
  const { accessToken } = req.query;

  if (!accessToken) {
    return res.status(400).json({ error: "Access token is required" });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  oauth2Client.setCredentials({ access_token: accessToken as string });

  const youtube = google.youtube({ version: "v3", auth: oauth2Client });

  try {
    const response = await youtube.playlists.list({
      part: ["snippet"],
      mine: true,
    });

    const playlists = response.data.items;

    if (!playlists || playlists.length === 0) {
      return res.status(404).json({ error: "No playlists found" });
    }

    res.status(200).json({ playlists });
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
}