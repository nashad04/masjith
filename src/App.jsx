import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import RouteDebugger from './components/RouteDebugger';
import { TranslationProvider } from './context/TranslationContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import PrayerTimes from './pages/public/PrayerTimes';
import Events from './pages/public/Events';
import Contact from './pages/public/Contact';
import FamilyDetails from './pages/public/FamilyDetails';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManagePrayerTimes from './pages/admin/ManagePrayerTimes';
import ManageEvents from './pages/admin/ManageEvents';
import ManageBayan from './pages/admin/ManageBayan';
import ViewFamilySubmissions from './pages/admin/ViewFamilySubmissions';
import ViewMessages from './pages/admin/ViewMessages';
import ManageAbout from './pages/admin/ManageAbout';
import ManageAnnouncements from './pages/admin/ManageAnnouncements';

function App() {
    return (
        <TranslationProvider>
            <AuthProvider>
                <Router>
                    <RouteDebugger />
                    <Routes>
                        {/* Login Route */}
                        <Route path="/login" element={<Login />} />

                        {/* Admin Routes - Protected */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/admin" element={<AdminLayout />}>
                                <Route index element={<Dashboard />} />
                                <Route path="prayer-times" element={<ManagePrayerTimes />} />
                                <Route path="events" element={<ManageEvents />} />
                                <Route path="bayan" element={<ManageBayan />} />
                                <Route path="family-submissions" element={<ViewFamilySubmissions />} />
                                <Route path="messages" element={<ViewMessages />} />
                                <Route path="about" element={<ManageAbout />} />
                                <Route path="announcements" element={<ManageAnnouncements />} />
                            </Route>
                        </Route>

                        {/* Public Routes */}
                        <Route path="/" element={<MainLayout />}>
                            <Route index element={<Home />} />
                            <Route path="prayer-times" element={<PrayerTimes />} />
                            <Route path="events" element={<Events />} />
                            <Route path="contact" element={<Contact />} />
                            <Route path="family-details" element={<FamilyDetails />} />
                        </Route>

                        {/* Catch-all 404 */}
                        <Route path="*" element={
                            <div className="flex flex-col items-center justify-center min-h-screen">
                                <h1 className="text-4xl font-bold text-islamic-green mb-4">404</h1>
                                <p className="text-gray-600 mb-8">Page Not Found</p>
                                <div className="text-xs text-gray-400 mb-4 bg-gray-100 p-2 rounded">
                                    Route not matched. Check URL.
                                </div>
                                <a href="/" className="text-islamic-green hover:underline">Go Home</a>
                            </div>
                        } />
                    </Routes>
                </Router>
            </AuthProvider>
        </TranslationProvider>
    );
}

export default App;