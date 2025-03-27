'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PlaylistCard from '@/components/PlaylistCard';
import { Song } from '@/components/SongCard';

type Playlist = {
    _id: string;
    name: string;
    songs: Song[];
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

        const fetchPlaylists = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}/playlists`);
                if (!res.ok) throw new Error('Failed to fetch playlists');
                const data = await res.json();
                setPlaylists(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylists();
    }, [router]);

    return (
        <main className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Hello, {username}</h1>

            {loading ? (
                <p>Loading your playlists...</p>
            ) : playlists.length === 0 ? (
                <p className="text-gray-500">You don’t have any playlists yet.</p>
            ) : (
                playlists.map((playlist) => (
                    <PlaylistCard
                        key={playlist._id}
                        id={playlist._id}
                        name={playlist.name}
                        songs={playlist.songs}
                    />
                ))
            )}
        </main>
    );
}
