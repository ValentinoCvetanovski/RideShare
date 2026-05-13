'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Icon } from '@iconify/react';
import AppHeader from '@/app/components/AppHeader';
import AppFooter from '@/app/components/AppFooter';

type Ride = {
    id: number;
    fromCity: string;
    toCity: string;
    date: string;
    depTime: string;
    arrTime: string;
    seats: number;
    price: number; // price per seat
    driverName: string;
    driverAvatar?: string;
};

export default function BookPage() {
    const searchParams = useSearchParams();
    const rideId = searchParams.get('id');

    const [ride, setRide] = useState<Ride | null>(null);
    const [loading, setLoading] = useState(true);

    const [bookSeats, setBookSeats] = useState(1);
    const [payMethod, setPayMethod] = useState<'IN_ADVANCE' | 'IN_PERSON'>('IN_PERSON');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!rideId) {
            setLoading(false);
            return;
        }
        fetch(`http://localhost:8080/api/rides/${rideId}`, { cache: 'no-store' })
            .then((res) => res.json())
            .then((data) => setRide(data))
            .finally(() => setLoading(false));
    }, [rideId]);

    const totalPrice = useMemo(() => {
        if (!ride) return 0;
        return Number(ride.price) * bookSeats;
    }, [ride, bookSeats]);

    const handleConfirmBooking = async () => {
        if (!ride) return;

        const userRaw = localStorage.getItem('user');
        if (!userRaw) {
            alert('Please log in first.');
            return;
        }
        const user = JSON.parse(userRaw);

        if (bookSeats < 1 || bookSeats > ride.seats) {
            alert('Invalid seats count.');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('http://localhost:8080/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rideId: ride.id,
                    passengerId: user.id,
                    seatsBooked: bookSeats,
                    paymentMethod: payMethod,
                }),
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || 'Booking failed');
            }

            alert('Ride booked successfully!');
        } catch (e) {
            alert(e instanceof Error ? e.message : 'Booking failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!ride) return <div className="p-8">Ride not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <AppHeader />
            <main className="max-w-4xl w-full mx-auto px-4 py-8 flex-1">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
                    <div className="flex justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold">{ride.fromCity} → {ride.toCity}</h1>
                            <p className="text-sm text-gray-500">{ride.date} • {ride.depTime} - {ride.arrTime}</p>
                        </div>
                        <div className="text-2xl font-semibold">{ride.price} den / seat</div>
                    </div>

                    <div className="border rounded-xl p-4">
                        <h3 className="font-medium mb-3">Driver</h3>
                        <div className="flex items-center gap-3">
                            <img
                                src={ride.driverAvatar || `https://i.pravatar.cc/150?u=${ride.driverName}`}
                                alt="Driver"
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="font-medium">{ride.driverName}</div>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="border rounded-xl p-4">
                            <label className="text-sm font-medium block mb-2">How many seats</label>
                            <input
                                type="number"
                                min={1}
                                max={ride.seats}
                                value={bookSeats}
                                onChange={(e) => setBookSeats(Number(e.target.value))}
                                className="w-full border rounded-lg px-3 py-2"
                            />
                            <p className="text-xs text-gray-500 mt-2">Available: {ride.seats}</p>
                        </div>

                        <div className="border rounded-xl p-4">
                            <label className="text-sm font-medium block mb-2">Payment</label>
                            <select
                                value={payMethod}
                                onChange={(e) => setPayMethod(e.target.value as 'IN_ADVANCE' | 'IN_PERSON')}
                                className="w-full border rounded-lg px-3 py-2"
                            >
                                <option value="IN_ADVANCE">Pay in advance</option>
                                <option value="IN_PERSON">Pay in person</option>
                            </select>
                        </div>
                    </div>

                    <div className="border rounded-xl p-4 flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total price</span>
                        <span className="text-2xl font-semibold">{totalPrice} den</span>
                    </div>

                    <button
                        onClick={handleConfirmBooking}
                        disabled={isSubmitting}
                        className="w-full bg-gray-900 text-white rounded-xl py-3 font-medium hover:bg-gray-800 disabled:opacity-60"
                    >
                        {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                    </button>
                </div>
            </main>
            <AppFooter />
        </div>
    );
}
