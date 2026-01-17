import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Mic, X, Save } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { bayanData } from '../../data/bayan';

const ManageBayan = () => {
    const [bayans, setBayans] = useState(() => {
        const saved = localStorage.getItem('jummaBayan');
        return saved ? JSON.parse(saved) : bayanData;
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBayan, setCurrentBayan] = useState(null);
    const [formData, setFormData] = useState({
        topic: '',
        speaker: '',
        date: '',
        time: '12:45 PM',
        language: 'English',
        status: 'Upcoming'
    });

    useEffect(() => {
        localStorage.setItem('jummaBayan', JSON.stringify(bayans));
    }, [bayans]);

    const handleEdit = (bayan) => {
        setCurrentBayan(bayan);
        setFormData(bayan);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setCurrentBayan(null);
        setFormData({
            topic: '',
            speaker: '',
            date: '',
            time: '12:45 PM',
            language: 'English',
            status: 'Upcoming'
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this Bayan?')) {
            setBayans(bayans.filter(b => b.id !== id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (currentBayan) {
            // Edit
            setBayans(bayans.map(b => b.id === currentBayan.id ? { ...formData, id: currentBayan.id } : b));
        } else {
            // Add
            setBayans([{ ...formData, id: Date.now() }, ...bayans]);
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
                <h2 className="text-2xl font-bold text-gray-800">Manage Jumma Bayan</h2>
                <Button onClick={handleAdd} className="gap-2">
                    <Plus className="w-4 h-4" /> Add New Topic
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Topic</TableHead>
                            <TableHead>Speaker</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Language</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bayans.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    No Bayan sessions found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            bayans.map((bayan) => (
                                <TableRow key={bayan.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-islamic-green/10 p-2 rounded-full text-islamic-green">
                                                <Mic className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium text-gray-900">{bayan.topic}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{bayan.speaker}</TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <p className="font-medium">{bayan.date}</p>
                                            <p className="text-gray-500">{bayan.time}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{bayan.language}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${bayan.status === 'Upcoming'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {bayan.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(bayan)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(bayan.id)}
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
                                {currentBayan ? 'Edit Bayan' : 'Add New Bayan'}
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                                <input
                                    type="text"
                                    name="topic"
                                    value={formData.topic}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green/20 focus:border-islamic-green outline-none"
                                    placeholder="e.g. Importance of Community"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Speaker</label>
                                    <input
                                        type="text"
                                        name="speaker"
                                        value={formData.speaker}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green/20 focus:border-islamic-green outline-none"
                                        placeholder="Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                                    <select
                                        name="language"
                                        value={formData.language}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green/20 focus:border-islamic-green outline-none"
                                    >
                                        <option value="English">English</option>
                                        <option value="Tamil">Tamil</option>
                                        <option value="Sinhala">Sinhala</option>
                                        <option value="Arabic">Arabic</option>
                                        <option value="English / Arabic">English / Arabic</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                    <input
                                        type="text"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green/20 focus:border-islamic-green outline-none"
                                        placeholder="e.g. 12:45 PM"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green/20 focus:border-islamic-green outline-none"
                                >
                                    <option value="Upcoming">Upcoming</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
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
                                    <Save className="w-4 h-4" /> {currentBayan ? 'Save Changes' : 'Create Bayan'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ManageBayan;
