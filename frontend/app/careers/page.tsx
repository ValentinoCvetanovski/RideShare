'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AppHeader from "@/app/components/AppHeader";
import AppFooter from "@/app/components/AppFooter";

const POSITIONS = [
    {
        title: 'Frontend Developer Intern',
        location: 'Remote / Skopje',
        type: 'Internship',
        description: "Help us build accessible and performant user interfaces. You'll work closely with our senior engineers on our core web application."
    },
    {
        title: 'Senior Backend Engineer',
        location: 'Paris, France',
        type: 'Full-time',
        description: "Design and scale our matching algorithms. You will architect high-traffic microservices handling millions of ride requests."
    },
    {
        title: 'Product Designer',
        location: 'Remote',
        type: 'Full-time',
        description: "Shape the future of our mobile experience. Work across the entire product lifecycle from research to high-fidelity prototyping."
    },
    {
        title: 'Customer Success Agent',
        location: 'Remote / Madrid',
        type: 'Part-time',
        description: "Be the voice of RideShare. Support our community by resolving issues, answering queries, and ensuring safe journeys."
    }
];

export default function CareersPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState('');
    const [fileName, setFileName] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const openModal = (position: string) => {
        setSelectedPosition(position);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsSubmitted(false);
        setFileName('');
        document.body.style.overflow = 'unset';
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => {
            closeModal();
        }, 2000);
    };

    return (
        <div className="bg-gray-50 text-gray-900 antialiased min-h-screen selection:bg-teal-500 selection:text-white">

            {/* --- Navigation --- */}
            <AppHeader />

            {/* --- Hero Section --- */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative pt-24 pb-20 flex flex-col items-center justify-center text-center px-4 overflow-hidden"
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-teal-50 rounded-full blur-3xl opacity-60 -z-10 pointer-events-none"></div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-600 text-xs font-medium mb-6">
                    <Icon icon="solar:users-group-rounded-linear" />
                    We&apos;re hiring
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tighter text-gray-900 mb-6 max-w-3xl leading-tight">
                    Careers
                </h1>
                <p className="text-base md:text-lg text-gray-500 max-w-2xl font-normal leading-relaxed">
                    Join our team and build the future of travel. We&apos;re looking for passionate people to help us make transportation more accessible and sustainable.
                </p>
            </motion.section>

            {/* --- Why Work With Us --- */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="py-20 bg-white border-y border-gray-200/50"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl font-medium tracking-tight text-gray-900 mb-3">Why work with us?</h2>
                        <p className="text-sm text-gray-500 max-w-xl mx-auto">Discover the perks of being part of our journey.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: "solar:home-wifi-linear", title: "Flexible Work", text: "Work from anywhere or join us in our modern offices." },
                            { icon: "solar:graph-up-linear", title: "Growth Opportunities", text: "Dedicated budgets for learning and clear paths for advancement." },
                            { icon: "solar:cup-star-linear", title: "Friendly Team", text: "Join a diverse group of passionate individuals who support each other." },
                            { icon: "solar:earth-linear", title: "Real-world Impact", text: "Build features that directly reduce carbon emissions." }
                        ].map((benefit, i) => (
                            <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center mb-4 text-teal-600 shadow-sm text-xl">
                                    <Icon icon={benefit.icon} />
                                </div>
                                <h3 className="text-sm font-medium text-gray-900 mb-2">{benefit.title}</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">{benefit.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* --- Open Positions --- */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl font-medium tracking-tight text-gray-900">Open Positions</h2>
                        <span className="text-xs font-medium text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">{POSITIONS.length} Roles</span>
                    </div>

                    <div className="flex flex-col bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden divide-y divide-gray-100">
                        {POSITIONS.map((job, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="p-6 md:p-8 hover:bg-gray-50/50 transition-colors group flex flex-col md:flex-row md:items-center justify-between gap-6"
                            >
                                <div className="flex-1">
                                    <h3 className="text-base font-medium text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">{job.title}</h3>
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-3">
                                        <span className="flex items-center gap-1.5"><Icon icon="solar:map-point-linear" /> {job.location}</span>
                                        <span className="flex items-center gap-1.5"><Icon icon="solar:clock-circle-linear" /> {job.type}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">{job.description}</p>
                                </div>
                                <button
                                    onClick={() => openModal(job.title)}
                                    className="shrink-0 bg-white border border-gray-200 text-gray-900 hover:bg-gray-900 hover:text-white hover:border-gray-900 px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm w-full md:w-auto"
                                >
                                    Apply Now
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA Section --- */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="py-24 bg-gray-900 text-white relative overflow-hidden"
            >
                <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-4">Don&apos;t see a role that fits you?</h2>
                    <p className="text-sm text-gray-400 mb-8 max-w-lg mx-auto">We are always on the lookout for talented individuals. Send us your resume.</p>
                    <button
                        onClick={() => openModal('Open Application')}
                        className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-900 px-6 py-3 rounded-xl text-sm font-medium transition-colors"
                    >
                        Send Open Application
                        <Icon icon="solar:arrow-right-linear" />
                    </button>
                </div>
            </motion.section>

            {/* --- Application Modal --- */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8"
                        >
                            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900">
                                <Icon icon="solar:close-circle-linear" className="text-2xl" />
                            </button>

                            <div className="mb-6">
                                <h3 className="text-xl font-medium text-gray-900 mb-1">Apply for</h3>
                                <p className="text-sm font-medium text-teal-600 bg-teal-50 inline-block px-3 py-1 rounded-md border border-teal-100">
                                    {selectedPosition}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="First Name" required className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none" />
                                    <input type="text" placeholder="Last Name" required className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none" />
                                </div>
                                <input type="email" placeholder="Email Address" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none" />

                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-200 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <Icon icon="solar:document-add-linear" className="text-2xl text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500">
                                        {fileName ? <span className="text-teal-600 font-medium">{fileName}</span> : "Click to upload CV"}
                                    </p>
                                    <input type="file" className="hidden" onChange={handleFileChange} />
                                </label>

                                <button
                                    type="submit"
                                    className={`w-full py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                        isSubmitted ? 'bg-teal-600 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'
                                    }`}
                                >
                                    {isSubmitted ? (
                                        <><Icon icon="solar:check-circle-linear" /> Application Sent</>
                                    ) : 'Submit Application'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <AppFooter />
        </div>
    );
}