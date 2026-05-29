'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function OAuthSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const user = {
            id: Number(searchParams.get('id')),
            fullName: searchParams.get('fullName') || '',
            email: searchParams.get('email') || '',
            avatar: searchParams.get('avatar') || null,
            role: searchParams.get('role') || 'USER',
        };

        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('rememberMe', 'true');

        router.push('/');
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">
            Signing you in...
        </div>
    );
}