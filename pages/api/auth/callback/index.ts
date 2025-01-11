import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

export default async function callback(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const code = req.query.code as string;

  if (!code) {
    return res.status(400).json({ error: "Missing authorization code" });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    if (!tokens.access_token) {
      throw new Error("Access token is missing");
    }

    oauth2Client.setCredentials(tokens);
    res.redirect(`/playlists?accessToken=${tokens.access_token}`);
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    res.status(500).json({ error: "Failed to authenticate" });
  }
}
