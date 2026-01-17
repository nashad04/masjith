import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, X } from 'lucide-react';
import { eventsData } from '../../data/events';
import Card, { CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const Events = () => {
    // Initialize events from localStorage or fallback
    const [events, setEvents] = useState(() => {
        const saved = localStorage.getItem('eventsData');
        return saved ? JSON.parse(saved) : eventsData;
    });

    const [selectedEvent, setSelectedEvent] = useState(null);

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-islamic-dark mb-4">Community Events</h1>
                    <p className="text-gray-600">Join us in our upcoming gatherings and activities.</p>
                </div>

                {/* Events Grid */}
                {events.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                        No upcoming events scheduled at the moment.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event, index) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="h-full flex flex-col hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={event.image || 'https://via.placeholder.com/300x200'}
                                            alt={event.title}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-islamic-dark shadow-sm">
                                            {event.date}
                                        </div>
                                    </div>

                                    <CardContent className="flex-grow">
                                        <h3 className="text-xl font-bold text-islamic-dark mb-3 line-clamp-1">{event.title}</h3>

                                        <div className="space-y-2 mb-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-islamic-gold" />
                                                <span>{event.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-islamic-gold" />
                                                <span>{event.location}</span>
                                            </div>
                                        </div>

                                        <p className="text-gray-500 text-sm mb-6 line-clamp-3">
                                            {event.description}
                                        </p>

                                        <Button
                                            variant="outline"
                                            onClick={() => setSelectedEvent(event)}
                                            className="w-full hover:bg-islamic-green hover:text-white transition-colors"
                                        >
                                            View Details
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Event Details Modal */}
            <AnimatePresence>
                {selectedEvent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            <div className="relative h-64 md:h-80">
                                <img
                                    src={selectedEvent.image || 'https://via.placeholder.com/800x400'}
                                    alt={selectedEvent.title}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors backdrop-blur-md"
                                >
                                    <X size={24} />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-24">
                                    <h2 className="text-3xl font-bold text-white mb-2">{selectedEvent.title}</h2>
                                    <div className="flex flex-wrap gap-4 text-white/90 text-sm">
                                        <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                                            <Calendar className="w-4 h-4" /> {selectedEvent.date}
                                        </span>
                                        <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                                            <Clock className="w-4 h-4" /> {selectedEvent.time}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 md:p-8">
                                <div className="flex items-start gap-3 mb-6 text-gray-600 bg-gray-50 p-4 rounded-lg">
                                    <MapPin className="w-5 h-5 text-islamic-gold shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 text-sm">Location</h4>
                                        <p>{selectedEvent.location}</p>
                                    </div>
                                </div>

                                <div className="prose prose-slate max-w-none text-gray-600 leading-relaxed">
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">About this event</h4>
                                    <p className="whitespace-pre-wrap">{selectedEvent.description}</p>
                                </div>

                                <div className="mt-8 pt-6 border-t flex justify-end">
                                    <Button onClick={() => setSelectedEvent(null)}>
                                        Close Details
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
export default Events;
