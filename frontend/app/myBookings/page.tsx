'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import AppHeader from '@/app/components/AppHeader';
import AppFooter from '@/app/components/AppFooter';

type BookingStatus = 'ACTIVE' | 'CANCELLED';

type Booking = {
    id: number;
    seatsBooked: number;
    paymentMethod: 'IN_ADVANCE' | 'IN_PERSON';
    status: BookingStatus;
    ride: {
        id: number;
        fromCity: string;
        fromCountry: string;
        toCity: string;
        toCountry: string;
        date: string;
        depTime: string;
        arrTime: string;
        price: number;
        driverName: string;
        driverAvatar?: string;
    };
};

type User = {
    id?: number;
    fullName?: string;
    email?: string;
};

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCancellingId, setIsCancellingId] = useState<number | null>(null);

    useEffect(() => {
        const userRaw = localStorage.getItem('user');
        if (!userRaw) {
            setLoading(false);
            return;
        }

        const user: User = JSON.parse(userRaw);
        if (!user.id) {
            setLoading(false);
            return;
        }

        fetch(`http://localhost:8080/api/bookings/my/${user.id}`, { cache: 'no-store' })
            .then((res) => res.json())
            .then((data) => setBookings(data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleCancel = async (bookingId: number) => {
        const confirmed = confirm('Cancel this booking?');
        if (!confirmed) return;

        setIsCancellingId(bookingId);
        try {
            const res = await fetch(`http://localhost:8080/api/bookings/${bookingId}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || 'Cancel failed');
            }

            // Logical cancel -> update status in UI, ne brishi red
            setBookings((prev) =>
                prev.map((b) => (b.id === bookingId ? { ...b, status: 'CANCELLED' } : b))
            );
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to cancel booking');
        } finally {
            setIsCancellingId(null);
        }
    };

    const activeBookings = bookings.filter((b) => b.status !== 'CANCELLED');

    const bestValueBookingId = activeBookings.length
        ? activeBookings.reduce((min, b) => (b.ride.price < min.ride.price ? b : min)).id
        : null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <AppHeader />

            <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
                <div className="mb-6">
                    <h1 className="text-3xl font-semibold tracking-tight text-gray-900">My Bookings</h1>
                    <p className="text-sm text-gray-500 mt-1">All your reserved rides.</p>
                </div>

                {loading ? (
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 text-sm text-gray-500">
                        Loading...
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
                        <div className="w-14 h-14 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                            <Icon icon="solar:ticket-linear" className="text-2xl text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No bookings yet</h3>
                        <p className="text-sm text-gray-500">When you book a ride, it will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((b) => {
                            const total = Number(b.ride.price) * Number(b.seatsBooked);
                            const isCancelled = b.status === 'CANCELLED';

                            return (
                                <div
                                    key={b.id}
                                    className={`bg-white rounded-2xl border p-5 sm:p-6 flex flex-col md:flex-row gap-6 justify-between ${
                                        isCancelled ? 'border-rose-200/80' : 'border-gray-200/70'
                                    }`}
                                >
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4">
                                            <img
                                                src={b.ride.driverAvatar || `'/default-avatar.png'${b.ride.driverName}`}
                                                alt="Driver"
                                                className="w-12 h-12 rounded-full object-cover bg-gray-100"
                                            />
                                            <div>
                                                <p className="text-sm text-gray-500">Driver</p>
                                                <p className="text-base font-medium text-gray-900">{b.ride.driverName}</p>

                                                <div className="mt-2 flex items-center gap-2">
                                                    <div
                                                        className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                                                            isCancelled
                                                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        }`}
                                                    >
                                                        <Icon
                                                            icon={
                                                                isCancelled
                                                                    ? 'solar:close-circle-linear'
                                                                    : 'solar:check-circle-linear'
                                                            }
                                                            className="text-[13px]"
                                                        />
                                                        {isCancelled ? 'Cancelled' : 'Active'}
                                                    </div>

                                                    {bestValueBookingId === b.id && !isCancelled && (
                                                        <div className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                                            <Icon icon="solar:star-bold" className="text-[12px]" />
                                                            Best Value
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <p className="text-lg font-semibold text-gray-900">
                                                {b.ride.fromCity}, {b.ride.fromCountry} → {b.ride.toCity}, {b.ride.toCountry}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {b.ride.date} • {b.ride.depTime} - {b.ride.arrTime}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="md:w-64 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 flex flex-col gap-3">
                                        <div className="text-sm text-gray-600">
                                            Seats: <span className="font-medium text-gray-900">{b.seatsBooked}</span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Payment:{' '}
                                            <span className="font-medium text-gray-900">
                        {b.paymentMethod === 'IN_ADVANCE' ? 'In advance' : 'In person'}
                      </span>
                                        </div>
                                        <div className="text-2xl font-semibold text-gray-900">{total} den</div>

                                        <button
                                            onClick={() => handleCancel(b.id)}
                                            disabled={isCancelled || isCancellingId === b.id}
                                            className="mt-2 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 disabled:opacity-50"
                                        >
                                            {isCancelled
                                                ? 'Cancelled'
                                                : isCancellingId === b.id
                                                    ? 'Cancelling...'
                                                    : 'Cancel booking'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            <AppFooter />
        </div>
    );
}
