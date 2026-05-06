'use client';

import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import AppHeader from '../components/AppHeader';

const SECTIONS = [
    { id: 'introduction', title: '1. Introduction' },
    { id: 'responsibilities', title: '2. User Responsibilities' },
    { id: 'booking', title: '3. Booking & Payments' },
    { id: 'cancellations', title: '4. Cancellations & Refunds' },
    { id: 'safety', title: '5. Safety & Conduct' },
    { id: 'liability', title: '6. Limitation of Liability' },
    { id: 'privacy', title: '7. Privacy & Data Usage' },
    { id: 'changes', title: '8. Changes to Terms' },
];

export default function TermsOfService() {
    const [activeSection, setActiveSection] = useState('introduction');

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-120px 0px -60% 0px',
            threshold: 0.1,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, observerOptions);

        const sections = document.querySelectorAll('.tos-section');
        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="bg-gray-50 text-gray-900 antialiased selection:bg-teal-500 selection:text-white flex flex-col min-h-screen relative font-sans">

            {/* --- Header --- */}
            <AppHeader />

            {/* --- Main Content --- */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20 relative z-10">

                {/* Decorative Background */}
                <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-50 rounded-full blur-3xl opacity-60 -z-10 pointer-events-none"></div>

                {/* Hero Section */}
                <div className="max-w-3xl mb-12 lg:mb-16">
                    <p className="text-sm font-medium text-teal-600 mb-3 flex items-center gap-2">
                        <Icon icon="solar:document-text-linear" />
                        Legal Information
                    </p>
                    <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-gray-900 mb-4">Terms of Service</h1>
                    <p className="text-base text-gray-500 leading-relaxed mb-6">
                        Please read these terms carefully before using our platform. These rules ensure a safe, reliable, and fair experience for our entire community.
                    </p>
                    <p className="text-xs font-medium text-gray-400">Last updated: April 23, 2026</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start relative">

                    {/* Left Side: Table of Contents (Sticky) */}
                    <div className="hidden lg:block lg:col-span-3 sticky top-28">
                        <div className="pr-4 border-l border-gray-200/80">
                            <nav className="flex flex-col space-y-1 relative">
                                {SECTIONS.map((section) => (
                                    <Link
                                        key={section.id}
                                        href={`#${section.id}`}
                                        className={`text-sm font-medium border-l-2 -ml-[1px] pl-4 py-1.5 transition-all ${
                                            activeSection === section.id
                                                ? 'text-teal-600 border-teal-600'
                                                : 'text-gray-500 border-transparent hover:text-gray-900 hover:border-gray-300'
                                        }`}
                                    >
                                        {section.title}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Right Side: Content Sections */}
                    <div className="lg:col-span-9 xl:col-span-8">
                        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200/60 p-6 sm:p-10 lg:p-12 space-y-12">

                            <section id="introduction" className="tos-section scroll-mt-28">
                                <h2 className="text-xl font-semibold tracking-tight text-gray-900 mb-4">1. Introduction</h2>
                                <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                                    <p>Welcome to RideShare. These terms and conditions govern your access to and use of our platform, including our website, mobile applications, and associated services.</p>
                                    <p>Our platform facilitates carpooling by connecting drivers traveling to a specific destination with passengers heading the same way. We act purely as an intermediary.</p>
                                </div>
                            </section>

                            <section id="responsibilities" className="tos-section scroll-mt-28">
                                <h2 className="text-xl font-semibold tracking-tight text-gray-900 mb-4">2. User Responsibilities</h2>
                                <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                                    <p>To use our platform, you must be at least 18 years old. You agree to provide accurate, current, and complete information during the registration process.</p>
                                    <p>Drivers must possess a valid driver&apos;s license, necessary insurance, and a legally registered, safe vehicle.</p>
                                </div>
                            </section>

                            <section id="booking" className="tos-section scroll-mt-28">
                                <h2 className="text-xl font-semibold tracking-tight text-gray-900 mb-4">3. Booking & Payments</h2>
                                <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                                    <p>When a passenger books a seat, they agree to pay the fare specified by the driver, along with any applicable platform service fees.</p>
                                    <p>All payments must be processed securely through our platform. Direct cash payments are strongly discouraged.</p>
                                </div>
                            </section>

                            <section id="cancellations" className="tos-section scroll-mt-28">
                                <h2 className="text-xl font-semibold tracking-tight text-gray-900 mb-4">4. Cancellations & Refunds</h2>
                                <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                                    <p>Refunds to passengers are issued based on the timing of the cancellation relative to the scheduled departure time.</p>
                                    <p>If a driver cancels a ride, passengers will receive a full refund, including service fees.</p>
                                </div>
                            </section>

                            <section id="safety" className="tos-section scroll-mt-28">
                                <h2 className="text-xl font-semibold tracking-tight text-gray-900 mb-4">5. Safety & Conduct</h2>
                                <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                                    <p>Safety is our top priority. Discrimination, harassment, or unsafe driving behavior will not be tolerated under any circumstances.</p>
                                    <p>Any verified reports of dangerous behavior will result in immediate and permanent account termination.</p>
                                </div>
                            </section>

                            <section id="liability" className="tos-section scroll-mt-28">
                                <h2 className="text-xl font-semibold tracking-tight text-gray-900 mb-4">6. Limitation of Liability</h2>
                                <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                                    <p>RideShare acts exclusively as a technology platform. We do not employ the drivers, own the vehicles, or control the conditions of the journey.</p>
                                </div>
                            </section>

                            <section id="privacy" className="tos-section scroll-mt-28">
                                <h2 className="text-xl font-semibold tracking-tight text-gray-900 mb-4">7. Privacy & Data Usage</h2>
                                <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                                    <p>We collect, store, and process your personal data in accordance with our Privacy Policy. We do not sell your personal data to third parties.</p>
                                </div>
                            </section>

                            <section id="changes" className="tos-section scroll-mt-28">
                                <h2 className="text-xl font-semibold tracking-tight text-gray-900 mb-4">8. Changes to Terms</h2>
                                <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                                    <p>We may modify these Terms occasionally. Continued use of the platform after updates implies your acceptance of the revised terms.</p>
                                </div>
                            </section>

                            <hr className="border-gray-200" />

                            {/* CTA Section */}
                            <div className="bg-gray-50 rounded-2xl border border-gray-200/60 p-8 sm:p-10 text-center flex flex-col items-center justify-center">
                                <div className="w-12 h-12 bg-white rounded-full border border-gray-200 flex items-center justify-center mb-4 shadow-sm">
                                    <Icon icon="solar:shield-check-linear" className="text-2xl text-teal-600" />
                                </div>
                                <h3 className="text-lg font-semibold tracking-tight text-gray-900 mb-2">By using our platform, you agree to these terms</h3>
                                <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">If you have any questions, please reach out to our support team.</p>
                                <Link href="/" className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl px-6 py-3 text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2 group">
                                    Start using RideShare
                                    <Icon icon="solar:arrow-right-linear" className="opacity-70 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* --- Footer --- */}
            <footer className="mt-auto border-t border-gray-200/60 bg-white pt-10 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-400">© 2026 RideShare Inc. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link href="/aboutUs" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">About</Link>
                        <Link href="/helpCenter" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">Help</Link>
                        <Link href="/termsOfService" className="text-xs text-gray-900 font-medium transition-colors">Terms</Link>
                        <Link href="/privacyPolicy" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">Privacy</Link>
                        <Link href="/contactUs" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}