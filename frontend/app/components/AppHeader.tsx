'use client';

import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
    id?: number;
    fullName?: string;
    email?: string;
    avatar?: string;
    role?: string;
};

type Notification = {
    id: number;
    title: string;
    message: string;
    read: boolean;
    createdAt?: string;
    booking?: {
        id: number;
        seatsBooked: number;
        pickupLocation?: string;
        passengerNote?: string;
        passenger?: {
            fullName?: string;
            email?: string;
        };
        ride?: {
            fromCity?: string;
            toCity?: string;
            date?: string;
            depTime?: string;
        };
    };
};

export default function AppHeader() {
    const router = useRouter();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const [isMessagesOpen, setIsMessagesOpen] = useState(false);
    const [messageUsers, setMessageUsers] = useState<User[]>([]);
    const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
    const [userSearch, setUserSearch] = useState('');

    const [loadingActionId, setLoadingActionId] = useState<number | null>(null);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const loadNotifications = async (userId: number) => {
        try {
            const res = await fetch(`http://localhost:8080/api/notifications/user/${userId}`, {
                cache: 'no-store',
            });

            if (!res.ok) return;

            const data = await res.json();
            setNotifications(data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const loadMessageUsers = async (userId: number) => {
        try {
            const res = await fetch(`http://localhost:8080/api/messages/users/${userId}`, {
                cache: 'no-store',
            });

            if (!res.ok) return;

            const data = await res.json();
            setMessageUsers(data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const rawUser = localStorage.getItem('user');

        if (!rawUser) {
            setIsLoggedIn(false);
            setUser(null);
            return;
        }

        const parsedUser: User = JSON.parse(rawUser);
        setUser(parsedUser);
        setIsLoggedIn(true);

        if (parsedUser.id) {
            loadNotifications(parsedUser.id);
            loadMessageUsers(parsedUser.id);

            const interval = setInterval(() => {
                loadNotifications(parsedUser.id!);
                loadMessageUsers(parsedUser.id!);
            }, 10000);

            return () => clearInterval(interval);
        }
    }, []);

    useEffect(() => {
        if (!user?.id) return;

        const query = userSearch.trim();

        if (!query) {
            setSearchedUsers([]);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/api/messages/search?userId=${user.id}&q=${encodeURIComponent(query)}`,
                    { cache: 'no-store' }
                );

                if (!res.ok) return;

                const data = await res.json();
                setSearchedUsers(data || []);
            } catch (err) {
                console.error(err);
            }
        }, 200);

        return () => clearTimeout(timeout);
    }, [userSearch, user?.id]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('rememberMe');
        setIsLoggedIn(false);
        setUser(null);
        router.push('/login');
    };

    const markAsRead = async (notificationId: number) => {
        try {
            const res = await fetch(`http://localhost:8080/api/notifications/${notificationId}/read`, {
                method: 'POST',
            });

            if (!res.ok) return;

            setNotifications((prev) =>
                prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
            );
        } catch (err) {
            console.error(err);
        }
    };

    const handleBookingAction = async (
        notificationId: number,
        bookingId: number,
        action: 'confirm' | 'deny'
    ) => {
        setLoadingActionId(notificationId);

        try {
            const res = await fetch(`http://localhost:8080/api/bookings/${bookingId}/${action}`, {
                method: 'POST',
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || 'Action failed');
            }

            await markAsRead(notificationId);

            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === notificationId
                        ? {
                            ...n,
                            read: true,
                            title: action === 'confirm' ? 'Booking confirmed' : 'Booking denied',
                        }
                        : n
                )
            );
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to update booking');
        } finally {
            setLoadingActionId(null);
        }
    };

    const openMessages = () => {
        setIsMessagesOpen((prev) => !prev);
        setIsNotificationsOpen(false);

        if (user?.id) {
            loadMessageUsers(user.id);
        }
    };

    const openNotifications = () => {
        setIsNotificationsOpen((prev) => !prev);
        setIsMessagesOpen(false);

        if (user?.id) {
            loadNotifications(user.id);
        }
    };

    const openConversation = (otherUserId?: number) => {
        if (!otherUserId) return;
        setIsMessagesOpen(false);
        setUserSearch('');
        router.push(`/messages?userId=${otherUserId}`);
    };

    const usersToShow = userSearch.trim() ? searchedUsers : messageUsers;

    return (
        <header className="sticky top-0 z-[1200] bg-white/80 backdrop-blur-md border-b border-gray-200/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-xl font-semibold tracking-tighter text-gray-900 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-teal-600 flex items-center justify-center text-white">
                            <Icon icon="solar:routing-2-linear" />
                        </div>
                        RideShare
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/findAride" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                            Find a ride
                        </Link>
                        <Link href="/howItWorks" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                            How it works
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {isLoggedIn ? (
                        <>
                            <Link href="/publishAride" className="hidden md:flex items-center gap-2 text-sm font-medium text-teal-600 transition-colors">
                                <Icon icon="solar:add-circle-linear" className="text-lg" />
                                Publish a ride
                            </Link>

                            <Link href="/myBookings" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                                My Bookings
                            </Link>

                            <Link href="/myAccount" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                                My Account
                            </Link>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={openNotifications}
                                    className="relative w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                                >
                                    <Icon icon="solar:bell-linear" className="text-xl" />

                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-rose-600 text-white text-[10px] font-semibold flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {isNotificationsOpen && (
                                    <div className="absolute right-0 mt-3 w-[360px] max-h-[460px] overflow-y-auto bg-white border border-gray-200 rounded-2xl shadow-xl p-3 z-[1300]">
                                        <div className="flex items-center justify-between px-2 py-2">
                                            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                                            <span className="text-xs text-gray-400">{unreadCount} unread</span>
                                        </div>

                                        {notifications.length === 0 ? (
                                            <div className="py-10 text-center">
                                                <Icon icon="solar:bell-off-linear" className="text-3xl text-gray-300 mx-auto mb-2" />
                                                <p className="text-sm text-gray-500">No notifications yet.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {notifications.map((notification) => {
                                                    const booking = notification.booking;

                                                    return (
                                                        <div
                                                            key={notification.id}
                                                            className={`rounded-xl border p-3 ${
                                                                notification.read
                                                                    ? 'border-gray-100 bg-gray-50'
                                                                    : 'border-teal-100 bg-teal-50/40'
                                                            }`}
                                                        >
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div>
                                                                    <p className="text-sm font-semibold text-gray-900">
                                                                        {notification.title}
                                                                    </p>
                                                                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                                                        {notification.message}
                                                                    </p>
                                                                </div>

                                                                {!notification.read && (
                                                                    <span className="w-2 h-2 rounded-full bg-teal-600 mt-1.5" />
                                                                )}
                                                            </div>

                                                            {booking && !notification.read && (
                                                                <div className="flex gap-2 mt-3">
                                                                    <button
                                                                        type="button"
                                                                        disabled={loadingActionId === notification.id}
                                                                        onClick={() =>
                                                                            handleBookingAction(notification.id, booking.id, 'confirm')
                                                                        }
                                                                        className="flex-1 px-3 py-2 rounded-lg bg-teal-600 text-white text-xs font-medium hover:bg-teal-700 disabled:opacity-60"
                                                                    >
                                                                        Confirm
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        disabled={loadingActionId === notification.id}
                                                                        onClick={() =>
                                                                            handleBookingAction(notification.id, booking.id, 'deny')
                                                                        }
                                                                        className="flex-1 px-3 py-2 rounded-lg bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 disabled:opacity-60"
                                                                    >
                                                                        Deny
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={openMessages}
                                    className="relative w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                                >
                                    <Icon icon="solar:chat-round-dots-linear" className="text-xl" />
                                </button>

                                {isMessagesOpen && (
                                    <div className="absolute right-0 mt-3 w-[340px] max-h-[460px] overflow-y-auto bg-white border border-gray-200 rounded-2xl shadow-xl p-3 z-[1300]">
                                        <div className="px-2 py-2">
                                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Messages</h3>

                                            <div className="relative">
                                                <Icon
                                                    icon="solar:magnifer-linear"
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                                />
                                                <input
                                                    value={userSearch}
                                                    onChange={(e) => setUserSearch(e.target.value)}
                                                    placeholder="Search users..."
                                                    className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-2 space-y-1">
                                            {usersToShow.length === 0 ? (
                                                <div className="py-10 text-center">
                                                    <Icon icon="solar:chat-round-line-linear" className="text-3xl text-gray-300 mx-auto mb-2" />
                                                    <p className="text-sm text-gray-500">
                                                        {userSearch.trim() ? 'No users found.' : 'No conversations yet.'}
                                                    </p>
                                                </div>
                                            ) : (
                                                usersToShow.map((messageUser) => (
                                                    <button
                                                        key={messageUser.id}
                                                        type="button"
                                                        onClick={() => openConversation(messageUser.id)}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left"
                                                    >
                                                        <img
                                                            src={messageUser.avatar || '/default-avatar.png'}
                                                            alt={messageUser.fullName || 'User'}
                                                            className="w-10 h-10 rounded-full object-cover bg-gray-100"
                                                        />
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {messageUser.fullName || 'Unknown user'}
                                                            </p>
                                                            <p className="text-xs text-gray-500 truncate">
                                                                {messageUser.email}
                                                            </p>
                                                        </div>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                                Log in
                            </Link>
                            <Link href="/signUp" className="text-sm font-medium bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors">
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}