import { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";

const API_KEY = process.env.API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {channelId} = req.query;
  if (!channelId || Array.isArray(channelId)) {
    return res.status(400).json({ error: "Invalid or missing channelId" });
  }

  try {
    const youtube = google.youtube({
      version: "v3",
      auth: API_KEY,
    });

    const response = await youtube.playlists.list({
      part: ["snippet"],
      channelId: channelId, 
      maxResults: 50,
    });

    res.status(200).json(response.data.items);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
