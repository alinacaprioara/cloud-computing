'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Song } from '@/components/SongCard';

type Playlist = {
    _id: string;
    name: string;
    songs: Song[];
    imageUrl?: string | null;
};

export default function PlaylistPage() {
    const {id} = useParams();
    const router = useRouter();
    const [playlist, setPlaylist] = useState<Playlist>({
        _id: '',
        name: '',
        songs: [],
    });
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState('');
    const [songTitle, setSongTitle] = useState('');
    const [songArtist, setSongArtist] = useState('');
    const [spotifyUrl, setSpotifyUrl] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);



    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId || !id) {
            router.push('/');
            return;
        }

        const fetchPlaylist = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}/playlists/${id}`);
                if (!res.ok) throw new Error('Failed to fetch playlist');
                const data = await res.json();

                let imageUrl = null;
                try {
                    const imageRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/nasa/apod`);
                    const imageData = await imageRes.json();
                    imageUrl = imageData.imageUrl;
                } catch (error) {
                    console.error('Error fetching NASA image:', error);
                }

                setPlaylist({
                    ...data,
                    songs: data.songs || [],
                    imageUrl: imageUrl
                });
                setNewName(data.name);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylist();
    }, [id, router]);

    const handleRename = async () => {
        const userId = localStorage.getItem('userId');

        const updatedPlaylist = {
            ...playlist,
            name: newName,
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}/playlists/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updatedPlaylist),
        });

        if (res.ok) {
            const updated = await res.json();
            setPlaylist(updated);
        }
    };

    const handleAddSong = async () => {
        const userId = localStorage.getItem('userId');
        const newSong = {
            title: songTitle,
            artist: songArtist,
            album: '',
            year: '',
            genre: '',
            spotifyUrl: spotifyUrl || '',
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/songs`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newSong),
        });

        const songResponse = await res.json();

        const songWithId = {
            _id: songResponse,
            title: newSong.title,
            artist: newSong.artist,
        };

        const updatedPlaylist = {
            ...playlist,
            songs: [...(playlist?.songs || []), songWithId],
        };

        const res_2 = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}/playlists/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updatedPlaylist),
        });


        if (res_2.ok) {
            const data = await res_2.json();
            setPlaylist(data);
        }
    };

    const handleDeleteSong = async (songId: string) => {
        const userId = localStorage.getItem('userId');
        const updatedSongs = playlist?.songs.filter((s) => s._id !== songId) || [];

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}/playlists/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({...playlist, songs: updatedSongs}),
        });

        if (res.ok) {
            const updated = await res.json();
            setPlaylist(updated);
        }
    };


    const handleSearch = async () => {
        if (!searchQuery) return;

        setSearching(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/discogs/search?q=${searchQuery}`);
            if (!res.ok) throw new Error('Failed to search songs');
            const data = await res.json();
            setSearchResults(data);
        } catch (error) {
            console.error(error);
        } finally {
            setSearching(false);
        }
    };


    if (loading) return <p className="p-6">Loading playlist...</p>;
    if (!playlist) return <p className="p-6 text-red-500">Playlist not found.</p>;

    return (
        <>
            {/* Header */}
            <header className="bg-black text-white py-4 px-6 shadow-md sticky top-0 z-50">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">🎵 Song Storage</h1>
                    <span className="text-sm">Logged in as: <strong>{localStorage.getItem('username')}</strong></span>
                </div>
            </header>

            {/* Discogs Search Section */}
            <div className="p-6 max-w-5xl mx-auto">
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Songs (Discogs)</h2>
                    <div className="flex flex-col sm:flex-row gap-2 mb-4">
                        <input
                            type="text"
                            placeholder="Search for songs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border p-2 rounded w-full sm:flex-1 text-gray-900"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                        >
                            {searching ? 'Searching...' : 'Search'}
                        </button>
                    </div>

                    {searchResults.length > 0 && (
                        <ul className="space-y-3">
                            {searchResults.map((result, idx) => (
                                <li key={`${result.id}-${idx}`} className="border p-3 rounded shadow">
                                    <p className="font-semibold text-gray-900">{result.title}</p>
                                    {result.year && <p className="text-sm text-gray-600">Year: {result.year}</p>}
                                    {result.genre && <p className="text-sm text-gray-600">Genres: {result.genre.join(', ')}</p>}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>



            {/* Main Content */}
            <main className="p-6 max-w-5xl mx-auto">
                <button
                    className="mb-4 text-blue-500 hover:underline text-sm"
                    onClick={() => router.push('/home')}
                >
                    ← Back to playlists
                </button>

                {/* Playlist Card */}
                {playlist.imageUrl && (
                    <div
                        className="h-48 mb-6 rounded-lg shadow-lg bg-cover bg-center"
                        style={{ backgroundImage: `url(${playlist.imageUrl})` }}
                    />
                )}

                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="border p-2 rounded flex-1 text-gray-900"
                        />
                        <button
                            onClick={handleRename}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                        >
                            Rename
                        </button>
                    </div>

                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Songs</h2>

                    {playlist.songs.length === 0 ? (
                        <p className="text-gray-500 mb-4">This playlist is empty.</p>
                    ) : (
                        <ul className="space-y-3 mb-6">
                            {playlist.songs.map((song) => (
                                <li
                                    key={song._id}
                                    className="border p-3 rounded shadow flex justify-between items-center"
                                >
                                    <div>
                                        <p className="font-semibold text-gray-900 mb-2">{song.title}</p>
                                        <p className="text-sm text-gray-600">{song.artist}</p>
                                        {song.spotifyUrl && (
                                            <a
                                                href={song.spotifyUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-500 hover:underline"
                                            >
                                                Open in Spotify
                                            </a>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleDeleteSong(song._id)}
                                        className="text-red-500 text-sm hover:underline ml-4"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Add Song Form */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Add a New Song</h2>
                    <div className="space-y-2 text-gray-900 mb-4">
                        <input
                            type="text"
                            placeholder="Title"
                            value={songTitle}
                            onChange={(e) => setSongTitle(e.target.value)}
                            className="border p-2 rounded w-full"
                        />
                        <input
                            type="text"
                            placeholder="Artist"
                            value={songArtist}
                            onChange={(e) => setSongArtist(e.target.value)}
                            className="border p-2 rounded w-full"
                        />
                        <input
                            type="text"
                            placeholder="Spotify URL (optional)"
                            value={spotifyUrl}
                            onChange={(e) => setSpotifyUrl(e.target.value)}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                    <button
                        onClick={handleAddSong}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Add Song
                    </button>
                </div>
            </main>
        </>
    );
}
