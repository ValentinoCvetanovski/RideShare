'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { motion, useInView, useAnimation } from 'framer-motion';
import AppHeader from '../components/AppHeader';

// --- Компонента за Бројач (Statistics) ---
const Counter = ({ target }: { target: number }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const duration = 2000; // 2 секунди
            const increment = target / (duration / 16);

            const timer = setInterval(() => {
                start += increment;
                if (start >= target) {
                    setCount(target);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);
            return () => clearInterval(timer);
        }
    }, [isInView, target]);

    return <span ref={ref}>{count.toLocaleString()}</span>;
};

// --- Компонента за Reveal Animation (Наместо IntersectionObserver во JS) ---
const Reveal = ({ children }: { children: React.ReactNode }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
};

export default function AboutUs() {
    return (
        <div className="bg-gray-50 text-gray-900 font-sans antialiased selection:bg-teal-500 selection:text-white min-h-screen">

            {/* --- Navigation --- */}
            <AppHeader />

            <main>
                {/* --- Hero Section --- */}
                <section className="relative pt-24 pb-20 flex flex-col items-center justify-center text-center px-4 overflow-hidden">
                    <Reveal>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-50 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none"></div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-600 text-xs font-medium mb-6">
                            <Icon icon="solar:info-circle-linear" />
                            Get to know us
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tighter text-gray-900 mb-6 max-w-3xl leading-tight">
                            Connecting people<br className="hidden md:block" /> through travel.
                        </h1>
                        <p className="text-base text-gray-500 max-w-2xl font-normal leading-relaxed">
                            We are building a community where sharing a journey means saving money, reducing emissions, and bringing people closer together.
                        </p>
                    </Reveal>
                </section>

                {/* --- Our Story Section --- */}
                <section className="py-20 bg-white border-y border-gray-200/50">
                    <Reveal>
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <h2 className="text-2xl font-medium tracking-tight text-gray-900 mb-8">Our Story</h2>
                            <div className="space-y-6 text-sm text-gray-600 leading-relaxed max-w-3xl mx-auto text-left md:text-center">
                                <p>
                                    RideShare was born out of a simple observation: millions of empty seats travel across cities every day, while countless people are searching for convenient, affordable ways to reach their destinations.
                                </p>
                                <p>
                                    Today, we focus on creating a secure, user-friendly platform that prioritizes affordable and social travel. We aren't just moving people from point A to point B; we are fostering connections.
                                </p>
                            </div>
                        </div>
                    </Reveal>
                </section>

                {/* --- Mission & Vision --- */}
                <section className="py-24 bg-gray-50">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Reveal>
                                <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm hover:shadow-md transition-all h-full">
                                    <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center mb-6">
                                        <Icon icon="solar:target-linear" className="text-2xl text-teal-600" />
                                    </div>
                                    <h3 className="text-xl font-medium tracking-tight text-gray-900 mb-3">Our Mission</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        To make travel affordable, accessible, and enjoyable for everyone by unlocking the potential of empty seats on the road.
                                    </p>
                                </div>
                            </Reveal>
                            <Reveal>
                                <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm hover:shadow-md transition-all h-full">
                                    <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center mb-6">
                                        <Icon icon="solar:eye-linear" className="text-2xl text-teal-600" />
                                    </div>
                                    <h3 className="text-xl font-medium tracking-tight text-gray-900 mb-3">Our Vision</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        To create a deeply connected travel community where shared journeys lead to a more sustainable, social, and efficient world.
                                    </p>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* --- Statistics (Animated) --- */}
                <section className="py-24 bg-gray-900 text-white">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-gray-800">
                            <div className="pt-8 md:pt-0">
                                <div className="text-4xl font-semibold tracking-tighter mb-2 text-teal-500">
                                    <Counter target={10000} />+
                                </div>
                                <p className="text-sm text-gray-400 font-medium uppercase tracking-widest">Shared Rides</p>
                            </div>
                            <div className="pt-8 md:pt-0">
                                <div className="text-4xl font-semibold tracking-tighter mb-2 text-teal-500">
                                    <Counter target={5000} />+
                                </div>
                                <p className="text-sm text-gray-400 font-medium uppercase tracking-widest">Active Users</p>
                            </div>
                            <div className="pt-8 md:pt-0">
                                <div className="text-4xl font-semibold tracking-tighter mb-2 text-teal-500">
                                    <Counter target={120} />+
                                </div>
                                <p className="text-sm text-gray-400 font-medium uppercase tracking-widest">Connected Cities</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- Team Section --- */}
                <section className="py-24 bg-white">
                    <Reveal>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-2xl font-medium tracking-tight text-gray-900 mb-3">Meet the Team</h2>
                                <p className="text-sm text-gray-500 max-w-xl mx-auto">The people working behind the scenes.</p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {[
                                    { name: 'Elena Rostova', role: 'Founder & CEO', id: '1' },
                                    { name: 'Marcus Chen', role: 'Head of Engineering', id: '2' },
                                    { name: 'Sarah Jenkins', role: 'Product Designer', id: '3' },
                                    { name: 'David Miller', role: 'Operations Manager', id: '4' }
                                ].map((member) => (
                                    <div key={member.id} className="flex flex-col items-center group text-center">
                                        <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden shadow-sm">
                                            <img
                                                src={`https://i.pravatar.cc/150?u=${member.id}`}
                                                alt={member.name}
                                                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                                            />
                                        </div>
                                        <h4 className="text-sm font-medium text-gray-900">{member.name}</h4>
                                        <p className="text-xs text-gray-500 mt-1">{member.role}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                </section>
            </main>

            {/* --- Full Footer --- */}
            <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        {/* Column 1: Top Routes */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-4 tracking-tight">Top routes</h4>
                            <ul className="space-y-3">
                                <li><Link href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">San Francisco → LA</Link></li>
                                <li><Link href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">New York → Boston</Link></li>
                                <li><Link href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Austin → Houston</Link></li>
                            </ul>
                        </div>

                        {/* Column 2: About */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-4 tracking-tight">About</h4>
                            <ul className="space-y-3">
                                <li><Link href="/howItWorks" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">How it works</Link></li>
                                <li><Link href="/about" className="text-sm text-teal-600 font-medium transition-colors">About us</Link></li>
                                <li><Link href="/careers" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Careers</Link></li>
                            </ul>
                        </div>

                        {/* Column 3: Help */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-4 tracking-tight">Help</h4>
                            <ul className="space-y-3">
                                <li><Link href="/helpCenter" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Help Center</Link></li>
                                <li><Link href="/trustAndSafety" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Trust & Safety</Link></li>
                                <li><Link href="/contactUs" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Contact us</Link></li>
                            </ul>
                        </div>

                        {/* Column 4: Legal */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-4 tracking-tight">Legal</h4>
                            <ul className="space-y-3">
                                <li><Link href="/termsOfService" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Terms of Service</Link></li>
                                <li><Link href="/privacyPolicy" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/cookiePolicy" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Cookie Policy</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar: Logo, Socials, Copyright */}
                    <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-xl font-medium tracking-tighter text-gray-900 flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                            <Icon icon="solar:routing-2-linear" strokeWidth={1.5} />
                            RideShare
                        </div>

                        {/* Social Icons */}
                        <div className="flex items-center gap-4">
                            <Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                                <Icon icon="solar:facebook-linear" className="text-xl" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                                <Icon icon="solar:twitter-linear" className="text-xl" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                                <Icon icon="solar:instagram-linear" className="text-xl" />
                            </Link>
                        </div>

                        <p className="text-xs text-gray-400">© 2026 RideShare Inc. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}