'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AppHeader from '../components/AppHeader';

export default function ContactPage() {
    // Состојби за формата
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        subject: '',
        message: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Валидација на емаил
    const validateEmail = (emailStr: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
    };

    // Хендлер за промена на инпут
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));

        // Бришење на грешката додека корисникот пишува
        if (errors[id]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[id];
                return newErrors;
            });
        }
    };

    // Хендлер за праќање на формата
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
        if (!formData.email.trim()) {
            newErrors.email = 'Email address is required.';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }
        if (!formData.subject) newErrors.subject = 'Please select a subject.';
        if (!formData.message.trim() || formData.message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters long.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Симулација на API повикот
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSuccess(true);
    };

    const resetForm = () => {
        setFormData({ fullName: '', email: '', subject: '', message: '' });
        setIsSuccess(false);
        setErrors({});
    };

    return (
        <div className="bg-gray-50 text-gray-900 antialiased selection:bg-teal-500 selection:text-white flex flex-col min-h-screen relative">

            {/* Header */}
            <AppHeader />



            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20 relative z-10">

                {/* Decorative BG */}
                <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-50 rounded-full blur-3xl opacity-60 -z-10 pointer-events-none"></div>

                {/* Hero Section */}
                <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
                    <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-gray-900 mb-4">Contact Us</h1>
                    <p className="text-base text-gray-500 leading-relaxed">
                        We're here to help and answer your questions. Fill out the form below or use our quick support channels.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* Left Side: Contact Form */}
                    <div className="lg:col-span-7 xl:col-span-8">
                        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200/60 p-6 sm:p-8 overflow-hidden relative min-h-[500px]">

                            <AnimatePresence>
                                {isSuccess ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center p-8 text-center"
                                    >
                                        <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-6">
                                            <Icon icon="solar:check-circle-linear" className="text-3xl text-teal-600" />
                                        </div>
                                        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2">Message Sent!</h2>
                                        <p className="text-sm text-gray-500 max-w-sm mb-8">
                                            Thank you for reaching out. Your message has been received, and our team will get back to you within 24 hours.
                                        </p>
                                        <button onClick={resetForm} className="bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200 rounded-xl px-6 py-2.5 text-sm font-medium transition-colors">
                                            Send another message
                                        </button>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            {/* Full Name */}
                                            <div className="space-y-1.5">
                                                <label htmlFor="fullName" className="block text-xs font-medium text-gray-500">Full Name</label>
                                                <input
                                                    type="text" id="fullName" value={formData.fullName} onChange={handleChange}
                                                    placeholder="Jane Doe"
                                                    className={`w-full bg-white border ${errors.fullName ? 'border-red-300 bg-red-50/30' : 'border-gray-200'} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${errors.fullName ? 'focus:ring-red-500/20 focus:border-red-500' : 'focus:ring-teal-500/20 focus:border-teal-500'} transition-all text-gray-900 placeholder-gray-300`}
                                                />
                                                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                                            </div>

                                            {/* Email */}
                                            <div className="space-y-1.5">
                                                <label htmlFor="email" className="block text-xs font-medium text-gray-500">Email Address</label>
                                                <input
                                                    type="email" id="email" value={formData.email} onChange={handleChange}
                                                    placeholder="jane@example.com"
                                                    className={`w-full bg-white border ${errors.email ? 'border-red-300 bg-red-50/30' : 'border-gray-200'} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${errors.email ? 'focus:ring-red-500/20 focus:border-red-500' : 'focus:ring-teal-500/20 focus:border-teal-500'} transition-all text-gray-900 placeholder-gray-300`}
                                                />
                                                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                                            </div>
                                        </div>

                                        {/* Subject */}
                                        <div className="space-y-1.5">
                                            <label htmlFor="subject" className="block text-xs font-medium text-gray-500">Subject</label>
                                            <div className="relative">
                                                <select
                                                    id="subject" value={formData.subject} onChange={handleChange}
                                                    className={`w-full bg-white border ${errors.subject ? 'border-red-300 bg-red-50/30' : 'border-gray-200'} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${errors.subject ? 'focus:ring-red-500/20 focus:border-red-500' : 'focus:ring-teal-500/20 focus:border-teal-500'} transition-all text-gray-900 appearance-none cursor-pointer`}
                                                >
                                                    <option value="" disabled>Select a topic...</option>
                                                    <option value="account">Account & Profile</option>
                                                    <option value="booking">Booking a Ride</option>
                                                    <option value="publishing">Publishing a Ride</option>
                                                    <option value="payment">Payments & Refunds</option>
                                                    <option value="safety">Trust & Safety</option>
                                                    <option value="other">Other</option>
                                                </select>
                                                <Icon icon="solar:alt-arrow-down-linear" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            </div>
                                            {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
                                        </div>

                                        {/* Message */}
                                        <div className="space-y-1.5">
                                            <label htmlFor="message" className="block text-xs font-medium text-gray-500">Message</label>
                                            <textarea
                                                id="message" rows={5} value={formData.message} onChange={handleChange}
                                                placeholder="How can we help you?"
                                                className={`w-full bg-white border ${errors.message ? 'border-red-300 bg-red-50/30' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ${errors.message ? 'focus:ring-red-500/20 focus:border-red-500' : 'focus:ring-teal-500/20 focus:border-teal-500'} transition-all text-gray-900 placeholder-gray-300 resize-none`}
                                            ></textarea>
                                            {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                                        </div>

                                        {/* Submit Button */}
                                        <div className="pt-2">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full sm:w-auto min-w-[160px] bg-gray-900 hover:bg-gray-800 text-white rounded-xl px-6 py-3 text-sm font-medium transition-all shadow-sm flex items-center justify-center group relative overflow-hidden"
                                            >
                                                {isSubmitting ? (
                                                    <Icon icon="solar:spinner-linear" className="animate-spin text-lg" />
                                                ) : (
                                                    <span className="flex items-center gap-2">
                                                        Send Message
                                                        <Icon icon="solar:plain-2-linear" className="opacity-70 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Side: Contact Info & Support */}
                    <div className="lg:col-span-5 xl:col-span-4 space-y-6">

                        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200/60 p-6 sm:p-8">
                            <h3 className="text-lg font-semibold tracking-tight text-gray-900 mb-6">Contact Information</h3>
                            <div className="space-y-5">
                                {[
                                    { icon: "solar:letter-linear", label: "Email us", val: "support@rideshare.com", link: "mailto:support@rideshare.com" },
                                    { icon: "solar:phone-calling-linear", label: "Call us", val: "+389 (0) 2 312 3456" },
                                    { icon: "solar:map-point-linear", label: "Office location", val: "Skopje, North Macedonia" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 text-teal-600">
                                            <Icon icon={item.icon} className="text-xl" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-0.5">{item.label}</p>
                                            {item.link ? (
                                                <a href={item.link} className="text-sm font-medium text-gray-900 hover:text-teal-600 transition-colors">{item.val}</a>
                                            ) : (
                                                <p className="text-sm font-medium text-gray-900">{item.val}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="bg-gray-100 rounded-3xl h-48 relative overflow-hidden border border-gray-200/60 flex items-center justify-center group cursor-pointer">
                            <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center relative z-10 text-teal-600 group-hover:scale-110 transition-transform">
                                <Icon icon="solar:routing-2-linear" className="text-2xl" />
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 text-xs font-medium text-gray-700 text-center shadow-sm z-10">
                                View on Maps
                            </div>
                        </div>

                        {/* FAQ & Live Chat */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 flex flex-col items-start justify-between shadow-sm">
                                <Icon icon="solar:question-circle-linear" className="text-2xl text-gray-400 mb-3" />
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Looking for quick answers?</h4>
                                    <p className="text-xs text-gray-500 mb-4">Browse our comprehensive guides and articles.</p>
                                    <Link href="/helpCenter" className="text-xs font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1 group">
                                        Visit Help Center
                                        <Icon icon="solar:arrow-right-linear" className="group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 flex flex-col items-start justify-between shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-bl-full pointer-events-none"></div>
                                <Icon icon="solar:chat-round-line-linear" className="text-2xl text-teal-400 mb-3" />
                                <div className="relative z-10 w-full">
                                    <h4 className="text-sm font-semibold text-white mb-1">Need immediate assistance?</h4>
                                    <p className="text-xs text-gray-400 mb-4">Chat with our support team in real-time.</p>
                                    <button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-lg px-4 py-2 text-xs font-medium transition-colors flex items-center justify-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                        Live Chat
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-auto border-t border-gray-200/60 bg-white pt-10 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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
                        <Link href="/contactUs" className="text-xs text-gray-900 font-medium transition-colors">
                            Contact
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}