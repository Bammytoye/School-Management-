import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { profileAPI } from '../api/profileAPI';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const { user: authUser, logout } = useAuth();
    const navigate = useNavigate();
    const isAdmin = authUser?.role === 'admin';

    const [profile, setProfile] = useState({ name: '', email: '', role: '', created_at: '' });
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [loadingProfile, setLP] = useState(false);
    const [loadingPw, setLPw] = useState(false);
    const [tab, setTab] = useState('profile'); // 'profile' | 'password'

    useEffect(() => {
        profileAPI.get().then((res) => setProfile(res.data.user));
    }, []);

    const handleProfileSave = async (e) => {
        e.preventDefault(); setLP(true);
        try {
            const res = await profileAPI.update({ name: profile.name, email: profile.email });
            setProfile(res.data.user);
            toast.success('Profile updated!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error updating profile.');
        } finally { setLP(false); }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            return toast.error('New passwords do not match.');
        }
        setLPw(true);
        try {
            await profileAPI.changePassword({
                currentPassword: pwForm.currentPassword,
                newPassword: pwForm.newPassword,
            });
            toast.success('Password changed! Please log in again.');
            setTimeout(() => { logout(); navigate('/login'); }, 1500);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error changing password.');
        } finally { setLPw(false); setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }
    };

    const content = (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                    {profile.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
                    <p className="text-gray-500 text-sm capitalize">{profile.role} · Joined {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : ''}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
                {['profile', 'password'].map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${tab === t ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {t === 'profile' ? '👤 Profile' : '🔒 Password'}
                    </button>
                ))}
            </div>

            {/* Profile Tab */}
            {tab === 'profile' && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h2>
                    <form onSubmit={handleProfileSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                className="input"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                className="input"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <input className="input bg-gray-50 text-gray-500 cursor-not-allowed capitalize" value={profile.role} disabled />
                        </div>
                        <button type="submit" disabled={loadingProfile} className="btn-primary">
                            {loadingProfile ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            )}

            {/* Password Tab */}
            {tab === 'password' && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Change Password</h2>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <input type="password" className="input" value={pwForm.currentPassword}
                                onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input type="password" className="input" value={pwForm.newPassword} minLength={6}
                                onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input type="password" className="input" value={pwForm.confirmPassword}
                                onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} required />
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-700">
                            ⚠️ You will be logged out after changing your password.
                        </div>
                        <button type="submit" disabled={loadingPw} className="btn-primary">
                            {loadingPw ? 'Changing...' : 'Change Password'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );

    if (isAdmin) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex flex-1">
                    <Sidebar />
                    <main className="flex-1 p-6 bg-gray-50">{content}</main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-2xl mx-auto p-6">{content}</main>
        </div>
    );
}