"use client"
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

// Define the type for a playlist item
interface Playlist {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
  };
}

export default function Playlists() {
  const searchParams = useSearchParams();
  const accessToken = searchParams ? searchParams.get("accessToken") : null;
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    const fetchPlaylists = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/playlists?accessToken=${accessToken}`);
        if (!response.ok) {
          throw new Error("Failed to fetch playlists");
        }

        const data = await response.json();
        setPlaylists(data.playlists || []);
      } catch (err) {
        console.error("Error fetching playlists:", err);
        setError("An error occurred while fetching playlists.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [accessToken]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your YouTube Playlists</h1>
      {playlists.length === 0 ? (
        <p>No playlists found.</p>
      ) : (
        <div>
          {playlists.map((playlist) => (
            <div key={playlist.id} style={{ marginBottom: "20px" }}>
              <h2>{playlist.snippet.title}</h2>
              {playlist.snippet.thumbnails?.medium?.url && (
                <div style={{ width: "100%", maxWidth: "300px", position: "relative", aspectRatio: "16/9" }}>
                <Image
                  src={playlist.snippet.thumbnails.medium.url}
                  alt={playlist.snippet.title}
                  layout="fill" // Ensures the image covers the container
                  objectFit="cover" // Maintains the aspect ratio and crops as neede
                />
              </div>
              )}
              <p>{playlist.snippet.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
