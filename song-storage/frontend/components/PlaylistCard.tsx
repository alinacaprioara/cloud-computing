'use client';

import React from 'react';
import Link from 'next/link';
import { Song } from './SongCard';
import SongCard from './SongCard';

type PlaylistCardProps = {
    id: string;
    name: string;
    songs: Song[];
};

const PlaylistCard: React.FC<PlaylistCardProps> = ({ id, name, songs }) => {
    return (
        <div className="border p-4 rounded shadow mb-6">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">{name}</h2>
                <Link
                    href={`/playlist/${id}`}
                    className="text-blue-500 hover:underline text-sm"
                >
                    View Playlist →
                </Link>
            </div>

            {Array.isArray(songs) && songs.length > 0 ? (
                <div className="space-y-2">
                    {songs.map((song) => (
                        <SongCard key={song._id} song={song} onDelete={(id) => { console.log('Delete song:', id);
                        }} />
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500">No songs in this playlist.</p>
            )}
        </div>
    );
};

export default PlaylistCard;
