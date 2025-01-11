import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";

// Initialize the OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Define the required scopes
const SCOPES = ["https://www.googleapis.com/auth/youtube.readonly"];

// API Route Handler
export default async function googlelogin(req: NextApiRequest, res: NextApiResponse) {
  
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  try {

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });

    res.redirect(authUrl);
  } catch (error) {
    console.error("Error generating auth URL:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
