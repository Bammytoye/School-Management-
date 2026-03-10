import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../../components/NavBar'
import Sidebar from '../../components/SideBar'
import Breadcrumb from '../../components/Breadcrumb'
import AvatarUpload from '../../components/AvatarUpload'
import PasswordStrength from '../../components/PasswordStrength'
import { profileAPI } from '../../API/profileAPI'
import { useAuth } from '../../context/AuthContext'

export default function Profile() {
    const { user: authUser, logout, updateUser } = useAuth()
    const navigate = useNavigate()
    const isAdmin = authUser?.role === 'admin'

    const [profile, setProfile] = useState({ name: '', email: '', role: '', created_at: '', avatar_url: null })
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
    const [loadingProfile, setLP] = useState(false)
    const [loadingPw, setLPw] = useState(false)
    const [tab, setTab] = useState('profile')

    useEffect(() => {
        profileAPI.get().then((res) => setProfile(res.data.user))
    }, [])

    const handleProfileSave = async (e) => {
        e.preventDefault(); setLP(true)
        try {
            const res = await profileAPI.update({ name: profile.name, email: profile.email })
            const updated = { ...profile, ...res.data.user }
            setProfile(updated)
            updateUser(updated)  // ← sync navbar too
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

    // Called by AvatarUpload after upload or remove
    const handleAvatarUpdate = (updatedUser) => {
        const merged = { ...profile, ...updatedUser };
        setProfile(merged);    // updates profile page avatar
        updateUser(merged);    // updates navbar avatar
    };

    const content = (
        <div className="max-w-2xl mx-auto">
            <Breadcrumb />

            {/* ── Header with Avatar ── */}
            <div className="card mb-6">
                <AvatarUpload
                    user={profile}
                    onUpdate={handleAvatarUpdate} // sync Profile + Navbar
                />
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">{profile.name}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mt-0.5">
                        {profile.role} · Joined {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : ''}
                    </p>
                </div>
            </div>

            {/* ── Tabs ── */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6 w-fit">
                {[
                    { key: 'profile', label: '👤 Profile' },
                    { key: 'password', label: '🔒 Password' },
                ].map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.key
                            ? 'bg-white dark:bg-gray-700 shadow text-gray-800 dark:text-white'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ── Profile Tab ── */}
            {tab === 'profile' && (
                <div className="card">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Personal Information</h2>
                    <form onSubmit={handleProfileSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                            <input className="input" value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                            <input type="email" className="input" value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                            <input className="input bg-gray-50 dark:bg-gray-800 cursor-not-allowed capitalize"
                                value={profile.role} disabled />
                        </div>
                        <button type="submit" disabled={loadingProfile} className="btn-primary">
                            {loadingProfile ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            )}

            {/* ── Password Tab ── */}
            {tab === 'password' && (
                <div className="card">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Change Password</h2>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                            <input type="password" className="input" value={pwForm.currentPassword}
                                onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                            <input type="password" className="input" value={pwForm.newPassword}
                                onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} required />
                            <PasswordStrength password={pwForm.newPassword} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                            <input type="password" className="input" value={pwForm.confirmPassword}
                                onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} required />
                            {pwForm.confirmPassword && (
                                <p className={`text-xs mt-1 ${pwForm.newPassword === pwForm.confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                                    {pwForm.newPassword === pwForm.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                                </p>
                            )}
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg px-4 py-3 text-sm text-yellow-700 dark:text-yellow-400">
                            ⚠️ You will be logged out after changing your password.
                        </div>
                        <button type="submit" disabled={loadingPw} className="btn-primary">
                            {loadingPw ? 'Changing...' : 'Change Password'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    )

    if (isAdmin) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
                <Navbar />
                <div className="flex flex-1">
                    <Sidebar />
                    <main className="flex-1 p-6">{content}</main>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />
            <main className="max-w-2xl mx-auto p-6">{content}</main>
        </div>
    )
}