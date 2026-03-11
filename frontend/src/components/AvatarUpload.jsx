import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { FiCamera, FiTrash2 } from 'react-icons/fi'
import api from '../API/api'

export default function AvatarUpload({ user, onUpdate }) {
    const inputRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState(null)

    const getAvatarSrc = (avatarUrl) => {
        if (!avatarUrl) return null
        if (avatarUrl.startsWith('http')) return avatarUrl
        return `${avatarUrl}?t=${Date.now()}`
    }

    const avatarSrc = preview || getAvatarSrc(user?.avatar_url)

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image must be under 2MB.')
            return
        }

        setPreview(URL.createObjectURL(file))
        const formData = new FormData()
        formData.append('avatar', file)

        setLoading(true)
        try {
            const res = await api.post('/avatar', formData)
            // console.log('avatar response:', res.data.user)  
            toast.success('Profile photo updated!')
            setPreview(null)
            onUpdate(res.data.user)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed.')
            setPreview(null)
            console.error(err)
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
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-3 sm:gap-4 md:gap-5">

            {/* Avatar circle */}
            <div className="relative group flex-shrink-0">
                <div className="
                    w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20
                    rounded-full bg-transparent dark:bg-gray-700
                    text-white flex items-center justify-center
                    text-2xl sm:text-3xl font-bold overflow-hidden
                    ring-2 sm:ring-4 ring-blue-100 dark:ring-blue-900
                ">
                    {avatarSrc ? (
                        <img
                            src={avatarSrc}
                            alt={user?.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none' }}
                        />
                    ) : (
                        user?.name?.charAt(0).toUpperCase() || '?'
                    )}
                </div>

                {/* Hover overlay */}
                <button
                    onClick={() => inputRef.current?.click()}
                    disabled={loading}
                    className="absolute inset-0 rounded-full bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer gap-0.5"
                >
                    <FiCamera className="text-white text-base sm:text-lg" />
                    <span className="text-white text-xs font-medium">Change</span>
                </button>

                {/* Loading spinner */}
                {loading && (
                    <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-1.5 sm:gap-2">
                <button
                    onClick={() => inputRef.current?.click()}
                    disabled={loading}
                    className="btn-secondary flex items-center gap-1.5 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2"
                >
                    <FiCamera className="flex-shrink-0" />
                    {loading ? 'Uploading...' : 'Change Photo'}
                </button>

                {(user?.avatar_url || preview) && !loading && (
                    <button
                        onClick={handleRemove}
                        className="flex items-center gap-1.5 text-xs sm:text-sm text-red-500 hover:text-red-700 hover:underline transition-colors"
                    >
                        <FiTrash2 className="flex-shrink-0" />
                        Remove photo
                    </button>
                )}

                <p className="text-xs text-gray-400 dark:text-gray-500">
                    JPG, PNG or WEBP · max 2MB
                </p>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    )
}