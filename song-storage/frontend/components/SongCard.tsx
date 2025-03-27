'use client';

import React from 'react';

export type Song = {
    _id: string;
    title: string;
    artist: string;
    spotifyUrl?: string;
};

type SongCardProps = {
    song: Song;
    onDelete?: (id: string) => void;
};

const SongCard: React.FC<SongCardProps> = ({ song, onDelete }) => {
    return (
        <div className="p-3 border rounded flex justify-between items-center hover:shadow-sm transition-shadow">
            <div>
                <p className="font-medium text-base">
                    {song.spotifyUrl ? (
                        <a
                            href={song.spotifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            {song.title}
                        </a>
                    ) : (
                        song.title
                    )}
                </p>
                <p className="text-sm text-gray-600">{song.artist}</p>
            </div>

            {onDelete && (
                <button
                    onClick={() => onDelete(song._id)}
                    className="text-red-500 text-sm hover:underline ml-4"
                >
                    Delete
                </button>
            )}
        </div>
    );
};

export default SongCard;
