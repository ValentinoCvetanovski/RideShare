'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link'; // Поправено: треба да е next/link
import { motion, Variants } from 'framer-motion';
import AppHeader from '../components/AppHeader';

// Поправено: Додаден експлицитен тип за да не се буни TypeScript за 'ease'
const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1] // Ова сега е валидно со Variants типот
        }
    }
};

export default function TrustAndSafetyPage() {
    return (
        <div className="bg-gray-50 text-gray-900 antialiased selection:bg-emerald-500 selection:text-white flex flex-col min-h-screen relative overflow-x-hidden">

            {/* --- Header --- */}
            <AppHeader />

            {/* --- Main Content --- */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20 relative z-10">

                <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-50 rounded-full blur-3xl opacity-60 -z-10 pointer-events-none"></div>

                {/* Hero Section */}
                <motion.div
                    variants={fadeUpVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-20 lg:mb-28 pt-4"
                >
                    <div className="w-16 h-16 bg-white shadow-sm border border-gray-200/60 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Icon icon="solar:shield-check-linear" strokeWidth={1.5} className="text-3xl text-emerald-600" />
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 mb-6">Trust & Safety</h1>
                    <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
                        Your safety is our priority. We've built robust systems and community guidelines to ensure every journey is secure, reliable, and comfortable.
                    </p>
                </motion.div>

                <div className="space-y-24 lg:space-y-32">

                    {/* Safety Features */}
                    <motion.section
                        variants={fadeUpVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-3">Built for peace of mind</h2>
                            <p className="text-sm text-gray-500">Core features that keep our community secure.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    <Icon icon="solar:user-id-linear" strokeWidth={1.5} className="text-xl" />
                                </div>
                                <h3 className="text-base font-semibold tracking-tight text-gray-900 mb-2">Verified Profiles</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">We verify government IDs, phone numbers, and email addresses to ensure you know exactly who you're traveling with.</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    <Icon icon="solar:star-linear" strokeWidth={1.5} className="text-xl" />
                                </div>
                                <h3 className="text-base font-semibold tracking-tight text-gray-900 mb-2">Ratings & Reviews</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">Our peer-to-peer review system builds accountability. Check a user's reputation before booking a seat.</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    <Icon icon="solar:letter-linear" strokeWidth={1.5} className="text-xl" />
                                </div>
                                <h3 className="text-base font-semibold tracking-tight text-gray-900 mb-2">Secure Communication</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">Chat securely within our app. Your personal phone number is kept private until you choose to share it.</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    <Icon icon="solar:map-point-linear" strokeWidth={1.5} className="text-xl" />
                                </div>
                                <h3 className="text-base font-semibold tracking-tight text-gray-900 mb-2">Trip Transparency</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">Clear itineraries, precise meeting points, and upfront pricing mean no surprises on the day of your journey.</p>
                            </div>
                        </div>
                    </motion.section>

                    {/* How We Keep You Safe & User Guidelines */}
                    <motion.div
                        variants={fadeUpVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start"
                    >
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-8">How we keep you safe</h2>
                            <div className="relative border-l border-gray-200 ml-3 space-y-8 pb-4">
                                {[
                                    { title: "1. Create a verified account", desc: "Submit your details for our secure verification process to join the community." },
                                    { title: "2. Choose trusted drivers", desc: "Review profiles, past trip ratings, and vehicle details before making a booking." },
                                    { title: "3. Communicate securely", desc: "Use our in-app messaging to finalize details without revealing contact info." },
                                    { title: "4. Travel with confidence", desc: "Enjoy your ride knowing our support team is available if you need them.", last: true }
                                ].map((step, i) => (
                                    <div key={i} className="relative pl-8">
                                        <div className={`absolute -left-1.5 top-1.5 w-3 h-3 ${step.last ? 'bg-gray-200' : 'bg-emerald-600'} rounded-full ring-4 ring-gray-50`}></div>
                                        <h4 className="text-sm font-semibold text-gray-900 mb-1">{step.title}</h4>
                                        <p className="text-sm text-gray-500">{step.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl border border-gray-200/60 p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <Icon icon="solar:users-group-rounded-linear" strokeWidth={1.5} className="text-xl text-gray-600" />
                            </div>
                            <h2 className="text-xl font-semibold tracking-tight text-gray-900 mb-6">Community Guidelines</h2>
                            <p className="text-sm text-gray-500 mb-8">A safe platform relies on mutual respect.</p>
                            <ul className="space-y-4">
                                {[
                                    { b: "Be respectful:", t: "Treat fellow travelers with courtesy and kindness at all times." },
                                    { b: "Provide accurate info:", t: "Keep your profile, vehicle details, and route honest." },
                                    { b: "Follow the rules:", t: "Adhere to local traffic laws and our terms." },
                                    { b: "Be punctual:", t: "Respect everyone's time by arriving promptly." }
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Icon icon="solar:check-circle-linear" strokeWidth={1.5} className="text-lg text-emerald-600 mt-0.5 shrink-0" />
                                        <span className="text-sm text-gray-600"><strong>{item.b}</strong> {item.t}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>

                    {/* Reporting & Support */}
                    <motion.section
                        variants={fadeUpVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <div className="bg-emerald-950 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden text-white">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600 rounded-full blur-3xl opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
                            <div className="relative z-10 max-w-xl">
                                <h2 className="text-2xl font-semibold tracking-tight mb-3">We're here to help</h2>
                                <p className="text-sm text-emerald-100/80 leading-relaxed">
                                    If something doesn't feel right, let us know immediately. Our team is here 24/7.
                                </p>
                            </div>
                            <button className="relative z-10 w-full md:w-auto bg-white text-emerald-950 hover:bg-gray-50 rounded-xl px-6 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                <Icon icon="solar:danger-triangle-linear" strokeWidth={1.5} />
                                Report a problem
                            </button>
                        </div>
                    </motion.section>

                </div>
            </main>

            {/* Footer */}
            <footer className="mt-auto border-t border-gray-200/60 bg-white pt-10 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-400">© 2026 RideShare Inc. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link href="/aboutUs" className="text-xs text-gray-500 hover:text-gray-900">About</Link>
                        <Link href="/helpCenter" className="text-xs text-gray-500 hover:text-gray-900">Help</Link>
                        <Link href="/trustAndSafety" className="text-xs text-emerald-900 font-medium">Trust & Safety</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}