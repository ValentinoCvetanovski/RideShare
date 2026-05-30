'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/app/components/AppHeader';
import AppFooter from '@/app/components/AppFooter';

type User = {
    id?: number;
    fullName?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    role?: string;
};

type Profile = {
    profilePicture: string; // preview + will be saved to user.avatar
    carModel: string;
    city: string;
    birthDate: string;
    bio: string;
};

type SavedProfile = Omit<Profile, 'profilePicture'>;

const defaultProfile: Profile = {
    profilePicture: '',
    carModel: '',
    city: '',
    birthDate: '',
    bio: '',
};

const resizeImage = (file: File, maxSize = 160, quality = 0.7): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);

                canvas.width = Math.round(img.width * scale);
                canvas.height = Math.round(img.height * scale);

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Canvas not supported'));
                    return;
                }

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };

            img.onerror = () => reject(new Error('Image load failed'));
            img.src = String(reader.result);
        };

        reader.onerror = () => reject(new Error('File read failed'));
        reader.readAsDataURL(file);
    });

export default function MyAccountPage() {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile>(defaultProfile);
    const [phoneInput, setPhoneInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const userRaw = localStorage.getItem('user');
        if (!userRaw) {
            router.push('/login');
            return;
        }

        const parsedUser: User = JSON.parse(userRaw);
        setUser(parsedUser);
        setPhoneInput(parsedUser.phone ?? '');

        const savedProfileRaw = localStorage.getItem('myAccountProfile');
        if (savedProfileRaw) {
            try {
                const savedProfile: SavedProfile = JSON.parse(savedProfileRaw);
                setProfile((prev) => ({
                    ...prev,
                    carModel: savedProfile.carModel || '',
                    city: savedProfile.city || '',
                    birthDate: savedProfile.birthDate || '',
                    bio: savedProfile.bio || '',
                }));
            } catch {
                // ignore invalid JSON
            }
        }

        // Show existing avatar from user as current preview
        if (parsedUser.avatar) {
            setProfile((prev) => ({ ...prev, profilePicture: parsedUser.avatar || '' }));
        }
    }, [router]);

    const isPhoneVerified = Boolean(user?.phone && user.phone.trim().length > 0);

    const completionPercent = useMemo(() => {
        const checks = [
            Boolean(profile.profilePicture),
            Boolean(profile.carModel.trim()),
            Boolean(profile.city.trim()),
            Boolean(profile.birthDate),
            Boolean(profile.bio.trim()),
            Boolean((user?.phone || phoneInput).trim()),
        ];
        const completed = checks.filter(Boolean).length;
        return Math.round((completed / checks.length) * 100);
    }, [profile, user?.phone, phoneInput]);

    const completionLabel =
        completionPercent === 100 ? 'Complete' : completionPercent >= 60 ? 'Good' : 'Needs details';

    const onFieldChange = (key: keyof Profile, value: string) => {
        setProfile((prev) => ({ ...prev, [key]: value }));
    };

    const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const smallBase64 = await resizeImage(file, 160, 0.7);
            onFieldChange('profilePicture', smallBase64);
        } catch {
            alert('Image processing failed');
        }
    };

    const onSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if (!user.id) {
            alert('User id is missing. Please log in again.');
            return;
        }

        setIsSaving(true);

        const updatedUser: User = {
            ...user,
            phone: user.phone && user.phone.trim().length > 0 ? user.phone : phoneInput.trim(),
            avatar: profile.profilePicture || user.avatar || '',
        };

        const safeProfileToSave: SavedProfile = {
            carModel: profile.carModel,
            city: profile.city,
            birthDate: profile.birthDate,
            bio: profile.bio,
        };

        try {
            localStorage.setItem('myAccountProfile', JSON.stringify(safeProfileToSave));

            const res = await fetch(`http://localhost:8080/api/users/${user.id}/avatar`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    avatar: updatedUser.avatar,
                }),
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || 'Failed to save avatar');
            }

            const savedUser = await res.json();

            const userToStore: User = {
                ...updatedUser,
                ...savedUser,
                avatar: savedUser.avatar || updatedUser.avatar,
            };

            localStorage.setItem('user', JSON.stringify(userToStore));
            window.dispatchEvent(new Event('userUpdated'));

            setUser(userToStore);

            setTimeout(() => {
                setIsSaving(false);
                alert('Profile updated successfully!');
            }, 350);
        } catch (err) {
            setIsSaving(false);
            alert(err instanceof Error ? err.message : 'Could not save profile. Try smaller image.');
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <AppHeader />

            <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
                <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">My Account</h1>
                <p className="text-sm text-gray-500 mb-8">Manage your profile details and preferences.</p>

                <form onSubmit={onSave} className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6">
                    {/* Unchangeable signup data */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={user?.fullName || ''}
                                readOnly
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                            <input
                                type="text"
                                value={user?.email || ''}
                                readOnly
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                            {user?.phone ? (
                                <input
                                    type="text"
                                    value={user.phone}
                                    readOnly
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={phoneInput}
                                    onChange={(e) => setPhoneInput(e.target.value)}
                                    placeholder="+389 70 123 456"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Verified</label>
                            <div
                                className={`w-full border rounded-xl px-4 py-2.5 text-sm font-medium flex items-center gap-2 ${
                                    isPhoneVerified
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                        : 'bg-amber-50 border-amber-200 text-amber-700'
                                }`}
                            >
                                <Icon icon={isPhoneVerified ? 'solar:shield-check-linear' : 'solar:shield-warning-linear'} />
                                {isPhoneVerified ? 'Phone verified' : 'Not verified (add phone)'}
                            </div>
                        </div>
                    </div>

                    {/* Profile image */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2">Profile Picture</label>
                        <div className="flex items-center gap-4">
                            {profile.profilePicture ? (
                                <img
                                    src={profile.profilePicture}
                                    alt="Profile"
                                    className="w-16 h-16 rounded-full object-cover border border-gray-200"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                                    <Icon icon="solar:user-linear" className="text-2xl" />
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={onImageChange} className="text-sm" />
                        </div>
                    </div>

                    {/* Editable fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Car Model</label>
                            <input
                                type="text"
                                value={profile.carModel}
                                onChange={(e) => onFieldChange('carModel', e.target.value)}
                                placeholder="e.g. Golf 7"
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">City</label>
                            <input
                                type="text"
                                value={profile.city}
                                onChange={(e) => onFieldChange('city', e.target.value)}
                                placeholder="e.g. Skopje"
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Birth Date</label>
                            <input
                                type="date"
                                value={profile.birthDate}
                                onChange={(e) => onFieldChange('birthDate', e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Profile Completion</label>
                            <div className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">{completionPercent}%</span>
                                    <span className="text-xs text-gray-500">{completionLabel}</span>
                                </div>
                                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-teal-500 rounded-full transition-all"
                                        style={{ width: `${completionPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">About Me</label>
                        <textarea
                            value={profile.bio}
                            onChange={(e) => onFieldChange('bio', e.target.value)}
                            rows={4}
                            placeholder="Short bio..."
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl px-6 py-2.5 text-sm font-medium"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </main>

            <AppFooter />
        </div>
    );
}
