import Navbar from './NavBar'
import Sidebar from './SideBar'
import Breadcrumb from './Breadcrumb'

export default function AdminLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
            <Navbar />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 overflow-auto
                    p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 2xl:p-10
                    min-w-0
                ">
                    <Breadcrumb />
                    {children}
                </main>
            </div>
        </div>
    )
}