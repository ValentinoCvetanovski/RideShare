'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import { useRouter } from 'next/navigation';


type Ride = {
    id: number;
    fromCity: string;
    fromCountry: string;
    toCity: string;
    toCountry: string;
    date: string;
    depTime: string;
    arrTime: string;
    seats: number;
    price: number;
    driverName: string;
    driverAvatar?: string;
    instant?: boolean;
    rating?: number;
};

type User = {
    fullName?: string;
    avatar?: string;
    role?: string;
};

export default function FindARide() {
    const [rides, setRides] = useState<Ride[]>([]);
    const [maxPrice, setMaxPrice] = useState(10000);
    const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
    const [seats, setSeats] = useState(1);
    const [instantBooking, setInstantBooking] = useState(false);
    const [sortBy, setSortBy] = useState('time');

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [date, setDate] = useState('');
    const [fromCity, setFromCity] = useState('');
    const [fromCountry, setFromCountry] = useState('');
    const [toCity, setToCity] = useState('');
    const [toCountry, setToCountry] = useState('');
    const [passengers, setPassengers] = useState(1);

    const searchParams = useSearchParams();

    const router = useRouter();

    const refresh = searchParams.get('refresh');

    const currentUser: User | null =
        typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
    const isAdmin = currentUser?.role === 'ADMIN';

    const handleDeleteRide = async (rideId: number) => {
        const confirmed = confirm('Are you sure you want to delete this ride?');
        if (!confirmed) return;

        try {
            const res = await fetch(`http://localhost:8080/api/rides/${rideId}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || 'Delete failed');
            }

            setRides((prev) => prev.filter((r) => r.id !== rideId));
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to delete ride');
        }
    };

    const resolveAvatar = (ride: Ride) => {
        if (ride.driverAvatar) return ride.driverAvatar;
        if (currentUser?.fullName === ride.driverName && currentUser?.avatar) return currentUser.avatar;
        return `https://i.pravatar.cc/150?u=${ride.driverName || ride.id}`;
    };

    useEffect(() => {
        fetch('http://localhost:8080/api/rides/active', { cache: 'no-store' })
            .then((res) => res.json())
            .then((data) => setRides(data || []))
            .catch((err) => console.error(err));
    }, [refresh]);

    const handleSearch = async () => {
        const params = new URLSearchParams();
        if (fromCity.trim()) params.append('fromCity', fromCity.trim());
        if (fromCountry.trim()) params.append('fromCountry', fromCountry.trim());
        if (toCity.trim()) params.append('toCity', toCity.trim());
        if (toCountry.trim()) params.append('toCountry', toCountry.trim());
        if (date) params.append('date', date);
        if (passengers) params.append('seats', String(passengers));

        const url = params.toString()
            ? `http://localhost:8080/api/rides/search?${params.toString()}`
            : `http://localhost:8080/api/rides/active`;

        try {
            const res = await fetch(url, { cache: 'no-store' });
            const data = await res.json();
            setRides(data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredRides = useMemo(() => {
        return rides
            .filter((ride) => {
                if (ride.price > maxPrice) return false;
                if (ride.seats < seats) return false;
                if (instantBooking && !ride.instant) return false;

                if (selectedTimes.length > 0) {
                    const hour = parseInt((ride.depTime || '00:00').split(':')[0], 10);
                    let timeMatch = false;
                    if (selectedTimes.includes('morning') && hour >= 6 && hour < 12) timeMatch = true;
                    if (selectedTimes.includes('afternoon') && hour >= 12 && hour < 18) timeMatch = true;
                    if (selectedTimes.includes('evening') && hour >= 18) timeMatch = true;
                    if (!timeMatch) return false;
                }

                return true;
            })
            .sort((a, b) => {
                if (sortBy === 'price') return a.price - b.price;
                return a.depTime.localeCompare(b.depTime);
            });
    }, [rides, maxPrice, seats, instantBooking, selectedTimes, sortBy]);

    const toggleTimeFilter = (val: string) => {
        setSelectedTimes((prev) => (prev.includes(val) ? prev.filter((t) => t !== val) : [...prev, val]));
    };

    const clearFilters = () => {
        setMaxPrice(10000);
        setSelectedTimes([]);
        setSeats(1);
        setPassengers(1);
        setInstantBooking(false);
        setSortBy('time');
    };

    const countText = `${filteredRides.length} ride${filteredRides.length !== 1 ? 's' : ''} available`;

    return (
        <div className="bg-gray-50 text-gray-900 font-sans antialiased selection:bg-brand-500 selection:text-white flex flex-col min-h-screen">
            <style jsx global>{`
                input[type='range'] {
                    -webkit-appearance: none;
                    width: 100%;
                    background: transparent;
                }
                input[type='range']::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #ffffff;
                    cursor: pointer;
                    margin-top: -8px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.05);
                    border: 1px solid #f3f4f6;
                    transition: transform 0.1s;
                }
                input[type='range']::-webkit-slider-thumb:hover {
                    transform: scale(1.1);
                }
                input[type='range']::-webkit-slider-runnable-track {
                    width: 100%;
                    height: 4px;
                    cursor: pointer;
                    background: #e5e7eb;
                    border-radius: 999px;
                }
                input[type='range']:focus {
                    outline: none;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e5e7eb;
                    border-radius: 4px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                }
            `}</style>

            <AppHeader />

            <div className="bg-white border-b border-gray-200/50 relative z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <form className="w-full bg-white p-1.5 rounded-2xl border border-gray-200/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col lg:flex-row gap-2">
                        <div className="flex-1 flex items-center px-4 py-2.5 lg:border-r border-gray-100 group">
                            <Icon icon="solar:map-point-linear" className="text-gray-400 text-lg mr-3" />
                            <div className="flex flex-col w-full text-left">
                                <label className="text-[10px] font-medium text-gray-400 mb-0.5 uppercase tracking-wider">Leaving from</label>
                                <input value={fromCity} onChange={(e) => setFromCity(e.target.value)} placeholder="Skopje" className="w-full bg-transparent focus:outline-none text-gray-900 text-sm font-medium" />
                                <input value={fromCountry} onChange={(e) => setFromCountry(e.target.value)} placeholder="North Macedonia" className="w-full bg-transparent focus:outline-none text-gray-900 text-sm font-medium mt-1" />
                            </div>
                        </div>

                        <div className="flex-1 flex items-center px-4 py-2.5 lg:border-r border-gray-100 group">
                            <Icon icon="solar:point-on-map-linear" className="text-gray-400 text-lg mr-3" />
                            <div className="flex flex-col w-full text-left">
                                <label className="text-[10px] font-medium text-gray-400 mb-0.5 uppercase tracking-wider">Going to</label>
                                <input value={toCity} onChange={(e) => setToCity(e.target.value)} placeholder="Ohrid" className="w-full bg-transparent focus:outline-none text-gray-900 text-sm font-medium" />
                                <input value={toCountry} onChange={(e) => setToCountry(e.target.value)} placeholder="North Macedonia" className="w-full bg-transparent focus:outline-none text-gray-900 text-sm font-medium mt-1" />
                            </div>
                        </div>

                        <div className="flex-1 flex items-center px-4 py-2.5 group min-w-[150px]">
                            <Icon icon="solar:calendar-linear" className="text-gray-400 text-lg mr-3" />
                            <div className="flex flex-col w-full text-left">
                                <label className="text-[10px] font-medium text-gray-400 mb-0.5 uppercase tracking-wider">Date</label>
                                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-transparent focus:outline-none text-gray-900 text-sm font-medium cursor-pointer" />
                            </div>
                        </div>

                        <div className="flex items-center px-4 py-2.5 lg:border-l border-gray-100 group w-auto lg:w-32">
                            <Icon icon="solar:user-linear" className="text-gray-400 text-lg mr-2" />
                            <select
                                value={passengers}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    setPassengers(value);
                                    setSeats(value);
                                }}
                                className="w-full bg-transparent focus:outline-none text-gray-900 text-sm font-medium cursor-pointer appearance-none"
                            >
                                <option value={1}>1 pass.</option>
                                <option value={2}>2 pass.</option>
                                <option value={3}>3 pass.</option>
                            </select>
                        </div>

                        <button type="button" onClick={handleSearch} className="bg-brand-600 hover:bg-brand-500 text-white rounded-xl px-6 py-3 lg:py-0 text-sm font-medium transition-colors flex items-center justify-center gap-2 w-full lg:w-auto mt-2 lg:mt-0 shadow-sm">
                            Search
                        </button>
                    </form>
                </div>
            </div>

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8 relative">
                <div className="md:hidden flex justify-between items-center mb-4">
                    <h1 className="text-xl font-medium tracking-tight text-gray-900">{countText}</h1>
                    <button onClick={() => setIsSidebarOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm">
                        <Icon icon="solar:filter-linear" />
                        Filters
                    </button>
                </div>

                <aside className={`${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0 w-full md:w-64 flex-shrink-0 fixed md:sticky top-0 md:top-[8rem] inset-0 z-50 md:z-auto bg-white md:bg-transparent p-6 md:p-0 h-full md:h-[calc(100vh-10rem)] overflow-y-auto custom-scrollbar transition-transform transform`}>
                    <div className="flex justify-between items-center md:hidden mb-6">
                        <h2 className="text-lg font-medium tracking-tight text-gray-900">Filters</h2>
                        <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 hover:text-gray-900">
                            <Icon icon="solar:close-circle-linear" className="text-2xl" />
                        </button>
                    </div>

                    <div className="space-y-8 pb-20 md:pb-0">
                        <div>
                            <h3 className="text-xs font-medium text-gray-900 uppercase tracking-wider mb-3">Sort by</h3>
                            <div className="relative">
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full appearance-none bg-white border border-gray-200/80 text-gray-900 text-sm rounded-xl px-4 py-2.5 focus:outline-none cursor-pointer">
                                    <option value="time">Earliest departure</option>
                                    <option value="price">Lowest price</option>
                                </select>
                                <Icon icon="solar:alt-arrow-down-linear" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <hr className="border-gray-200/60" />

                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-xs font-medium text-gray-900 uppercase tracking-wider">Max Price</h3>
                                <span className="text-sm font-medium text-brand-600">{maxPrice} den</span>
                            </div>
                            <input type="range" min="0" max="10000" step="50" value={maxPrice} onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))} className="w-full" />
                            <div className="flex justify-between text-xs text-gray-400 mt-2">
                                <span>0 den</span>
                                <span>10000 den</span>
                            </div>
                        </div>

                        <hr className="border-gray-200/60" />

                        <div>
                            <h3 className="text-xs font-medium text-gray-900 uppercase tracking-wider mb-3">Departure Time</h3>
                            <div className="space-y-3">
                                {[
                                    { id: 'morning', label: 'Morning (06:00 - 12:00)' },
                                    { id: 'afternoon', label: 'Afternoon (12:00 - 18:00)' },
                                    { id: 'evening', label: 'Evening (After 18:00)' },
                                ].map((time) => (
                                    <label key={time.id} className="flex items-center cursor-pointer group">
                                        <div className="relative flex items-center justify-center">
                                            <input type="checkbox" checked={selectedTimes.includes(time.id)} onChange={() => toggleTimeFilter(time.id)} className="peer sr-only" />
                                            <div className="w-5 h-5 border border-gray-300 rounded bg-white peer-checked:bg-brand-600 peer-checked:border-brand-600 transition-colors group-hover:border-brand-400" />
                                            <Icon icon="solar:check-read-linear" className="absolute text-white opacity-0 peer-checked:opacity-100 text-sm pointer-events-none transition-opacity" />
                                        </div>
                                        <span className="ml-3 text-sm text-gray-700 select-none">{time.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <hr className="border-gray-200/60" />

                        <div>
                            <h3 className="text-xs font-medium text-gray-900 uppercase tracking-wider mb-3">Available Seats</h3>
                            <div className="flex gap-2">
                                {[1, 2, 3].map((num) => (
                                    <label key={num} className="cursor-pointer flex-1">
                                        <input type="radio" name="seats" value={num} checked={seats === num} onChange={() => setSeats(num)} className="peer sr-only" />
                                        <div className="text-center py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 bg-white peer-checked:border-brand-600 peer-checked:text-brand-600 peer-checked:bg-brand-50 transition-all">{num}+</div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <hr className="border-gray-200/60" />

                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-gray-900">Instant booking</h3>
                                <p className="text-xs text-gray-500 mt-0.5">No approval required</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={instantBooking} onChange={(e) => setInstantBooking(e.target.checked)} className="sr-only peer" />
                                <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600 border border-gray-200/50" />
                            </label>
                        </div>

                        <button onClick={clearFilters} className="w-full py-2.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mt-4">
                            Clear all filters
                        </button>
                    </div>
                </aside>

                <div className="flex-1 w-full max-w-full">
                    <h2 className="text-2xl font-medium tracking-tight text-gray-900 mb-6 hidden md:block">{countText}</h2>

                    <div className="flex flex-col gap-4">
                        {filteredRides.length > 0 ? (
                            filteredRides.map((ride) => (
                                <div key={ride.id} className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 group cursor-pointer flex flex-col sm:flex-row justify-between gap-6">
                                    <div className="flex-1 flex flex-col gap-4 relative min-w-[200px]">
                                        <div className="absolute left-[5px] top-2 bottom-2 w-px bg-gray-200 -z-0" />
                                        <div className="flex items-start gap-4 bg-white relative z-10">
                                            <div className="w-3 h-3 rounded-full border-[3px] border-gray-900 bg-white mt-1" />
                                            <div className="flex flex-col">
                                                <span className="text-base font-medium tracking-tight text-gray-900 leading-none mb-1">{ride.depTime}</span>
                                                <span className="text-sm text-gray-600 truncate">{ride.fromCity}, {ride.fromCountry}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 bg-white relative z-10">
                                            <div className="w-3 h-3 rounded-full border-[3px] border-brand-500 bg-white mt-1" />
                                            <div className="flex flex-col">
                                                <span className="text-base font-medium tracking-tight text-gray-900 leading-none mb-1">{ride.arrTime}</span>
                                                <span className="text-sm text-gray-600 truncate">{ride.toCity}, {ride.toCountry}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between sm:border-l sm:border-gray-100 sm:pl-6 pt-4 sm:pt-0 border-t border-gray-100 sm:border-t-0 mt-4 sm:mt-0 gap-4">
                                        <div className="flex items-center gap-3">
                                            <img src={resolveAvatar(ride)} alt="Driver" className="w-12 h-12 rounded-full object-cover bg-gray-100" />
                                            <div className="flex flex-col">
                                                <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                                    {ride.driverName}
                                                    <Icon icon="solar:star-bold" className="text-yellow-400 text-xs ml-1" />
                                                    <span className="text-xs text-gray-500 font-normal">{ride.rating ?? 5.0}</span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Icon icon="solar:armchair-linear" />
                                                        {ride.seats} seat{ride.seats > 1 ? 's' : ''} left
                                                    </div>
                                                    {ride.instant && (
                                                        <div className="text-xs text-brand-600 flex items-center gap-1 bg-brand-50 px-2 py-0.5 rounded-full font-medium">
                                                            <Icon icon="solar:bolt-linear" />
                                                            Instant
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:border-l sm:border-gray-100 sm:pl-6 min-w-[100px] gap-2">
                                        <div className="text-2xl font-medium tracking-tight text-gray-900">{ride.price} den</div>

                                        <button
                                            onClick={() => router.push(`/book?id=${ride.id}`)}
                                            className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium transition-colors hover:bg-gray-800 outline-none w-full sm:w-auto text-center">
                                            Book
                                        </button>

                                        {isAdmin && (
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteRide(ride.id)}
                                                className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 outline-none w-full sm:w-auto text-center"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-gray-200/60 border-dashed">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <Icon icon="solar:magnifer-linear" className="text-3xl text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 tracking-tight mb-2">No rides found</h3>
                                <p className="text-sm text-gray-500 max-w-sm">We couldn't find any rides matching your criteria. Try adjusting filters or date.</p>
                                <button onClick={clearFilters} className="mt-6 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <AppFooter />

            {isSidebarOpen && (
                <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity" />
            )}
        </div>
    );}