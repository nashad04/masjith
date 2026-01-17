import { useState, useEffect } from 'react';
import { Edit2, Save, X, RotateCcw } from 'lucide-react';
import { weeklyPrayerTimes } from '../../data/prayerTimes';
import Button from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';

const ManagePrayerTimes = () => {
    // Initialize state from localStorage or fallback to default data
    const [times, setTimes] = useState(() => {
        const saved = localStorage.getItem('prayerTimes');
        return saved ? JSON.parse(saved) : weeklyPrayerTimes;
    });

    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    // Effect to ensuring localStorage is synced just in case, but we manual save primarily
    useEffect(() => {
        localStorage.setItem('prayerTimes', JSON.stringify(times));
    }, [times]);

    const handleEdit = (dayIndex) => {
        setEditingId(dayIndex);
        setEditForm(times[dayIndex]);
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleSave = () => {
        const updatedTimes = [...times];
        updatedTimes[editingId] = editForm;
        setTimes(updatedTimes);
        setEditingId(null);
        // Explicitly saving here for clarity, though useEffect handles it too
        localStorage.setItem('prayerTimes', JSON.stringify(updatedTimes));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all times to default values? This action cannot be undone.')) {
            setTimes(weeklyPrayerTimes);
            localStorage.setItem('prayerTimes', JSON.stringify(weeklyPrayerTimes));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Manage Prayer Times</h2>
                    <p className="text-sm text-gray-500 mt-1">Updates are reflected immediately on the public site.</p>
                </div>
                <Button variant="outline" onClick={handleReset} className="text-red-600 border-red-200 hover:bg-red-50">
                    <RotateCcw className="w-4 h-4 mr-2" /> Reset Defaults
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-32">Day</TableHead>
                            <TableHead>Fajr</TableHead>
                            <TableHead>Dhuhr</TableHead>
                            <TableHead>Asr</TableHead>
                            <TableHead>Maghrib</TableHead>
                            <TableHead>Isha</TableHead>
                            <TableHead className="text-right w-24">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {times.map((day, index) => (
                            <TableRow key={index} className={editingId === index ? 'bg-indigo-50/50' : ''}>
                                {/* Day Name (Read-only) */}
                                <TableCell className="font-medium text-gray-900">
                                    {day.day}
                                </TableCell>

                                {/* Time Inputs or Text */}
                                {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map((period) => (
                                    <TableCell key={period} className="p-2">
                                        {editingId === index ? (
                                            <input
                                                type="text"
                                                name={period}
                                                value={editForm[period]}
                                                onChange={handleChange}
                                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                            />
                                        ) : (
                                            <span className="text-gray-600">{day[period]}</span>
                                        )}
                                    </TableCell>
                                ))}

                                {/* Actions */}
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {editingId === index ? (
                                            <>
                                                <button
                                                    onClick={handleSave}
                                                    className="p-1.5 text-green-600 hover:bg-green-100 rounded-md transition-colors"
                                                    title="Save"
                                                >
                                                    <Save className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={handleCancel}
                                                    className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
                                                    title="Cancel"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleEdit(index)}
                                                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
export default ManagePrayerTimes;
