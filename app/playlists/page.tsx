"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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

 function PlaylistsSus() {
  const searchParams = useSearchParams();
  const accessToken = searchParams ? searchParams.get("accessToken") : null;
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-red-500 text-center">
            <p className="text-xl font-semibold mb-2">Error Loading Playlists</p>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <div className=" min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 "> <PlaylistDisplay playlists={playlists} isLoading={loading} /> </div>;
}

const Playlists:React.FC = ()=>(
  <Suspense fallback={<div>Loading...</div>}>
    <PlaylistsSus/>
  </Suspense>
)

export default Playlists;