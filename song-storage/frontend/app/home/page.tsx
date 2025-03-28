'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PlaylistCard from '@/components/PlaylistCard';
import { Song } from '@/components/SongCard';
import Link from 'next/link'

type Playlist = {
    _id: string;
    name: string;
    songs: Song[];
    imageUrl?: string;
};

export default function HomePage() {
    const router = useRouter();
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const username = localStorage.getItem('username');

        if (!userId || !username) {
            router.push('/');
            return;
        }

        setUsername(username);
        localStorage.setItem('username', username);

        const fetchPlaylists = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}/playlists`);
                if (!res.ok) throw new Error('Failed to fetch playlists');
                const data: Playlist[] = await res.json();

                const playlistsWithImages = await Promise.all(
                    data.map(async (playlist) => {
                        try {
                            const imageRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/nasa/search?query=${playlist.name}`);
                            const imageData = await imageRes.json();
                            return { ...playlist, imageUrl: imageData.imageUrl || null };
                        } catch {
                            return { ...playlist, imageUrl: null };
                        }
                    })
                );

                setPlaylists(playlistsWithImages);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylists();
    }, [router]);



        return (
        <>
            <header className="bg-black text-white py-4 px-6 shadow-md sticky top-0 z-50">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">🎵 Song Storage</h1>
                    <span className="text-sm">Logged in as: <strong>{username}</strong></span>
                </div>
            </header>

            <main className="p-6 max-w-5xl mx-auto">
                <h2 className="text-xl font-semibold mb-4">Your Playlists</h2>

                {loading ? (
                    <p>Loading your playlists...</p>
                ) : playlists.length === 0 ? (
                    <p className="text-gray-500">You don’t have any playlists yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {playlists.map((playlist) => (
                            <Link
                                key={playlist._id}
                                href={`/playlist/${playlist._id}`}
                                className="border rounded-lg shadow bg-white transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer block overflow-hidden"
                            >
                                {playlist.imageUrl && (
                                    <div
                                        className="h-32 bg-cover bg-center"
                                        style={{ backgroundImage: `url(${playlist.imageUrl})` }}
                                    />
                                )}
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{playlist.name}</h3>
                                    <ul className="space-y-1">
                                        {(playlist?.songs || []).slice(0, 3).map((song) => (
                                            <li key={song._id} className="text-sm text-gray-700">
                                                🎵 {song.title} — <span className="text-gray-500">{song.artist}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    {playlist?.songs?.length > 3 && (
                                        <p className="text-xs text-blue-500 mt-2">...and more</p>
                                    )}
                                </div>
                            </Link>


                        ))}
                    </div>
                )}
            </main>
        </>
    );
}
