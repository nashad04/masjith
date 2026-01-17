import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Card, { CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Contact = () => {
    // Contact Info State (Address, Phone, etc.)
    const [contactInfo] = useState(() => {
        const saved = localStorage.getItem('contactDetails');
        return saved ? JSON.parse(saved) : {
            address: '123 Islamic Way\nCity Helper, ST 12345',
            phone: '+1 (555) 123-4567\nMon-Fri 9am-5pm',
            email: 'contact@alnoormasjid.com\ninfo@alnoormasjid.com',
            imamName: 'Sheikh Ahmed',
            imamEmail: 'ahmed@alnoormasjid.com',
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49386.62815117337!2d80.58458125966354!3d7.294628573415851!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae366266498acd3%3A0x411a3818a1e03c35!2sKandy!5e1!3m2!1sen!2slk!4v1768622091547!5m2!1sen!2slk'
        };
    });

    // Message Form State
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newMessage = {
            id: Date.now(),
            ...formData,
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            status: 'Unread'
        };

        // Get existing messages
        const existingMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');

        // Save new message
        localStorage.setItem('contactMessages', JSON.stringify([newMessage, ...existingMessages]));

        alert('Message sent successfully! We will get back to you soon.');
        setFormData({ name: '', phone: '', email: '', message: '' });
    };

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-islamic-dark mb-4">Contact Us</h1>
                    <p className="text-gray-600">We are here to help and answer any questions you might have.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                    >
                        {/* Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="hover:shadow-md transition-shadow">
                                <CardContent className="flex flex-col items-center text-center p-6">
                                    <div className="bg-islamic-green/10 p-3 rounded-full mb-4">
                                        <MapPin className="w-6 h-6 text-islamic-green" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">Our Location</h3>
                                    <p className="text-sm text-gray-600 whitespace-pre-line">{contactInfo.address}</p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-md transition-shadow">
                                <CardContent className="flex flex-col items-center text-center p-6">
                                    <div className="bg-islamic-green/10 p-3 rounded-full mb-4">
                                        <Phone className="w-6 h-6 text-islamic-green" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">Phone Number</h3>
                                    <p className="text-sm text-gray-600 whitespace-pre-line">{contactInfo.phone}</p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-md transition-shadow">
                                <CardContent className="flex flex-col items-center text-center p-6">
                                    <div className="bg-islamic-green/10 p-3 rounded-full mb-4">
                                        <Mail className="w-6 h-6 text-islamic-green" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">Email Us</h3>
                                    <p className="text-sm text-gray-600 whitespace-pre-line">{contactInfo.email}</p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-md transition-shadow">
                                <CardContent className="flex flex-col items-center text-center p-6">
                                    <div className="bg-islamic-green/10 p-3 rounded-full mb-4">
                                        <div className="w-6 h-6 flex items-center justify-center font-bold text-islamic-green">Imam</div>
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">Imam's Office</h3>
                                    <p className="text-sm text-gray-600">
                                        {contactInfo.imamName}<br />
                                        {contactInfo.imamEmail}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Map Placeholder or Embed */}
                        <div className="bg-gray-200 h-64 w-full rounded-lg overflow-hidden relative shadow-inner">
                            {contactInfo.mapUrl ? (
                                <iframe
                                    src={contactInfo.mapUrl}
                                    className="w-full h-full border-0"
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Masjid Location"
                                ></iframe>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    <span className="flex items-center gap-2 font-medium">
                                        <MapPin className="w-5 h-5" /> Google Map Placeholder
                                    </span>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card className="p-6 md:p-8 shadow-xl">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Input
                                        label="Your Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Full Name"
                                        required
                                    />
                                    <Input
                                        label="Phone Number"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 (000) 000-0000"
                                    />
                                </div>

                                <Input
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea
                                        rows={5}
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-islamic-green focus:border-islamic-green resize-none"
                                        placeholder="How can we help you?"
                                        required
                                    ></textarea>
                                </div>

                                <Button type="submit" className="w-full py-3 text-lg gap-2" variant="primary">
                                    <Send className="w-5 h-5" /> Send Message
                                </Button>
                            </form>
                        </Card>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default Contact;
