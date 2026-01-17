import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Megaphone, X, Save } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { announcementsData } from '../../data/events';

const ManageAnnouncements = () => {
    const [announcements, setAnnouncements] = useState(() => {
        const saved = localStorage.getItem('homeAnnouncements');
        return saved ? JSON.parse(saved) : announcementsData;
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        content: ''
    });

    useEffect(() => {
        localStorage.setItem('homeAnnouncements', JSON.stringify(announcements));
    }, [announcements]);

    const handleEdit = (item) => {
        setCurrentAnnouncement(item);
        setFormData(item);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setCurrentAnnouncement(null);
        setFormData({
            title: '',
            date: new Date().toISOString().split('T')[0],
            content: ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            setAnnouncements(announcements.filter(a => a.id !== id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentAnnouncement) {
            setAnnouncements(announcements.map(a => a.id === currentAnnouncement.id ? { ...formData, id: currentAnnouncement.id } : a));
        } else {
            setAnnouncements([{ ...formData, id: Date.now() }, ...announcements]);
        }
        setIsModalOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Manage Announcements</h2>
                <Button onClick={handleAdd} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Announcement
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Content</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {announcements.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                    No announcements found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            announcements.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-islamic-green/10 p-2 rounded-full text-islamic-green">
                                                <Megaphone className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium text-gray-900">{item.title}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="line-clamp-2 max-w-md text-gray-600 sm:text-sm">{item.content}</p>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap text-sm text-gray-500">
                                        {item.date}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white z-10">
                            <h3 className="text-lg font-bold text-gray-800">
                                {currentAnnouncement ? 'Edit Announcement' : 'New Announcement'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green/20 focus:border-islamic-green outline-none"
                                    placeholder="Announcement Header"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green/20 focus:border-islamic-green outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green/20 focus:border-islamic-green outline-none"
                                    placeholder="Details of the announcement..."
                                    required
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsModalOpen(false)}
                                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="gap-2">
                                    <Save className="w-4 h-4" /> Save
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAnnouncements;
