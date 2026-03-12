import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiArrowLeft, FiUser, FiMail, FiLock, FiShield, FiSave, FiAlertTriangle, FiCheck, FiX, FiEye, FiEyeOff } from 'react-icons/fi'
import Navbar from '../../components/NavBar'
import AvatarUpload from '../../components/AvatarUpload'
import PasswordStrength from '../../components/PasswordStrength'
import AdminLayout from '../../components/AdminLayout'
import { profileAPI } from '../../API/profileAPI'
import { useAuth } from '../../context/AuthContext'

export default function Profile() {
    const { user: authUser, logout, updateUser } = useAuth()
    const navigate = useNavigate()
    const isAdmin = authUser?.role === 'admin'

    const [profile, setProfile]   = useState({ name: '', email: '', role: '', created_at: '', avatar_url: null })
    const [pwForm, setPwForm]     = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
    const [loadingProfile, setLP] = useState(false)
    const [loadingPw, setLPw]     = useState(false)
    const [activeTab, setActiveTab] = useState('profile')

    // Show/hide toggles for password fields
    const [showCurrent, setShowCurrent]   = useState(false)
    const [showNew, setShowNew]           = useState(false)
    const [showConfirm, setShowConfirm]   = useState(false)

    useEffect(() => {
        profileAPI.get().then((res) => setProfile(res.data.user))
    }, [])

    const handleProfileSave = async (e) => {
        e.preventDefault(); setLP(true)
        try {
            const res = await profileAPI.update({ name: profile.name, email: profile.email })
            const updated = { ...profile, ...res.data.user }
            setProfile(updated)
            updateUser(updated)
            toast.success('Profile updated!')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error updating profile.')
        } finally { setLP(false) }
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault()
        if (pwForm.newPassword !== pwForm.confirmPassword)
            return toast.error('New passwords do not match.')
        if (pwForm.newPassword.length < 6)
            return toast.error('Password must be at least 6 characters.')
        setLPw(true)
        try {
            await profileAPI.changePassword({
                currentPassword: pwForm.currentPassword,
                newPassword: pwForm.newPassword,
            })
            toast.success('Password changed! Logging you out...')
            setTimeout(() => { logout(); navigate('/login') }, 1500)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error changing password.')
        } finally {
            setLPw(false)
            setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        }
    }

    const handleAvatarUpdate = (updatedUser) => {
        const merged = { ...profile, ...updatedUser }
        setProfile(merged)
        updateUser(merged)
    }

    const tabs = [
        { key: 'profile',  label: 'Profile',  icon: <FiUser className="flex-shrink-0" /> },
        { key: 'password', label: 'Password', icon: <FiLock className="flex-shrink-0" /> },
    ]

    const content = (
        <div className="w-full max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">

            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline mb-3 sm:mb-4"
            >
                <FiArrowLeft className="flex-shrink-0" />
                Back
            </button>

            {/* Avatar card */}
            <div className="card mb-4 sm:mb-5 md:mb-6 p-4 sm:p-5 md:p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
                <AvatarUpload user={profile} onUpdate={handleAvatarUpdate} />
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-800">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                        {profile.name}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 capitalize mt-0.5">
                        {profile.role} · Joined {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : ''}
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-1 mb-4 sm:mb-5 md:mb-6 w-fit">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setActiveTab(t.key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                            activeTab === t.key
                                ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400 border border-gray-200 dark:border-gray-600'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        }`}
                    >
                        {t.icon}
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Profile tab */}
            {activeTab === 'profile' && (
                <div className="card p-4 sm:p-5 md:p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
                    <h2 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3 sm:mb-4">
                        <FiUser className="text-blue-500 flex-shrink-0" />
                        Personal Information
                    </h2>
                    <form onSubmit={handleProfileSave} className="space-y-3 sm:space-y-4">
                        <div>
                            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                <FiUser className="text-gray-400 flex-shrink-0" /> Full Name
                            </label>
                            <input
                                className="input text-sm sm:text-base"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                <FiMail className="text-gray-400 flex-shrink-0" /> Email Address
                            </label>
                            <input
                                type="email"
                                className="input text-sm sm:text-base"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                <FiShield className="text-gray-400 flex-shrink-0" /> Role
                            </label>
                            <input
                                className="input text-sm sm:text-base bg-gray-50 dark:bg-gray-800 cursor-not-allowed capitalize"
                                value={profile.role}
                                disabled
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loadingProfile}
                            className="btn-primary flex items-center gap-2 text-sm sm:text-base px-4 py-2 sm:px-5 sm:py-2.5"
                        >
                            <FiSave className="flex-shrink-0" />
                            {loadingProfile ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            )}

            {/* Password tab */}
            {activeTab === 'password' && (
                <div className="card p-4 sm:p-5 md:p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
                    <h2 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3 sm:mb-4">
                        <FiLock className="text-blue-500 flex-shrink-0" />
                        Change Password
                    </h2>
                    <form onSubmit={handlePasswordChange} className="space-y-3 sm:space-y-4">
                        <div>
                            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                <FiLock className="text-gray-400 flex-shrink-0" /> Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showCurrent ? 'text' : 'password'}
                                    className="input text-sm sm:text-base pr-10"
                                    value={pwForm.currentPassword}
                                    onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                                    required
                                />
                                <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                    {showCurrent ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                <FiLock className="text-gray-400 flex-shrink-0" /> New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNew ? 'text' : 'password'}
                                    className="input text-sm sm:text-base pr-10"
                                    value={pwForm.newPassword}
                                    onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                                    required
                                />
                                <button type="button" onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                    {showNew ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </div>
                            <PasswordStrength password={pwForm.newPassword} />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                <FiLock className="text-gray-400 flex-shrink-0" /> Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    className="input text-sm sm:text-base pr-10"
                                    value={pwForm.confirmPassword}
                                    onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                                    required
                                />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                    {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </div>
                            {pwForm.confirmPassword && (
                                <p className={`flex items-center gap-1 text-xs mt-1 ${pwForm.newPassword === pwForm.confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                                    {pwForm.newPassword === pwForm.confirmPassword
                                        ? <><FiCheck className="flex-shrink-0" /> Passwords match</>
                                        : <><FiX className="flex-shrink-0" /> Passwords do not match</>
                                    }
                                </p>
                            )}
                        </div>

                        {/* Warning */}
                        <div className="flex items-start gap-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3">
                            <FiAlertTriangle className="text-yellow-500 flex-shrink-0 mt-0.5 text-sm sm:text-base" />
                            <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-400">
                                You will be logged out after changing your password.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loadingPw}
                            className="btn-primary flex items-center gap-2 text-sm sm:text-base px-4 py-2 sm:px-5 sm:py-2.5"
                        >
                            <FiLock className="flex-shrink-0" />
                            {loadingPw ? 'Changing...' : 'Change Password'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    )

    if (isAdmin) {
        return <AdminLayout>{content}</AdminLayout>
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />
            <main className="px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 lg:py-8">
                {content}
            </main>
        </div>
    )
}