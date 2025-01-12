import React from "react";
import Image from "next/image";

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

interface PlaylistsProps {
  playlists: Playlist[];
  isLoading?: boolean;
}

const PlaylistDisplay = ({ playlists, isLoading = false }: PlaylistsProps) => {
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="container text-gray-800 mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Playlists</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative group">
              <Image
                src={playlist.snippet.thumbnails.standard.url}
                alt={playlist.snippet.title}
                className="w-full h-48 object-cover"
                width={640}
                height={480}
              />
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-800 text-lg mb-2 truncate">
                {playlist.snippet.title}
              </h3>
              <p className="text-gray-800 text-sm line-clamp-2 mb-3">
                {playlist.snippet.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-xs">
                  {new Date(playlist.snippet.publishedAt).toLocaleDateString()}
                </span>
                {/* <button className="text-sm px-4 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300">
                  View
                </button> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistDisplay;
