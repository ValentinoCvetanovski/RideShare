'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import AppHeader from '../app/components/AppHeader';
import AppFooter from './components/AppFooter';
import { useRouter } from 'next/navigation';

type Ride = {
  id: number;
  fromCity: string;
  fromCountry: string;
  toCity: string;
  toCountry: string;
  depTime: string;
  arrTime: string;
  seats: number;
  price: number;
  driverName: string;
  driverAvatar?: string;
};

type User = {
  fullName?: string;
  avatar?: string;
};

export default function Home() {
  const [isSearching, setIsSearching] = useState(false);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [minDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [latestRides, setLatestRides] = useState<Ride[]>([]);

  const currentUser: User | null =
      typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;

  const resolveAvatar = (ride: Ride) => {
    if (ride.driverAvatar) return ride.driverAvatar;
    if (currentUser?.fullName === ride.driverName && currentUser?.avatar) return currentUser.avatar;
    return `https://i.pravatar.cc/150?u=${ride.driverName || ride.id}`;
  };

  useEffect(() => {
    fetch('http://localhost:8080/api/rides/active', { cache: 'no-store' })
        .then((res) => res.json())
        .then((data: Ride[]) => {
          const sorted = [...(data || [])].sort((a, b) => b.id - a.id);
          setLatestRides(sorted.slice(0, 3));
        })
        .catch((err) => console.error(err));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 800);
  };
  const router = useRouter();

  const ridesToShow = useMemo(() => latestRides.slice(0, 3), [latestRides]);

  return (
      <div className="bg-gray-50 text-gray-900 font-sans antialiased selection:bg-brand-500 selection:text-white">
        <AppHeader />

        <main className="relative pt-20 pb-32 flex flex-col items-center justify-center text-center px-4 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-50 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none" />

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tighter text-gray-900 mb-6 max-w-3xl leading-tight">
            Share the journey,<br className="hidden md:block" /> shrink the distance.
          </h1>
          <p className="text-base text-gray-500 mb-12 max-w-2xl font-normal">
            Connect with drivers heading your way. Save money, meet new people, and travel comfortably across cities.
          </p>

          <form
              onSubmit={handleSearch}
              className="w-full max-w-4xl bg-white p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200/60 flex flex-col md:flex-row gap-2 relative z-10"
          >
            <div className="flex-1 flex items-center px-4 py-3 md:border-r border-gray-100 group">
              <Icon icon="solar:map-point-linear" className="text-gray-400 text-lg mr-3" />
              <div className="flex flex-col w-full text-left">
                <label className="text-xs font-medium text-gray-400 mb-0.5 uppercase tracking-wide">Leaving from</label>
                <input type="text" placeholder="City or address" className="w-full bg-transparent focus:outline-none text-gray-900 placeholder-gray-300 text-sm font-medium" required />
              </div>
            </div>

            <div className="flex-1 flex items-center px-4 py-3 md:border-r border-gray-100 group">
              <Icon icon="solar:point-on-map-linear" className="text-gray-400 text-lg mr-3" />
              <div className="flex flex-col w-full text-left">
                <label className="text-xs font-medium text-gray-400 mb-0.5 uppercase tracking-wide">Going to</label>
                <input type="text" placeholder="City or address" className="w-full bg-transparent focus:outline-none text-gray-900 placeholder-gray-300 text-sm font-medium" required />
              </div>
            </div>

            <div className="flex-1 flex items-center px-4 py-3 group min-w-[160px]">
              <Icon icon="solar:calendar-linear" className="text-gray-400 text-lg mr-3" />
              <div className="flex flex-col w-full text-left">
                <label className="text-xs font-medium text-gray-400 mb-0.5 uppercase tracking-wide">Date</label>
                <input
                    type="date"
                    value={date}
                    min={minDate}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent focus:outline-none text-gray-900 text-sm font-medium cursor-pointer"
                    required
                />
              </div>
            </div>

            <div className="flex items-center px-4 py-3 md:border-l border-gray-100 group w-auto md:w-32">
              <Icon icon="solar:user-linear" className="text-gray-400 text-lg mr-2" />
              <select className="w-full bg-transparent focus:outline-none text-gray-900 text-sm font-medium cursor-pointer appearance-none">
                <option>1 pass.</option>
                <option>2 pass.</option>
                <option>3 pass.</option>
                <option>4 pass.</option>
              </select>
            </div>

            <button
                type="submit"
                disabled={isSearching}
                className={`bg-brand-600 hover:bg-brand-500 text-white rounded-xl px-8 py-4 md:py-0 text-sm font-medium transition-colors flex items-center justify-center gap-2 w-full md:w-auto mt-2 md:mt-0 shadow-sm ${
                    isSearching ? 'opacity-80 cursor-not-allowed' : ''
                }`}
            >
              {isSearching ? (
                  <>
                    <Icon icon="solar:spinner-linear" className="animate-spin" />
                    Searching...
                  </>
              ) : (
                  'Search'
              )}
            </button>
          </form>
        </main>

        <section className="py-24 bg-white border-y border-gray-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-2xl font-medium tracking-tight text-gray-900 mb-3">Why travel with us?</h2>
              <p className="text-sm text-gray-500 max-w-xl mx-auto">
                We provide a seamless experience to make your journeys efficient and enjoyable.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center group">
                <div className="h-14 w-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  <Icon icon="solar:wallet-linear" className="text-2xl text-brand-600" />
                </div>
                <h3 className="text-base font-medium tracking-tight text-gray-900 mb-2">Save on travel costs</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Share the cost of the journey. Drivers save on gas, and passengers get affordable rides compared to traditional transit.
                </p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="h-14 w-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  <Icon icon="solar:shield-check-linear" className="text-2xl text-brand-600" />
                </div>
                <h3 className="text-base font-medium tracking-tight text-gray-900 mb-2">Verified community</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Travel with peace of mind. We verify IDs and display ratings and reviews from previous trips for all members.
                </p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="h-14 w-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  <Icon icon="solar:route-linear" className="text-2xl text-brand-600" />
                </div>
                <h3 className="text-base font-medium tracking-tight text-gray-900 mb-2">Direct routes</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  No unnecessary stops. Get from point A to point B directly, often faster than waiting for trains or buses.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-2xl font-medium tracking-tight text-gray-900 mb-2">Available soon</h2>
                <p className="text-sm text-gray-500">Popular upcoming rides around you.</p>
              </div>
              <Link href="/findAride" className="text-sm font-medium text-brand-600 hover:text-brand-700 hidden sm:block transition-colors">
                View all rides →
              </Link>
            </div>

            {ridesToShow.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ridesToShow.map((ride) => (
                      <div
                          key={ride.id}
                          className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col h-full"
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex flex-col gap-4 relative">
                            <div className="absolute left-[5px] top-2 bottom-2 w-px bg-gray-200 -z-0" />

                            <div className="flex items-start gap-4 bg-white relative z-10">
                              <div className="w-3 h-3 rounded-full border-[3px] border-gray-900 bg-white mt-1" />
                              <div className="flex flex-col">
                                <span className="text-base font-medium tracking-tight text-gray-900 leading-none mb-1">{ride.depTime}</span>
                                <span className="text-sm text-gray-600">{ride.fromCity}, {ride.fromCountry}</span>
                              </div>
                            </div>

                            <div className="flex items-start gap-4 bg-white relative z-10">
                              <div className="w-3 h-3 rounded-full border-[3px] border-brand-500 bg-white mt-1" />
                              <div className="flex flex-col">
                                <span className="text-base font-medium tracking-tight text-gray-900 leading-none mb-1">{ride.arrTime}</span>
                                <span className="text-sm text-gray-600">{ride.toCity}, {ride.toCountry}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-xl font-medium tracking-tight text-gray-900">{ride.price} den</div>
                        </div>

                        <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img src={resolveAvatar(ride)} alt="Driver" className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{ride.driverName}</div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Icon icon="solar:armchair-linear" />
                                {ride.seats} seat{ride.seats > 1 ? 's' : ''} left
                              </div>
                            </div>
                          </div>

                          <button
                              onClick={() => router.push(`/book?id=${ride.id}`)}
                              className="px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-900 text-sm font-medium transition-colors border border-gray-200/50">
                            Book
                          </button>
                        </div>
                      </div>
                  ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-200/60 p-10 text-center">
                  <p className="text-sm text-gray-500">No published rides yet.</p>
                </div>
            )}

            <div className="mt-8 text-center sm:hidden">
              <Link href="/findAride" className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors inline-block py-2">
                View all rides →
              </Link>
            </div>
          </div>
        </section>

        <AppFooter />
      </div>
  );
}
