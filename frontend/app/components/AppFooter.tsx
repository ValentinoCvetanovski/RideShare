'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';

export default function AppFooter() {
    const [topRoutes, setTopRoutes] = useState<string[]>([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/rides', { cache: 'no-store' })
            .then((res) => res.json())
            .then((data) => {
                const routes = Array.from(
                    new Set(
                        (data || []).map((ride: any) => `${ride.fromCity} → ${ride.toCity}`)
                    )
                ).slice(0, 3);

                // @ts-ignore
                setTopRoutes(routes);
            })
            .catch((err) => console.error(err));
    }, []);

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-4 tracking-tight">Top routes</h4>
                        <ul className="space-y-3">
                            {topRoutes.length > 0 ? (
                                topRoutes.map((route) => (
                                    <li key={route}>
                                        <Link href="/findAride" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                                            {route}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li className="text-sm text-gray-400">No routes yet</li>
                            )}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-4 tracking-tight">About</h4>
                        <ul className="space-y-3">
                            <li><Link href="/howItWorks" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">How it works</Link></li>
                            <li><Link href="/aboutUs" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">About us</Link></li>
                            <li><Link href="/careers" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Careers</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-4 tracking-tight">Help</h4>
                        <ul className="space-y-3">
                            <li><Link href="/helpCenter" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Help Center</Link></li>
                            <li><Link href="/trustAndSafety" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Trust & Safety</Link></li>
                            <li><Link href="/contactUs" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Contact us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-4 tracking-tight">Legal</h4>
                        <ul className="space-y-3">
                            <li><Link href="/termsOfService" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacyPolicy" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/cookiePolicy" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-xl font-semibold tracking-tighter text-gray-900 flex items-center gap-2 grayscale opacity-50">
                        <Icon icon="solar:routing-2-linear" strokeWidth="1.5" />
                        RideShare
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                            <Icon icon="solar:facebook-linear" strokeWidth="1.5" className="text-xl" />
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                            <Icon icon="solar:twitter-linear" strokeWidth="1.5" className="text-xl" />
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                            <Icon icon="solar:instagram-linear" strokeWidth="1.5" className="text-xl" />
                        </Link>
                    </div>
                    <p className="text-xs text-gray-400">© 2026 RideShare Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
