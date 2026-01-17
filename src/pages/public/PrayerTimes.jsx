import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import { Download } from 'lucide-react';
import { weeklyPrayerTimes } from '../../data/prayerTimes';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';

const PrayerTimes = () => {
    const [times, setTimes] = useState(weeklyPrayerTimes);

    useEffect(() => {
        const saved = localStorage.getItem('prayerTimes');
        if (saved) {
            setTimes(JSON.parse(saved));
        }
    }, []);

    const handleDownloadPDF = () => {
        const element = document.getElementById('weekly-schedule');
        const opt = {
            margin: 10,
            filename: 'Weekly_Prayer_Times.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
        };
        html2pdf().set(opt).from(element).save();
    };

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-islamic-dark mb-4 drop-shadow-sm">Prayer Timetable</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Prayer times for the current week. Jamat times are subject to change.
                    </p>
                </div>

                {/* Weekly Table */}
                <div id="weekly-schedule"> {/* Added ID for PDF targeting */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-lg shadow-xl overflow-hidden"
                    >
                        <div className="bg-islamic-green px-6 py-4">
                            <h2 className="text-white text-xl font-semibold">Weekly Schedule</h2>
                        </div>
                        <div className="p-1">
                            <Table>
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead className="text-islamic-dark font-bold">Day</TableHead>
                                        <TableHead className="text-center text-gray-700">Fajr</TableHead>
                                        <TableHead className="text-center text-gray-700">Dhuhr</TableHead>
                                        <TableHead className="text-center text-gray-700">Asr</TableHead>
                                        <TableHead className="text-center text-gray-700">Maghrib</TableHead>
                                        <TableHead className="text-center text-gray-700">Isha</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {times.map((day, index) => (
                                        <TableRow key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                                            <TableCell className="font-semibold text-islamic-green">{day.day}</TableCell>
                                            <TableCell className="text-center font-medium">{day.fajr}</TableCell>
                                            <TableCell className="text-center font-medium">{day.dhuhr}</TableCell>
                                            <TableCell className="text-center font-medium">{day.asr}</TableCell>
                                            <TableCell className="text-center font-medium">{day.maghrib}</TableCell>
                                            <TableCell className="text-center font-medium">{day.isha}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </motion.div>
                </div>

                {/* Download / Print Call to Action */}
                <div className="mt-8 text-center">
                    <button
                        onClick={handleDownloadPDF}
                        className="inline-flex items-center gap-2 text-islamic-green hover:text-islamic-dark hover:underline font-medium px-4 py-2 rounded-md hover:bg-green-50 transition-colors"
                    >
                        <Download size={20} />
                        Download Weekly PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrayerTimes;
