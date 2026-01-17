import { Moon, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-islamic-dark text-white pt-10 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand Section */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <Moon className="w-6 h-6 text-islamic-gold fill-islamic-gold" />
                            <span className="text-xl font-bold">Al-Noor Masjid</span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Serving the community with faith, knowledge, and compassion.
                            Join us for prayers, events, and educational programs.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-islamic-gold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><a href="/prayer-times" className="hover:text-white">Prayer Times</a></li>
                            <li><a href="/events" className="hover:text-white">Upcoming Events</a></li>
                            <li><a href="/family-details" className="hover:text-white">Family Registration</a></li>
                            <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-islamic-gold mb-4">Contact Us</h3>
                        <div className="space-y-3 text-sm text-gray-300">
                            <div className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-islamic-gold mt-0.5" />
                                <span>123 Islamic Way, <br />City Helper, ST 12345</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-islamic-gold" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-islamic-gold" />
                                <span>contact@alnoormasjid.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
                    © {new Date().getFullYear()} Al-Noor Masjid. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
