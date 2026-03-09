import Navbar from './NavBar'
import Sidebar from './SideBar'
import Breadcrumb from './Breadcrumb'

export default function AdminLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
            <Navbar />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-6 overflow-auto">
                    <Breadcrumb />
                    {children}
                </main>
            </div>
        </div>
    )
}