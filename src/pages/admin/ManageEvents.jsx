import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Calendar, Clock, MapPin, Upload } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { eventsData } from '../../data/events';

const ManageEvents = () => {
    // Initialize events from localStorage or fallback
    const [events, setEvents] = useState(() => {
        const saved = localStorage.getItem('eventsData');
        return saved ? JSON.parse(saved) : eventsData;
    });

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEvent, setCurrentEvent] = useState({
        id: '',
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        image: ''
    });

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('eventsData', JSON.stringify(events));
    }, [events]);

    // Handlers
    const handleAdd = () => {
        setIsEditing(false);
        setCurrentEvent({
            id: '',
            title: '',
            date: '',
            time: '',
            location: '',
            description: '',
            image: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&q=80&w=1000' // Default placeholder
        });
        setIsModalOpen(true);
    };

    const handleEdit = (event) => {
        setIsEditing(true);
        setCurrentEvent(event);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            setEvents(events.filter(e => e.id !== id));
        }
    };

    const handleSave = (e) => {
        e.preventDefault();

        if (isEditing) {
            setEvents(events.map(ev => ev.id === currentEvent.id ? currentEvent : ev));
        } else {
            const newEvent = { ...currentEvent, id: Date.now() };
            setEvents([...events, newEvent]);
        }

        setIsModalOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentEvent(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 500000) { // 500KB limit
                alert("File is too large. Please upload an image smaller than 500KB.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setCurrentEvent(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Manage Events</h2>
                <Button className="gap-2" onClick={handleAdd}>
                    <Plus className="w-4 h-4" /> Add New Event
                </Button>
            </div>

            {/* Events Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Event Title</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                    No events found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            events.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={event.image || 'https://via.placeholder.com/150'}
                                                alt=""
                                                className="w-10 h-10 rounded object-cover bg-gray-100"
                                            />
                                            <span className="font-medium text-gray-900">{event.title}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <p className="font-medium">{event.date}</p>
                                            <p className="text-gray-500">{event.time}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{event.location}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(event)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(event.id)}
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

            {/* Event Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white z-10">
                            <h3 className="text-lg font-bold text-gray-800">
                                {isEditing ? 'Edit Event' : 'Add New Event'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={currentEvent.title}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green/20 focus:border-islamic-green outline-none"
                                    placeholder="e.g. Community Iftar"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            name="date"
                                            value={currentEvent.date}
                                            onChange={handleChange}
                                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green/20 focus:border-islamic-green outline-none"
                                            placeholder="e.g. Oct 15, 2024"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            name="time"
                                            value={currentEvent.time}
                                            onChange={handleChange}
                                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green/20 focus:border-islamic-green outline-none"
                                            placeholder="e.g. 5:00 PM"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        name="location"
                                        value={currentEvent.location}
                                        onChange={handleChange}
                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green/20 focus:border-islamic-green outline-none"
                                        placeholder="e.g. Main Prayer Hall"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Image</label>
                                <div className="border border-gray-300 rounded-lg p-3 space-y-3">
                                    {currentEvent.image && (
                                        <div className="relative w-full h-32 bg-gray-100 rounded-md overflow-hidden">
                                            <img
                                                src={currentEvent.image}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setCurrentEvent(prev => ({ ...prev, image: '' }))}
                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 border-dashed rounded-lg text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                                        >
                                            <Upload className="w-4 h-4" />
                                            {currentEvent.image ? 'Change Image' : 'Upload Image'}
                                        </label>
                                        <p className="text-xs text-center text-gray-500 mt-1">Max size: 500KB</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={currentEvent.description}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green/20 focus:border-islamic-green outline-none resize-none"
                                    placeholder="Event details..."
                                    required
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsModalOpen(false)}
                                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {isEditing ? 'Save Changes' : 'Create Event'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ManageEvents;
