'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Icon } from '@iconify/react';
import type { MapContainer as MapContainerType } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useRouter } from 'next/navigation';
import AppHeader from '@/app/components/AppHeader';
import AppFooter from '@/app/components/AppFooter';
import { toast } from 'react-hot-toast';
const MapContainer = dynamic<React.ComponentProps<typeof MapContainerType>>(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then((mod) => mod.Polyline), { ssr: false });
const ZoomControl = dynamic(() => import('react-leaflet').then((mod) => mod.ZoomControl), { ssr: false });

type User = {
    fullName?: string;
    email?: string;
    avatar?: string;
};

type CityOption = {
    name: string;
    country: string;
    coords: [number, number];
};

function calculateDistance(coords1: [number, number], coords2: [number, number]) {
    const R = 6371;
    const dLat = ((coords2[0] - coords1[0]) * Math.PI) / 180;
    const dLon = ((coords2[1] - coords1[1]) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((coords1[0] * Math.PI) / 180) *
        Math.cos((coords2[0] * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
    const { useMap } = require('react-leaflet');
    const map = useMap();

    useEffect(() => {
        if (center) map.setView(center, zoom, { animate: true, duration: 1 });
    }, [center, zoom, map]);

    return null;
}

function MapClickHandler({ onPick }: { onPick: (coords: [number, number]) => void }) {
    const { useMapEvents } = require('react-leaflet');
    useMapEvents({
        click(e: any) {
            onPick([e.latlng.lat, e.latlng.lng]);
        },
    });
    return null;
}

export default function PublishRide() {
    const router = useRouter();

    const [isPublished, setIsPublished] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [fromQuery, setFromQuery] = useState('');
    const [toQuery, setToQuery] = useState('');

    const [selectedFrom, setSelectedFrom] = useState<CityOption | null>(null);
    const [selectedTo, setSelectedTo] = useState<CityOption | null>(null);

    const [showFromSuggestions, setShowFromSuggestions] = useState(false);
    const [showToSuggestions, setShowToSuggestions] = useState(false);

    const [fromSuggestions, setFromSuggestions] = useState<CityOption[]>([]);
    const [toSuggestions, setToSuggestions] = useState<CityOption[]>([]);

    const [manualFrom, setManualFrom] = useState<[number, number] | null>(null);
    const [manualTo, setManualTo] = useState<[number, number] | null>(null);
    const [routePath, setRoutePath] = useState<[number, number][]>([]);
    const [routeAvailable, setRouteAvailable] = useState(false);

    const [rideDate, setRideDate] = useState('');
    const [depTime, setDepTime] = useState('');
    const [arrTime, setArrTime] = useState('');
    const [seatCount, setSeatCount] = useState(3);
    const [price, setPrice] = useState('');

    const fromCoords = selectedFrom?.coords || manualFrom;
    const toCoords = selectedTo?.coords || manualTo;

    const distance = useMemo(
        () => (fromCoords && toCoords ? calculateDistance(fromCoords, toCoords) : '--'),
        [fromCoords, toCoords]
    );

    useEffect(() => {
        import('leaflet').then((L) => {
            // @ts-ignore
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });
        });
    }, []);

    const searchCities = async (query: string): Promise<CityOption[]> => {
        if (!query.trim() || query.trim().length < 2) return [];
        try {
            const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=8&accept-language=en&q=${encodeURIComponent(
                query + ' city'
            )}`;
            const res = await fetch(url);
            const data = await res.json();

            return (data || [])
                .map((item: any) => {
                    const name =
                        item.address?.city ||
                        item.address?.town ||
                        item.address?.village ||
                        item.name ||
                        item.display_name?.split(',')?.[0] ||
                        'Unknown';
                    const country = item.address?.country || '';
                    return {
                        name,
                        country,
                        coords: [Number(item.lat), Number(item.lon)] as [number, number],
                    };
                })
                .filter((x: CityOption) => Number.isFinite(x.coords[0]) && Number.isFinite(x.coords[1]));
        } catch {
            return [];
        }
    };

    useEffect(() => {
        const t = setTimeout(async () => {
            if (!showFromSuggestions) return;
            setFromSuggestions(await searchCities(fromQuery));
        }, 300);
        return () => clearTimeout(t);
    }, [fromQuery, showFromSuggestions]);

    useEffect(() => {
        const t = setTimeout(async () => {
            if (!showToSuggestions) return;
            setToSuggestions(await searchCities(toQuery));
        }, 300);
        return () => clearTimeout(t);
    }, [toQuery, showToSuggestions]);

    const reverseCity = async (coords: [number, number]) => {
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords[0]}&lon=${coords[1]}&zoom=10&addressdetails=1`;
            const res = await fetch(url);
            const data = await res.json();
            const city =
                data?.address?.city ||
                data?.address?.town ||
                data?.address?.village ||
                data?.name ||
                'Custom point';
            const country = data?.address?.country || 'Unknown';
            return { name: city, country, coords };
        } catch {
            return { name: 'Custom point', country: 'Unknown', coords };
        }
    };

    const handleMapPick = async (coords: [number, number]) => {
        if (!manualFrom || (manualFrom && manualTo)) {
            setSelectedFrom(null);
            setFromQuery('');
            setManualFrom(coords);
            setManualTo(null);
            setRoutePath([]);
            setRouteAvailable(false);
            const city = await reverseCity(coords);
            setSelectedFrom(city);
            setFromQuery(city.name);
            return;
        }

        setSelectedTo(null);
        setToQuery('');
        setManualTo(coords);
        setRoutePath([]);
        setRouteAvailable(false);
        const city = await reverseCity(coords);
        setSelectedTo(city);
        setToQuery(city.name);
    };

    useEffect(() => {
        if (!fromCoords || !toCoords) {
            setRoutePath([]);
            setRouteAvailable(false);
            return;
        }

        const fetchRoadRoute = async () => {
            try {
                const url = `https://router.project-osrm.org/route/v1/driving/${fromCoords[1]},${fromCoords[0]};${toCoords[1]},${toCoords[0]}?overview=full&geometries=geojson`;
                const res = await fetch(url);
                const data = await res.json();

                const coords = data?.routes?.[0]?.geometry?.coordinates;
                if (!coords?.length) {
                    setRoutePath([]);
                    setRouteAvailable(false);
                    return;
                }

                const latLngPath: [number, number][] = coords.map(
                    ([lng, lat]: [number, number]) => [lat, lng]
                );
                setRoutePath(latLngPath);
                setRouteAvailable(true);
            } catch {
                setRoutePath([]);
                setRouteAvailable(false);
            }
        };

        fetchRoadRoute();
    }, [fromCoords, toCoords]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const userRaw = localStorage.getItem('user');
        if (!userRaw) {
            router.push('/login');
            return;
        }

        if (!fromCoords || !toCoords) {
            toast('Select both start and destination (city search or map click).');
            return;
        }

        const isFreshRoute =
            routePath.length > 1 &&
            Math.abs(routePath[0][0] - fromCoords[0]) < 0.05 &&
            Math.abs(routePath[0][1] - fromCoords[1]) < 0.05 &&
            Math.abs(routePath[routePath.length - 1][0] - toCoords[0]) < 0.05 &&
            Math.abs(routePath[routePath.length - 1][1] - toCoords[1]) < 0.05;

        if (!routeAvailable || !isFreshRoute) {
            toast.error('No drivable land route found between selected points.');
            return;
        }

        setIsLoading(true);

        try {
            const user: User = JSON.parse(userRaw);

            const res = await fetch('http://localhost:8080/api/rides', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fromCity: selectedFrom?.name || 'Custom point',
                    fromCountry: selectedFrom?.country || 'Unknown',
                    toCity: selectedTo?.name || 'Custom point',
                    toCountry: selectedTo?.country || 'Unknown',
                    fromLat: fromCoords[0],
                    fromLng: fromCoords[1],
                    toLat: toCoords[0],
                    toLng: toCoords[1],
                    date: rideDate,
                    depTime,
                    arrTime,
                    seats: seatCount,
                    price: Number(price),
                    driverName: user.fullName,
                    driverEmail: user.email,
                    driverAvatar: user.avatar || '',
                    carModel: 'N/A',
                }),
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || 'Failed to publish ride');
            }

            setIsPublished(true);
            setRideDate('');
            setDepTime('');
            setArrTime('');
            setSeatCount(3);
            setPrice('');
            setFromQuery('');
            setToQuery('');
            setSelectedFrom(null);
            setSelectedTo(null);
            setManualFrom(null);
            setManualTo(null);
            setRoutePath([]);
            setRouteAvailable(false);

            setTimeout(() => {
                router.push(`/findAride?refresh=${Date.now()}`);
            }, 500);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to publish ride');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 text-gray-900 font-sans antialiased flex flex-col min-h-screen">
            <AppHeader />

            <main className="flex-1 w-full max-w-full">
                <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-gray-900 mb-3">Publish a Ride</h1>
                    <p className="text-sm text-gray-500 max-w-xl mx-auto">
                        Share your journey, save on travel costs, and meet great people.
                    </p>
                </section>

                <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                    <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden flex flex-col md:flex-row">
                        <div className="flex-1 p-6 md:p-10 relative min-h-[500px]">
                            {isPublished && (
                                <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-8 text-center z-50">
                                    <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 mb-6">
                                        <Icon icon="solar:check-circle-linear" className="text-4xl" />
                                    </div>
                                    <h2 className="text-2xl font-medium mb-2">Ride Published!</h2>
                                    <p className="text-sm text-gray-500 mb-8">Your journey is now visible to passengers.</p>
                                    <button
                                        onClick={() => setIsPublished(false)}
                                        className="text-sm font-medium text-teal-600 border border-teal-200 rounded-lg px-6 py-2.5 bg-teal-50/50"
                                    >
                                        Publish another ride
                                    </button>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                                        <Icon icon="solar:routing-2-linear" className="text-gray-400" />
                                        Route Information
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Icon icon="solar:map-point-linear" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                                            <input
                                                type="text"
                                                value={fromQuery}
                                                onChange={(e) => {
                                                    setFromQuery(e.target.value);
                                                    setShowFromSuggestions(true);
                                                    setSelectedFrom(null);
                                                    setManualFrom(null);
                                                    setRoutePath([]);
                                                    setRouteAvailable(false);
                                                }}
                                                placeholder="Leaving from..."
                                                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-teal-500 outline-none"
                                            />
                                            {showFromSuggestions && fromSuggestions.length > 0 && (
                                                <div className="absolute z-[110] w-full mt-1 bg-white border rounded-xl shadow-lg overflow-hidden">
                                                    {fromSuggestions.map((city, idx) => (
                                                        <div
                                                            key={`${city.name}-${idx}`}
                                                            onClick={() => {
                                                                setRouteAvailable(false);
                                                                setRoutePath([]);
                                                                setSelectedFrom(city);
                                                                setManualFrom(city.coords);
                                                                setFromQuery(city.name);
                                                                setShowFromSuggestions(false);
                                                            }}
                                                            className="px-4 py-2 hover:bg-teal-50 cursor-pointer text-sm flex items-center gap-2"
                                                        >
                                                            <Icon icon="solar:city-linear" className="text-teal-500" />
                                                            {city.name}{city.country ? `, ${city.country}` : ''}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="relative">
                                            <Icon icon="solar:target-linear" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                                            <input
                                                type="text"
                                                value={toQuery}
                                                onChange={(e) => {
                                                    setToQuery(e.target.value);
                                                    setShowToSuggestions(true);
                                                    setSelectedTo(null);
                                                    setManualTo(null);
                                                    setRoutePath([]);
                                                    setRouteAvailable(false);
                                                }}
                                                placeholder="Going to..."
                                                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-teal-500 outline-none"
                                            />
                                            {showToSuggestions && toSuggestions.length > 0 && (
                                                <div className="absolute z-[110] w-full mt-1 bg-white border rounded-xl shadow-lg overflow-hidden">
                                                    {toSuggestions.map((city, idx) => (
                                                        <div
                                                            key={`${city.name}-${idx}`}
                                                            onClick={() => {
                                                                setRouteAvailable(false);
                                                                setRoutePath([]);
                                                                setSelectedTo(city);
                                                                setManualTo(city.coords);
                                                                setToQuery(city.name);
                                                                setShowToSuggestions(false);
                                                            }}
                                                            className="px-4 py-2 hover:bg-teal-50 cursor-pointer text-sm flex items-center gap-2"
                                                        >
                                                            <Icon icon="solar:city-linear" className="text-teal-500" />
                                                            {city.name}{city.country ? `, ${city.country}` : ''}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-xs text-gray-500">Tip: mozes direktno na mapata da kliknes start pa destinacija.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                                        <div className="relative">
                                            <Icon icon="solar:calendar-linear" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                                            <input
                                                type="date"
                                                value={rideDate}
                                                onChange={(e) => setRideDate(e.target.value)}
                                                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-teal-500 outline-none text-gray-700"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Time</label>
                                        <div className="relative">
                                            <Icon icon="solar:clock-circle-linear" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                                            <input
                                                type="time"
                                                value={depTime}
                                                onChange={(e) => setDepTime(e.target.value)}
                                                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-teal-500 outline-none text-gray-700"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Arrival Time</label>
                                        <div className="relative">
                                            <Icon icon="solar:clock-circle-linear" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                                            <input
                                                type="time"
                                                value={arrTime}
                                                onChange={(e) => setArrTime(e.target.value)}
                                                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-teal-500 outline-none text-gray-700"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Seats</label>
                                        <div className="relative">
                                            <Icon icon="solar:users-group-rounded-linear" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                                            <input
                                                type="number"
                                                min="1"
                                                max="8"
                                                value={seatCount}
                                                onChange={(e) => setSeatCount(Number(e.target.value))}
                                                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-teal-500 outline-none"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Price (MKD)</label>
                                        <div className="relative">
                                            <Icon icon="solar:wad-of-money-linear" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                                            <input
                                                type="number"
                                                min="0"
                                                placeholder="300"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-teal-500 outline-none"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || !routeAvailable}
                                    className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all"
                                >
                                    {isLoading ? <Icon icon="solar:spinner-linear" className="animate-spin" /> : 'Publish Ride'}
                                    {!isLoading && <Icon icon="solar:arrow-right-linear" />}
                                </button>

                                {!routeAvailable && fromCoords && toCoords && (
                                    <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm px-4 py-3 flex items-start gap-2">
                                        <Icon icon="solar:danger-triangle-linear" className="text-base mt-[1px]" />
                                        <span>No drivable land route found between selected points. Publish is disabled.</span>
                                    </div>
                                )}
                            </form>
                        </div>

                        <div className="md:w-1/3 min-h-[400px] bg-gray-50 border-l border-gray-100 relative">
                            <div className="absolute top-4 left-4 right-4 z-[1200] pointer-events-none bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-md border border-teal-100 flex justify-between items-center">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Distance</span>
                                <span className="text-sm font-bold text-teal-600">{distance === '--' ? '-- km' : `${distance} km`}</span>
                            </div>

                            <MapContainer center={[41.6086, 21.7453]} zoom={7} className="w-full h-full" zoomControl={false}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <ZoomControl position="bottomright" />
                                <MapClickHandler onPick={handleMapPick} />

                                {fromCoords && (
                                    <>
                                        <Marker position={fromCoords} />
                                        <ChangeView center={fromCoords} zoom={9} />
                                    </>
                                )}

                                {toCoords && <Marker position={toCoords} />}

                                {routePath.length > 1 && (
                                    <Polyline positions={routePath} pathOptions={{ color: '#14b8a6', weight: 4 }} />
                                )}
                            </MapContainer>
                        </div>
                    </div>
                </section>
            </main>

            <AppFooter />
        </div>
    );
}
