'use client';

import React, { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AppHeader from '../components/AppHeader';
import AppFooter from "@/app/components/AppFooter";

const CATEGORIES = [
    { icon: 'solar:routing-linear', title: 'Booking a ride', desc: 'Everything about finding, reserving, and managing your trip as a passenger.' },
    { icon: 'solar:add-circle-linear', title: 'Publishing a ride', desc: 'Learn how to list your journey, set prices, and manage passenger requests.' },
    { icon: 'solar:wallet-linear', title: 'Payments & Refunds', desc: 'Details on how payments are processed, our fees, and getting your money back.' },
    { icon: 'solar:user-circle-linear', title: 'Account & Login', desc: 'Help with passwords, managing your profile, ratings, and account settings.' },
    { icon: 'solar:shield-check-linear', title: 'Safety & Trust', desc: 'Our guidelines, ID verification, and what to do if you encounter a problem.' },
    { icon: 'solar:close-circle-linear', title: 'Cancellations', desc: 'Understand our cancellation policy, penalties, and how to cancel a booking.' }
];

const FAQS = [
    {
        q: 'How do I book a ride?',
        a: 'To book a ride, enter your departure and destination cities along with your travel date on our homepage. Browse the available drivers, pick the one that suits you best, and click "Book". You\'ll receive a confirmation instantly.'
    },
    {
        q: 'How do I cancel a booking?',
        a: 'Go to your "My Rides" section in the account dashboard, select the trip you wish to cancel, and click "Cancel Booking". Please review our cancellation policy to see if you are eligible for a full or partial refund.'
    },
    {
        q: 'How do I contact a driver?',
        a: 'Once your booking is confirmed, you will be able to message the driver directly through our internal chat system. You can access this by tapping on your scheduled ride in the mobile app or website.'
    },
    {
        q: 'How and when do drivers get paid?',
        a: 'Payments are securely held until the ride is completed. Afterward, funds are automatically transferred to the driver\'s linked bank account or payout method within 2-4 business days.'
    }
];

export default function HelpCenterPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Filter FAQs based on search
    const filteredFaqs = FAQS.filter(faq =>
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const handleSupportSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            (e.target as HTMLFormElement).reset();
        }, 2000);
    };

    return (
        <div className="bg-gray-50 text-gray-900 antialiased min-h-screen selection:bg-teal-500 selection:text-white flex flex-col">

            {/* --- Navigation --- */}
            <AppHeader />

            <main className="flex-grow">
                {/* --- Hero Section --- */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative pt-24 pb-20 flex flex-col items-center justify-center text-center px-4 overflow-hidden"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-teal-50 rounded-full blur-3xl opacity-60 -z-10 pointer-events-none"></div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-600 text-xs font-medium mb-6">
                        <Icon icon="solar:help-linear" />
                        Help Center
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tighter text-gray-900 mb-4 max-w-3xl leading-tight">
                        How can we help you?
                    </h1>

                    {/* Search Bar */}
                    <div className="w-full max-w-2xl relative mt-8 z-10">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Icon icon="solar:magnifer-linear" className="text-xl text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-gray-200/80 text-gray-900 text-base rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm placeholder:text-gray-400"
                            placeholder="Search for questions, topics, or keywords..."
                        />
                    </div>
                </motion.section>

                {/* --- Categories Section --- */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="py-20 bg-white border-y border-gray-200/50"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl font-medium tracking-tight text-gray-900 mb-3">Browse by Topic</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {CATEGORIES.map((cat, i) => (
                                <Link href="#faq-section" key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:bg-gray-50/80 transition-all group">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center mb-4 text-teal-600 shadow-sm group-hover:scale-105 transition-transform text-xl">
                                        <Icon icon={cat.icon} />
                                    </div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">{cat.title}</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed">{cat.desc}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* --- FAQ Section --- */}
                <motion.section
                    id="faq-section"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="py-24 bg-gray-50"
                >
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-2xl font-medium tracking-tight text-gray-900">Common Questions</h2>
                        </div>

                        <div className="space-y-3">
                            {filteredFaqs.length > 0 ? (
                                filteredFaqs.map((faq, index) => {
                                    // Use original index to keep track correctly even when filtered
                                    const actualIndex = FAQS.indexOf(faq);
                                    const isOpen = openFaqIndex === actualIndex;

                                    return (
                                        <div key={actualIndex} className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden transition-colors hover:border-gray-300">
                                            <button
                                                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                                                onClick={() => toggleFaq(actualIndex)}
                                            >
                                                <span className="text-sm font-medium text-gray-900">{faq.q}</span>
                                                <Icon
                                                    icon="solar:alt-arrow-down-linear"
                                                    className={`text-lg text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                                />
                                            </button>
                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                                                            {faq.a}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-8 text-sm text-gray-500">
                                    No matching questions found for "{searchQuery}".
                                </div>
                            )}
                        </div>
                    </div>
                </motion.section>

                {/* --- Contact Form & Links Section --- */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="py-24 bg-white border-y border-gray-200/50"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

                            {/* Left: Text and Links */}
                            <div className="lg:sticky lg:top-32">
                                <h2 className="text-3xl font-medium tracking-tight text-gray-900 mb-4">Still need help?</h2>
                                <p className="text-sm text-gray-500 mb-10 leading-relaxed max-w-md">Can't find the answer you're looking for? Send our support team a message or use our quick links to navigate.</p>

                                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Quick Links</h3>
                                <div className="space-y-3">
                                    {[
                                        { icon: 'solar:magnifer-linear', text: 'Find a Ride' },
                                        { icon: 'solar:add-circle-linear', text: 'Publish a Ride' },
                                        { icon: 'solar:user-circle-linear', text: 'Account Login' }
                                    ].map((link, i) => (
                                        <Link href="#" key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-teal-600 shadow-sm text-xl">
                                                    <Icon icon={link.icon} />
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{link.text}</span>
                                            </div>
                                            <Icon icon="solar:arrow-right-linear" className="text-xl text-gray-400 group-hover:text-teal-600 transition-colors" />
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Contact Form */}
                            <div className="bg-white rounded-2xl border border-gray-200/60 shadow-[0_4px_24px_rgb(0,0,0,0.03)] p-6 md:p-8">
                                <div className="mb-8">
                                    <h3 className="text-xl font-medium tracking-tight text-gray-900 mb-1">Contact Support</h3>
                                    <p className="text-sm text-gray-500">We typically reply within 24 hours.</p>
                                </div>

                                <form onSubmit={handleSupportSubmit} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="block text-xs font-medium text-gray-700">Full Name</label>
                                        <input type="text" required className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-gray-400" placeholder="Jane Doe" />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-xs font-medium text-gray-700">Email Address</label>
                                        <input type="email" required className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-gray-400" placeholder="jane@example.com" />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-xs font-medium text-gray-700">Message</label>
                                        <textarea required rows={5} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none placeholder:text-gray-400" placeholder="Please describe your issue in detail..."></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className={`w-full py-3 rounded-xl text-sm font-medium transition-all mt-2 flex items-center justify-center gap-2 ${
                                            isSubmitted ? 'bg-teal-600 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white shadow-sm'
                                        }`}
                                    >
                                        {isSubmitted ? (
                                            <><Icon icon="solar:check-circle-linear" className="text-lg" /> Message Sent</>
                                        ) : (
                                            'Send Message'
                                        )}
                                    </button>
                                </form>
                            </div>

                        </div>
                    </div>
                </motion.section>
            </main>

            {/* --- Footer --- */}
            <AppFooter />
        </div>
    );
}