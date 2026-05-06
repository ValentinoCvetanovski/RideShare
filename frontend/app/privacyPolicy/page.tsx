'use client';

import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import AppHeader from '../components/AppHeader';

export default function PrivacyPolicy() {
    const [activeSection, setActiveSection] = useState('introduction');
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        // 1. Fade-up Animation Logic
        const fadeObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('opacity-100', 'translate-y-0');
                        entry.target.classList.remove('opacity-0', 'translate-y-5');
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('.fade-up-init').forEach((el) => fadeObserver.observe(el));

        // 2. Scroll Spy Logic
        const sections = document.querySelectorAll('.policy-section');
        const spyObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-20% 0px -60% 0px' }
        );

        sections.forEach((section) => spyObserver.observe(section));

        // 3. Back to Top Visibility
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            fadeObserver.disconnect();
            spyObserver.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const sectionsData = [
        { id: 'introduction', label: 'Introduction' },
        { id: 'info-collect', label: 'Information We Collect' },
        { id: 'info-use', label: 'How We Use Information' },
        { id: 'cookies', label: 'Cookies & Tracking' },
        { id: 'data-sharing', label: 'Data Sharing' },
        { id: 'data-security', label: 'Data Security' },
        { id: 'user-rights', label: 'User Rights' },
        { id: 'changes', label: 'Changes to This Policy' },
        { id: 'contact', label: 'Contact Us' },
    ];

    return (
        <div className="bg-gray-50 text-gray-900 antialiased selection:bg-green-500 selection:text-white flex flex-col min-h-screen relative overflow-x-hidden scroll-smooth">

            {/* Header */}
            <AppHeader />

            {/* Main Content */}
            <main className="flex-grow w-full max-w-[1000px] mx-auto px-4 sm:px-6 py-12 lg:py-16 relative z-10">
                <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-50 rounded-full blur-3xl opacity-60 -z-10 pointer-events-none"></div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

                    {/* Sticky Sidebar */}
                    <aside className="hidden lg:block w-64 shrink-0 sticky top-28 fade-up-init opacity-0 translate-y-5 transition-all duration-700">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Table of Contents</h3>
                        <nav className="flex flex-col border-l border-gray-200/80">
                            {sectionsData.map((section) => (
                                <Link
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className={`block px-4 py-2 text-sm transition-all border-l-2 ${
                                        activeSection === section.id
                                            ? 'text-green-600 font-medium border-green-600 bg-green-50/50'
                                            : 'text-gray-500 border-transparent hover:text-gray-900 hover:bg-gray-50/50'
                                    }`}
                                >
                                    {section.label}
                                </Link>
                            ))}
                        </nav>
                    </aside>

                    {/* Policy Content Area */}
                    <article className="flex-1 min-w-0 bg-white rounded-3xl border border-gray-200/60 p-6 sm:p-10 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] fade-up-init opacity-0 translate-y-5 transition-all duration-700 delay-100">
                        <div className="mb-12 border-b border-gray-100 pb-8">
                            <div className="flex items-center gap-2 text-green-600 font-medium text-sm mb-3">
                                <Icon icon="solar:shield-check-linear" className="text-lg" />
                                Legal & Compliance
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 mb-4">Privacy Policy</h1>
                            <p className="text-sm text-gray-500">Last updated: April 2026</p>
                        </div>

                        <div className="space-y-12">
                            {/* Секциите се исти како претходно, додади ги сите тука */}
                            <section id="introduction" className="scroll-mt-24 policy-section">
                                <h2 className="text-xl font-semibold tracking-tight text-gray-900 mb-4 flex items-center gap-3">
                                    <span className="w-1.5 h-6 bg-green-500 rounded-full shrink-0"></span>
                                    Introduction
                                </h2>
                                <div className="text-gray-600 text-sm leading-relaxed space-y-4">
                                    <p>Welcome to RideShare ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data.</p>
                                </div>
                            </section>

                            {/* ... други секции ... */}

                            <section id="contact" className="scroll-mt-24 policy-section">
                                <h2 className="text-xl font-semibold tracking-tight text-gray-900 mb-4 flex items-center gap-3">
                                    <span className="w-1.5 h-6 bg-green-500 rounded-full shrink-0"></span>
                                    Contact Us
                                </h2>
                                <div className="text-gray-600 text-sm leading-relaxed space-y-4">
                                    <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200/60 mt-4 inline-block">
                                        <p className="mb-1 font-medium text-gray-900">Email Address:</p>
                                        <a href="mailto:privacy@rideshare.com" className="text-green-600 hover:text-green-700 font-medium underline decoration-green-200 underline-offset-4 transition-colors">privacy@rideshare.com</a>
                                        <p className="mb-1 font-medium text-gray-900 mt-4">Mailing Address:</p>
                                        <p className="text-gray-500">Sample Street 123<br />Tech District, CA 94103</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </article>
                </div>
            </main>

            {/* COMPLETED FOOTER WITH 5 LINKS */}
            <footer className="mt-auto border-t border-gray-200/60 bg-white pt-10 pb-8">
                <div className="max-w-[1000px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-400">© 2026 RideShare Inc. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link href="/aboutUs" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
                            About
                        </Link>
                        <Link href="/helpCenter" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
                            Help
                        </Link>
                        <Link href="/termsOfService" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
                            Terms
                        </Link>
                        <Link href="/privacyPolicy" className="text-xs text-gray-900 font-medium transition-colors">
                            Privacy
                        </Link>
                        <Link href="/contactUs" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
                            Contact
                        </Link>
                    </div>
                </div>
            </footer>

            {/* Back to Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 right-8 w-12 h-12 bg-white border border-gray-200/60 shadow-lg shadow-black/5 text-gray-600 rounded-full flex items-center justify-center hover:text-green-600 hover:border-green-200 transition-all duration-300 z-40 ${
                    showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
            >
                <Icon icon="solar:alt-arrow-up-linear" className="text-xl" />
            </button>
        </div>
    );
}