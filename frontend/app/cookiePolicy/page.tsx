'use client';

import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AppHeader from '../components/AppHeader';

const sections = [
    { id: 'what-are-cookies', title: 'What Are Cookies' },
    { id: 'how-we-use', title: 'How We Use Cookies' },
    { id: 'types-of-cookies', title: 'Types of Cookies We Use' },
    { id: 'third-party', title: 'Third-Party Cookies' },
    { id: 'managing-cookies', title: 'Managing Cookies' },
    { id: 'changes', title: 'Changes to This Policy' },
    { id: 'contact', title: 'Contact Us' },
];

export default function CookiePolicy() {
    const [activeSection, setActiveSection] = useState('');
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // 1. Scroll Spy Logic
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.policy-section').forEach((section) => {
            observer.observe(section);
        });

        // 2. Back to Top & Banner Logic
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
        };

        window.addEventListener('scroll', handleScroll);

        // 3. Cookie Banner Logic
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => setShowBanner(true), 1000);
        }

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleBannerChoice = (choice: 'accepted' | 'rejected') => {
        localStorage.setItem('cookieConsent', choice);
        setShowBanner(false);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="bg-gray-50 text-gray-900 antialiased selection:bg-green-500 selection:text-white flex flex-col min-h-screen relative overflow-x-hidden scroll-smooth">

            {/* Header */}
            <AppHeader />

            <main className="flex-grow w-full max-w-[1000px] mx-auto px-4 sm:px-6 py-12 lg:py-16 relative z-10">
                <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-50 rounded-full blur-3xl opacity-60 -z-10 pointer-events-none"></div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

                    {/* Sidebar navigation */}
                    <aside className="hidden lg:block w-64 shrink-0 sticky top-28">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Table of Contents</h3>
                        <nav className="flex flex-col border-l border-gray-200/80">
                            {sections.map((s) => (
                                <Link
                                    key={s.id}
                                    href={`#${s.id}`}
                                    className={`block px-4 py-2 text-sm border-l-2 transition-all ${
                                        activeSection === s.id
                                            ? 'text-green-600 font-medium border-green-600 bg-green-50/30'
                                            : 'text-gray-500 border-transparent hover:text-gray-900 hover:bg-gray-50/50'
                                    }`}
                                >
                                    {s.title}
                                </Link>
                            ))}
                        </nav>
                    </aside>

                    {/* Content */}
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 min-w-0 bg-white rounded-3xl border border-gray-200/60 p-6 sm:p-10 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                    >
                        <div className="mb-12 border-b border-gray-100 pb-8">
                            <div className="flex items-center gap-2 text-green-600 font-medium text-sm mb-3">
                                <Icon icon="solar:cookie-linear" className="text-lg" />
                                Legal & Compliance
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 mb-2">Cookie Policy</h1>
                            <p className="text-base text-gray-600 mb-4">How we use cookies and similar technologies.</p>
                            <p className="text-sm text-gray-500">Last updated: April 2026</p>
                        </div>

                        <div className="space-y-12 text-sm text-gray-600 leading-relaxed">
                            <section id="what-are-cookies" className="scroll-mt-24 policy-section">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                                    <span className="w-1.5 h-6 bg-green-500 rounded-full"></span> What Are Cookies
                                </h2>
                                <p>Cookies are small text files that are placed on your device. They help us make our website work better and provide a more personalized experience.</p>
                            </section>

                            <section id="how-we-use" className="scroll-mt-24 policy-section">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                                    <span className="w-1.5 h-6 bg-green-500 rounded-full"></span> How We Use Cookies
                                </h2>
                                <p>We use cookies to understand how you interact with our platform and to remember your preferences between visits.</p>
                            </section>

                            <section id="types-of-cookies" className="scroll-mt-24 policy-section">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                                    <span className="w-1.5 h-6 bg-green-500 rounded-full"></span> Types of Cookies We Use
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                                    {[
                                        { icon: "solar:shield-keyhole-linear", title: "Essential", desc: "Strictly necessary for the platform to function." },
                                        { icon: "solar:chart-2-linear", title: "Performance", desc: "Help us analyze how users use the site." },
                                        { icon: "solar:settings-linear", title: "Functional", desc: "Used to enhance functionality and personalization." },
                                        { icon: "solar:tag-linear", title: "Advertising", desc: "Make ads more relevant to your interests." }
                                    ].map((type, i) => (
                                        <div key={i} className="bg-gray-50/50 border border-gray-200/60 rounded-xl p-5">
                                            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                                <Icon icon={type.icon} className="text-green-600" /> {type.title}
                                            </h4>
                                            <p className="text-xs text-gray-500">{type.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* ... Дополнителните секции следат иста структура ... */}

                            <section id="contact" className="scroll-mt-24 policy-section">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                                    <span className="w-1.5 h-6 bg-green-500 rounded-full"></span> Contact Us
                                </h2>
                                <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200/60 inline-block">
                                    <p className="font-medium text-gray-900">Email Address:</p>
                                    <a href="mailto:privacy@rideshare.com" className="text-green-600 underline decoration-green-200 underline-offset-4">privacy@rideshare.com</a>
                                    <p className="font-medium text-gray-900 mt-4">Mailing Address:</p>
                                    <p className="text-gray-500">Sample Street 123, Tech District, CA 94103</p>
                                </div>
                            </section>
                        </div>
                    </motion.article>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-auto border-t border-gray-200/60 bg-white py-8">
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
                        <Link href="/privacyPolicy" className="text-xs text-gray-500  transition-colors">
                            Privacy
                        </Link>
                        <Link href="/contactUs" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
                            Contact
                        </Link>
                    </div>
                </div>
            </footer>

            {/* Back to Top */}
            <AnimatePresence>
                {showBackToTop && (
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 w-12 h-12 bg-white border border-gray-200 shadow-lg text-gray-600 rounded-full flex items-center justify-center hover:text-green-600 z-40"
                    >
                        <Icon icon="solar:alt-arrow-up-linear" className="text-xl" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Cookie Banner */}
            <AnimatePresence>
                {showBanner && (
                    <motion.div
                        initial={{ y: 100, x: '-50%', opacity: 0 }}
                        animate={{ y: 0, x: '-50%', opacity: 1 }}
                        exit={{ y: 100, x: '-50%', opacity: 0 }}
                        className="fixed bottom-6 left-1/2 w-[calc(100%-2rem)] max-w-3xl bg-white border border-gray-200 p-5 rounded-2xl shadow-2xl z-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                                <Icon icon="solar:cookie-linear" className="text-xl text-green-600" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900">We value your privacy</h4>
                                <p className="text-xs text-gray-600 leading-relaxed">We use cookies to enhance your experience and analyze traffic.</p>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button onClick={() => handleBannerChoice('rejected')} className="flex-1 px-4 py-2 text-xs font-medium text-gray-600 bg-gray-50 border rounded-lg hover:bg-gray-100">Reject</button>
                            <button onClick={() => handleBannerChoice('accepted')} className="flex-1 px-4 py-2 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">Accept</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}