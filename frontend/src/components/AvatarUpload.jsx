import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../API/axios'

export default function AvatarUpload({ user, onUpdate }) {
    const inputRef = useRef(null)
    const [loading, setLoading] = useState(false)

    const getInitial = () => user?.name?.charAt(0).toUpperCase() || '?'

    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image must be under 2MB.')
            return
        }

        const formData = new FormData()
        formData.append('avatar', file)

        setLoading(true)
        try {
            const res = await api.post('/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            toast.success('Profile photo updated!')
            onUpdate(res.data.user)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed.')
        } finally {
            setLoading(false)
            e.target.value = ''
        }
    }

    const handleRemove = async () => {
        setLoading(true)
        try {
            await api.delete('/avatar')
            toast.success('Photo removed.')
            onUpdate({ ...user, avatar_url: null })
        } catch {
            toast.error('Failed to remove photo.')
        } finally { setLoading(false) }
    }

    return (
        <div className="flex items-center gap-5">
            {/* Avatar preview */}
            <div className="relative group">
                <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold overflow-hidden ring-4 ring-blue-100 dark:ring-blue-900">
                    {user?.avatar_url
                        ? <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                        : getInitial()
                    }
                </div>
                {/* Overlay on hover */}
                <button
                    onClick={() => inputRef.current?.click()}
                    disabled={loading}
                    className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                    <span className="text-white text-xs font-medium">📷</span>
                </button>
            </div>

            {/* Buttons */}
            <div className="space-y-2">
                <button
                    onClick={() => inputRef.current?.click()}
                    disabled={loading}
                    className="btn-secondary text-sm block"
                >
                    {loading ? 'Uploading...' : '📷 Change Photo'}
                </button>
                {user?.avatar_url && (
                    <button
                        onClick={handleRemove}
                        disabled={loading}
                        className="text-xs text-red-500 hover:underline block"
                    >
                        Remove photo
                    </button>
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500">JPG, PNG or WEBP — max 2MB</p>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    )
}