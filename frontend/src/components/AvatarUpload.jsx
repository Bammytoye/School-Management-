import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../API/axios';

export default function AvatarUpload({ user, onUpdate }) {
    const inputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);

    const avatarSrc = preview || (user?.avatar_url ? `http://localhost:8000${user.avatar_url}?t=${Date.now()}` : null);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image must be under 2MB.');
            return;
        }

        setPreview(URL.createObjectURL(file));
        const formData = new FormData();
        formData.append('avatar', file);

        setLoading(true);
        try {
            const res = await api.post('/avatar', formData);
            toast.success('Profile photo updated!');
            setPreview(null);
            onUpdate(res.data.user); // sync Navbar + Profile
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed.');
            setPreview(null);
            console.error(err);
        } finally {
            setLoading(false);
            e.target.value = '';
        }
    };

    const handleRemove = async () => {
        setLoading(true);
        try {
            await api.delete('/avatar');
            toast.success('Photo removed.');
            onUpdate({ ...user, avatar_url: null });
        } catch {
            toast.error('Failed to remove photo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-5">
            <div className="relative group flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 text-white flex items-center justify-center text-3xl font-bold overflow-hidden ring-4 ring-blue-100 dark:ring-blue-900">
                    {avatarSrc ? (
                        <img src={avatarSrc} alt={user?.name} className="w-full h-full object-cover" />
                    ) : (
                        user?.name?.charAt(0).toUpperCase() || '?'
                    )}
                </div>
                <button
                    onClick={() => inputRef.current?.click()}
                    disabled={loading}
                    className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer gap-0.5"
                >
                    <span className="text-lg">📷</span>
                    <span className="text-white text-xs font-medium">Change</span>
                </button>

                {loading && (
                    <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
            />

            {(user?.avatar_url || preview) && !loading && (
                <button onClick={handleRemove} className="block text-xs text-red-500 hover:text-red-700 hover:underline">
                    Remove photo
                </button>
            )}
        </div>
    );
}