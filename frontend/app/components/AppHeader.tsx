'use client';

import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AppHeader() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('user'));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('rememberMe');
        setIsLoggedIn(false);
        router.push('/login');
    };

    return (
        <header className="sticky top-0 z-[1200] bg-white/80 backdrop-blur-md border-b border-gray-200/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-xl font-semibold tracking-tighter text-gray-900 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-teal-600 flex items-center justify-center text-white">
                            <Icon icon="solar:routing-2-linear" />
                        </div>
                        RideShare
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/findAride" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                            Find a ride
                        </Link>
                        <Link href="/howItWorks" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                            How it works
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {isLoggedIn ? (
                        <>
                            <Link href="/publishAride" className="hidden md:flex items-center gap-2 text-sm font-medium text-teal-600 transition-colors">
                                <Icon icon="solar:add-circle-linear" className="text-lg" />
                                Publish a ride
                            </Link>

                            <Link href="/myAccount" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                                My Account
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Log out
                            </button>
                        </>
                    ) : (

                        <>
                            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                                Log in
                            </Link>
                            <Link href="/signUp" className="text-sm font-medium bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors">
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
