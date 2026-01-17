import { useState, useEffect } from 'react';
import { Reply, Trash2, Mail, Settings, X, Save } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import { messagesData } from '../../data/adminData';

const ViewMessages = () => {
    // Messages State
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('contactMessages');
        return saved ? JSON.parse(saved) : messagesData;
    });

    // Contact Info State
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [contactDetails, setContactDetails] = useState(() => {
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

    // Persistence
    useEffect(() => {
        localStorage.setItem('contactMessages', JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        localStorage.setItem('contactDetails', JSON.stringify(contactDetails));
    }, [contactDetails]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            setMessages(messages.filter(msg => msg.id !== id));
        }
    };

    const handleInfoChange = (e) => {
        const { name, value } = e.target;

        let finalValue = value;
        if (name === 'mapUrl' && value.includes('<iframe')) {
            // Extract src from iframe tag
            const srcMatch = value.match(/src="([^"]+)"/);
            if (srcMatch && srcMatch[1]) {
                finalValue = srcMatch[1];
            }
        }

        setContactDetails(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSaveInfo = (e) => {
        e.preventDefault();
        setIsEditingInfo(false);
        alert('Contact information updated successfully!');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Contact Messages</h2>
                <Button onClick={() => setIsEditingInfo(true)} variant="outline" className="gap-2">
                    <Settings className="w-4 h-4" /> Manage Contact Info
                </Button>
            </div>

            {/* Messages Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sender</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {messages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <Mail className="w-12 h-12 text-gray-300 mb-2" />
                                        <p>No messages found.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            messages.map((msg) => (
                                <TableRow key={msg.id}>
                                    <TableCell>
                                        <div className="font-medium text-gray-900">{msg.name}</div>
                                        <div className="text-sm text-gray-500">{msg.email}</div>
                                        <div className="text-xs text-gray-400">{msg.phone}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-md text-gray-600 line-clamp-2" title={msg.message}>
                                            {msg.message}
                                        </div>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap text-sm text-gray-500">
                                        {msg.date}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${msg.status === 'Unread'
                                            ? 'bg-blue-100 text-blue-800'
                                            : msg.status === 'Replied'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {msg.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Reply">
                                                <Reply className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(msg.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Contact Info Modal */}
            {isEditingInfo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white z-10">
                            <h3 className="text-lg font-bold text-gray-800">Edit Contact Information</h3>
                            <button
                                onClick={() => setIsEditingInfo(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveInfo} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Our Location</label>
                                <textarea
                                    name="address"
                                    value={contactDetails.address}
                                    onChange={handleInfoChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green/20 focus:border-islamic-green outline-none"
                                    placeholder="Enter address..."
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <textarea
                                    name="phone"
                                    value={contactDetails.phone}
                                    onChange={handleInfoChange}
                                    rows="2"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green/20 focus:border-islamic-green outline-none"
                                    placeholder="Enter phone..."
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Us</label>
                                <textarea
                                    name="email"
                                    value={contactDetails.email}
                                    onChange={handleInfoChange}
                                    rows="2"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green/20 focus:border-islamic-green outline-none"
                                    placeholder="Enter emails..."
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Imam Name</label>
                                    <input
                                        type="text"
                                        name="imamName"
                                        value={contactDetails.imamName}
                                        onChange={handleInfoChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green/20 focus:border-islamic-green outline-none"
                                        placeholder="Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Imam Email</label>
                                    <input
                                        type="text"
                                        name="imamEmail"
                                        value={contactDetails.imamEmail}
                                        onChange={handleInfoChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green/20 focus:border-islamic-green outline-none"
                                        placeholder="Email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Google Map Embed Code</label>
                                <textarea
                                    name="mapUrl"
                                    value={contactDetails.mapUrl || ''}
                                    onChange={handleInfoChange}
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green/20 focus:border-islamic-green outline-none text-xs font-mono"
                                    placeholder='Paste the full <iframe src="..."> code from Google Maps here'
                                ></textarea>
                                <p className="text-xs text-gray-500 mt-1">Paste the full iframe code. The system will extract the link automatically.</p>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditingInfo(false)}
                                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="gap-2">
                                    <Save className="w-4 h-4" /> Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ViewMessages;
