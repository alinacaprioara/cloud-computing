'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default function SongsPage() {
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/');
        }
    }, []);

    return (
        <div>
            <h1>All Songs</h1>
            {/* list songs */}
        </div>
    );
}
