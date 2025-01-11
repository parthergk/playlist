"use client";

import { useState } from "react";

export default function Home() {
  const [channelId, setChannelId] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function getPlaylists() {
    if (!channelId.trim()) {
      setMessage("Please enter a valid channel ID.");
      return;
    }

    try {
      setIsLoading(true);
      setMessage(null);
      const response = await fetch(`/api/getPlaylists?channelId=${channelId}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Playlists:", data);
        setMessage("Playlists fetched successfully!");
      } else {
        setMessage("Error fetching playlists. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching playlists:", error);
      setMessage("An error occurred while fetching playlists.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogin() {
    window.location.href = "/api/auth/login";
  }

  return (
    <div className="flex flex-col justify-center items-center m-auto w-full h-screen">
      <div>
        <h2>Login with your Google account to fetch your YouTube playlists.</h2>
        <button
          className="border bg-white border-neutral-800 text-neutral-900"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
      <div>OR</div>
      <div>
        <h2>Get YouTube playlist by channel ID</h2>
        <input
          type="text"
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
          placeholder="Enter Channel ID"
          className="border bg-white border-neutral-800 text-neutral-900"
        />
        <button
          className="border bg-white border-neutral-800 text-neutral-900"
          onClick={getPlaylists}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Get Playlist"}
        </button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
