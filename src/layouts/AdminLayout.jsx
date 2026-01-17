import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
    LayoutDashboard,
    Clock,
    Calendar,
    Users,
    MessageSquare,
    Menu,
    X,
    LogOut,
    Info,
    Megaphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Prayer Times', path: '/admin/prayer-times', icon: Clock },
        { name: 'Jumma Bayan', path: '/admin/bayan', icon: Calendar },
        { name: 'Events', path: '/admin/events', icon: Calendar },
        { name: 'Announcements', path: '/admin/announcements', icon: Megaphone },
        { name: 'About Section', path: '/admin/about', icon: Info },
        { name: 'Family Submissions', path: '/admin/family-submissions', icon: Users },
        { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
    ];

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-islamic-dark text-white">
                <div className="h-16 flex items-center justify-center border-b border-islamic-green">
                    <h1 className="text-xl font-bold text-islamic-gold">Masjid Admin</h1>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${isActive
                                            ? 'bg-islamic-green text-white'
                                            : 'text-gray-300 hover:bg-islamic-green/50 hover:text-white'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-4 border-t border-islamic-green">
                    <button
                        onClick={logout}
                        className="flex items-center space-x-3 text-gray-300 hover:text-white w-full px-4 py-2 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Mobile Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-islamic-dark text-white transform transition-transform duration-300 ease-in-out md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="h-16 flex items-center justify-between px-4 border-b border-islamic-green">
                    <h1 className="text-xl font-bold text-islamic-gold">Masjid Admin</h1>
                    <button onClick={() => setSidebarOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${isActive
                                            ? 'bg-islamic-green text-white'
                                            : 'text-gray-300 hover:bg-islamic-green/50 hover:text-white'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header - Mobile Only */}
                <header className="md:hidden bg-white shadow-sm h-16 flex items-center px-4">
                    <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="ml-4 text-lg font-semibold text-gray-800">Dashboard</span>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
