import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function AdminLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-6 bg-gray-50 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}