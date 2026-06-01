'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';
export default function Login() {
    // Form State
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    // UI State
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });

    // Validation
    const validateEmail = (emailStr: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset errors
        const newErrors = { email: '', password: '' };
        let isValid = true;

        if (!email.trim()) {
            newErrors.email = 'Email address is required.';
            isValid = false;
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email address.';
            isValid = false;
        }

        if (!password.trim()) {
            newErrors.password = 'Password is required.';
            isValid = false;
        }

        setErrors(newErrors);
        if (!isValid) return;

        setIsLoading(true);

            try {
                const res = await fetch("http://localhost:8080/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: email.trim().toLowerCase(),
                        password
                    })
                });

                if (!res.ok) {
                    const msg = await res.text();
                    throw new Error(msg || "Invalid email or password");
                }

                const data = await res.json();
                localStorage.setItem("user", JSON.stringify(data));
                localStorage.setItem("rememberMe", String(rememberMe));
                router.push("/findAride");
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "Login failed");
            } finally {
                setIsLoading(false);
            }

    };

    return (
        <div className="bg-gray-50 text-gray-900 antialiased selection:bg-teal-500 selection:text-white flex flex-col min-h-screen relative">

            {/* Header */}
            <header className="absolute top-0 w-full z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="text-xl font-semibold tracking-tight text-gray-900 hover:opacity-80 transition-opacity">
                        RideShare
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 hidden sm:block">Don't have an account?</span>
                        <Link href="/signUp" className="text-sm font-medium text-gray-900 hover:text-teal-600 transition-colors">
                            Sign up
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center px-4 py-24 sm:px-6 lg:px-8 relative z-10">

                {/* Background decorative elements */}
                <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-50 rounded-full blur-3xl opacity-60 -z-10 pointer-events-none"></div>

                {/* Main Card Container */}
                <div className="max-w-5xl w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200/60 flex flex-col lg:flex-row overflow-hidden">

                    {/* Left Side: Benefits (Desktop only) */}
                    <div className="hidden lg:flex w-5/12 bg-gray-900 p-12 flex-col justify-between relative overflow-hidden text-white">
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 to-transparent pointer-events-none"></div>

                        <div className="relative z-10 mt-12">
                            <h2 className="text-3xl font-semibold tracking-tight text-white mb-4 leading-tight">
                                Welcome back.<br />Ready to ride?
                            </h2>
                            <p className="text-sm text-gray-400 font-normal leading-relaxed mb-12 max-w-sm">
                                Log in to access your upcoming trips, messages, and account settings.
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                                        <Icon icon="solar:tag-price-linear" strokeWidth="1.5" className="text-lg text-teal-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-white mb-1">Find affordable rides</h3>
                                        <p className="text-xs text-gray-400 leading-relaxed">Discover thousands of destinations at low prices, shared by community drivers.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                                        <Icon icon="solar:users-group-rounded-linear" strokeWidth="1.5" className="text-lg text-teal-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-white mb-1">Connect with drivers</h3>
                                        <p className="text-xs text-gray-400 leading-relaxed">Review profiles, ratings, and chat directly with verified members before you go.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                                        <Icon icon="solar:routing-2-linear" strokeWidth="1.5" className="text-lg text-teal-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-white mb-1">Travel smarter</h3>
                                        <p className="text-xs text-gray-400 leading-relaxed">Skip the lines and strict schedules. Enjoy direct, point-to-point journeys.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 mt-12 flex items-center gap-3">
                            <div className="flex -space-x-2">
                                <img src="https://i.pravatar.cc/100?u=1" alt="User" className="w-8 h-8 rounded-full border-2 border-gray-900 object-cover bg-gray-800" />
                                <img src="https://i.pravatar.cc/100?u=2" alt="User" className="w-8 h-8 rounded-full border-2 border-gray-900 object-cover bg-gray-800" />
                                <img src="https://i.pravatar.cc/100?u=3" alt="User" className="w-8 h-8 rounded-full border-2 border-gray-900 object-cover bg-gray-800" />
                            </div>
                            <p className="text-xs text-gray-400 font-medium">Over 10k+ active members</p>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="w-full lg:w-7/12 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                        <div className="max-w-md w-full mx-auto">
                            <div className="text-center sm:text-left mb-8">
                                <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2">Log in to your account</h1>
                                <p className="text-sm text-gray-500">Welcome back! Please enter your details.</p>
                            </div>

                            {/* Social Auth */}
                            <button type="button" className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/80 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors shadow-[0_1px_2px_rgb(0,0,0,0.02)] flex items-center justify-center gap-2 mb-6 group"
                                    onClick={() => {
                                        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
                                    }}  >
                                <svg className="w-4 h-4 transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                                </svg>
                                Continue with Google
                            </button>

                            <div className="relative flex items-center py-2 mb-6">
                                <div className="flex-grow border-t border-gray-100"></div>
                                <span className="mx-4 text-xs font-medium text-gray-400 uppercase tracking-wide">or</span>
                                <div className="flex-grow border-t border-gray-100"></div>
                            </div>

                            {/* Login Form */}
                            <form onSubmit={handleSubmit} className="space-y-4" noValidate>

                                {/* Email */}
                                <div className="space-y-1.5">
                                    <label htmlFor="email" className="block text-xs font-medium text-gray-500">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (errors.email) setErrors({...errors, email: ''});
                                        }}
                                        placeholder="you@example.com"
                                        className={`w-full bg-white border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all text-gray-900 placeholder-gray-300 ${
                                            errors.email
                                                ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500 bg-red-50/30'
                                                : 'border-gray-200 focus:ring-teal-500/20 focus:border-teal-500'
                                        }`}
                                    />
                                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                                </div>

                                {/* Password */}
                                <div className="space-y-1.5">
                                    <label htmlFor="password" className="block text-xs font-medium text-gray-500">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                if (errors.password) setErrors({...errors, password: ''});
                                            }}
                                            placeholder="••••••••"
                                            className={`w-full bg-white border rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all text-gray-900 placeholder-gray-300 ${
                                                errors.password
                                                    ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500 bg-red-50/30'
                                                    : 'border-gray-200 focus:ring-teal-500/20 focus:border-teal-500'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className={`absolute right-3 top-1/2 -translate-y-1/2 hover:text-gray-600 focus:outline-none flex items-center justify-center transition-colors ${showPassword ? 'text-teal-600' : 'text-gray-400'}`}
                                        >
                                            <Icon icon={showPassword ? "solar:eye-closed-linear" : "solar:eye-linear"} strokeWidth="1.5" className="text-lg" />
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                                </div>

                                {/* Remember & Forgot Password */}
                                <div className="flex items-center justify-between pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className="relative flex items-center justify-center w-4 h-4 shrink-0">
                                            <input
                                                type="checkbox"
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                                className="peer appearance-none w-4 h-4 border border-gray-200 shadow-sm rounded text-teal-600 checked:bg-teal-600 checked:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer bg-white"
                                            />
                                            <Icon icon="solar:check-read-linear" strokeWidth="2" className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none text-[10px] transition-opacity" />
                                        </div>
                                        <span className="text-xs text-gray-600 font-medium">Remember me</span>
                                    </label>

                                    <Link href="#" className="text-xs font-medium text-teal-600 hover:text-teal-700 transition-colors">
                                        Forgot password?
                                    </Link>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl px-4 py-3 text-sm font-medium transition-colors shadow-sm flex items-center justify-center mt-6 group disabled:opacity-80 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <Icon icon="solar:spinner-linear" className="animate-spin text-lg" />
                                    ) : (
                                        <>
                                            Log In
                                            <Icon icon="solar:arrow-right-linear" strokeWidth="1.5" className="ml-2 opacity-70 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 text-center sm:hidden">
                                <p className="text-sm text-gray-500">
                                    Don't have an account? <Link href="/signUp" className="text-teal-600 font-medium hover:text-teal-700">Sign up</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-auto py-8 text-center">
                <div className="flex items-center justify-center gap-6">
                    <Link href="/privacyPolicy" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Privacy Policy</Link>
                    <Link href="/termsOfService" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Terms of Service</Link>
                    <Link href="/helpCenter" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Help Center</Link>
                </div>
            </footer>
        </div>
    );
}