'use client';

import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import AppHeader from '../components/AppHeader';
import AppFooter from "@/app/components/AppFooter";

export default function HowItWorks() {
    // Intersection Observer for scroll animations
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('opacity-0', 'translate-y-4');
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(element => {
            observer.observe(element);
        });

        // Cleanup observer on component unmount
        return () => {
            elements.forEach(element => {
                observer.unobserve(element);
            });
        };
    }, []);

    return (
        <div className="bg-gray-50 text-gray-900 font-sans antialiased selection:bg-brand-500 selection:text-white flex flex-col min-h-screen">

            {/* Navigation */}
            <AppHeader />

            {/* Main Content */}
            <main className="flex-1 w-full max-w-full">

                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out">
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-gray-900 mb-6">How It Works</h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto font-normal">Simple steps to start traveling, save money, and meet great people along the way.</p>
                </section>

                {/* Steps Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8">

                        {/* Step 1 */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 relative group animate-on-scroll opacity-0 translate-y-4 ease-out" style={{ transitionDelay: '100ms' }}>
                            <div className="text-6xl font-medium text-gray-50 absolute top-4 right-4 z-0 pointer-events-none group-hover:text-brand-50 transition-colors">1</div>
                            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
                                <Icon icon="solar:magnifer-linear" className="text-2xl" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2 relative z-10 tracking-tight">Search for a ride</h3>
                            <p className="text-sm text-gray-500 font-normal relative z-10">Enter your departure, destination, and date to see available rides.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 relative group animate-on-scroll opacity-0 translate-y-4 ease-out" style={{ transitionDelay: '200ms' }}>
                            <div className="text-6xl font-medium text-gray-50 absolute top-4 right-4 z-0 pointer-events-none group-hover:text-brand-50 transition-colors">2</div>
                            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
                                <Icon icon="solar:cursor-square-linear" className="text-2xl" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2 relative z-10 tracking-tight">Choose your ride</h3>
                            <p className="text-sm text-gray-500 font-normal relative z-10">Compare prices, drivers, and ratings to find your perfect match.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 relative group animate-on-scroll opacity-0 translate-y-4 ease-out" style={{ transitionDelay: '300ms' }}>
                            <div className="text-6xl font-medium text-gray-50 absolute top-4 right-4 z-0 pointer-events-none group-hover:text-brand-50 transition-colors">3</div>
                            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
                                <Icon icon="solar:ticket-linear" className="text-2xl" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2 relative z-10 tracking-tight">Book your seat</h3>
                            <p className="text-sm text-gray-500 font-normal relative z-10">Reserve your seat instantly online or request approval from the driver.</p>
                        </div>

                        {/* Step 4 */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 relative group animate-on-scroll opacity-0 translate-y-4 ease-out" style={{ transitionDelay: '400ms' }}>
                            <div className="text-6xl font-medium text-gray-50 absolute top-4 right-4 z-0 pointer-events-none group-hover:text-brand-50 transition-colors">4</div>
                            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
                                <Icon icon="solar:routing-2-linear" className="text-2xl" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2 relative z-10 tracking-tight">Travel and enjoy</h3>
                            <p className="text-sm text-gray-500 font-normal relative z-10">Meet your driver at the departure point and enjoy the journey.</p>
                        </div>

                    </div>
                </section>

                {/* Benefits Section */}
                <section className="bg-white border-y border-gray-200/50 mt-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
                        <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out">
                            <h2 className="text-3xl font-medium tracking-tight text-gray-900 mb-4">Why choose RideShare?</h2>
                            <p className="text-sm text-gray-500 font-normal max-w-2xl mx-auto">We provide the best experience for both drivers and passengers.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">

                            {/* Benefit 1 */}
                            <div className="flex flex-col items-center animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out" style={{ transitionDelay: '100ms' }}>
                                <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-900 mb-6 group hover:bg-gray-100 transition-colors">
                                    <Icon icon="solar:wallet-linear" className="text-3xl" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-3 tracking-tight">Save money</h3>
                                <p className="text-sm text-gray-500 font-normal max-w-sm">Share travel costs and reach your destination without breaking the bank.</p>
                            </div>

                            {/* Benefit 2 */}
                            <div className="flex flex-col items-center animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out" style={{ transitionDelay: '200ms' }}>
                                <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-900 mb-6 group hover:bg-gray-100 transition-colors">
                                    <Icon icon="solar:shield-check-linear" className="text-3xl" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-3 tracking-tight">Travel safely</h3>
                                <p className="text-sm text-gray-500 font-normal max-w-sm">All members are verified, and peer reviews help you choose reliable companions.</p>
                            </div>

                            {/* Benefit 3 */}
                            <div className="flex flex-col items-center animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out" style={{ transitionDelay: '300ms' }}>
                                <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-900 mb-6 group hover:bg-gray-100 transition-colors">
                                    <Icon icon="solar:calendar-linear" className="text-3xl" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-3 tracking-tight">Flexible choices</h3>
                                <p className="text-sm text-gray-500 font-normal max-w-sm">Thousands of rides daily giving you the ultimate freedom to travel when you want.</p>
                            </div>

                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
                    <div className="bg-gray-900 rounded-3xl p-10 md:p-14 text-center text-white relative overflow-hidden animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out">
                        {/* Subtle Background Glow */}
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-transparent to-transparent pointer-events-none"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl font-medium tracking-tight mb-4">Ready to find your next ride?</h2>
                            <p className="text-sm text-gray-400 font-normal mb-8 max-w-lg mx-auto">Join thousands of travelers already sharing their journeys and saving money.</p>
                            <Link href="/findAride" className="inline-flex items-center justify-center bg-white text-gray-900 hover:bg-gray-50 px-8 py-3.5 rounded-xl font-medium text-sm transition-colors duration-200 shadow-sm gap-2">
                                <Icon icon="solar:magnifer-linear" className="text-lg" />
                                Search Rides
                            </Link>
                        </div>
                    </div>
                </section>

            </main>

            {/* Footer */}
            <AppFooter />
        </div>
    );
}