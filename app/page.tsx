"use client";

import { useState } from "react";
import PlaylistDisplay from "@/components/PlaylistDisplay";

interface Playlist {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      standard: {url: string};
    };
    publishedAt: string;
  };
}

export default function Home() {
  const [channelId, setChannelId] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showPlaylists, setShowPlaylists] = useState<boolean>(false);

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
        setPlaylists(data);
        setShowPlaylists(true);
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            YouTube Playlist Manager
          </h1>
          <p className="text-gray-600">
            Access and manage your YouTube playlists easily
          </p>
        </div>

        {/* Login with google */}
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Access Your Playlists
          </h2>
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center px-4 py-3 text-base font-medium rounded-lg text-white  bg-gray-800 hover:bg-gray-900 transition-colors duration-200"
          >
            Sign in with Google
          </button>
        </div>

        {/* or */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gradient-to-b from-gray-50 to-gray-100 text-gray-500">
              OR
            </span>
          </div>
        </div>

        {/* Channel ID Section */}
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
          Access any Playlists by Channel ID
          </h2>
          <div className="space-y-4">
              <input
                type="text"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                placeholder="Enter YouTube Channel ID"
                className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg  outline-none transition-shadow duration-200"
              />
            <button
              onClick={getPlaylists}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 text-base font-medium rounded-lg text-white  bg-gray-800 hover:bg-gray-900 transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                "Get Playlists"
              )}
            </button>
            {message && (
              <div className={`p-4 rounded-lg ${
                message.includes("successfully") 
                  ? "bg-green-50 text-green-800" 
                  : "bg-red-50 text-red-800"
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Playlist Display Section */}
      {showPlaylists && playlists.length > 0 && (
        <div className="mt-8">
          <PlaylistDisplay playlists={playlists} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
}