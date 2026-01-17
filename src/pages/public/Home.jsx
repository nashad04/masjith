import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, ChevronRight, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card, { CardContent } from '../../components/ui/Card';
import { prayerTimesData, weeklyPrayerTimes } from '../../data/prayerTimes';
import { announcementsData } from '../../data/events';
import { bayanData } from '../../data/bayan';

// Hero Image (Placeholder for now, using a nice patterned gradient or Unsplash)
import HERO_IMAGE from "../../assets/mosqe.jpeg";

const Home = () => {
    // Bayan State
    const [bayans, setBayans] = useState(() => {
        const saved = localStorage.getItem('jummaBayan');
        return saved ? JSON.parse(saved) : bayanData;
    });

    // About and Announcements State
    const [aboutData] = useState(() => {
        const saved = localStorage.getItem('homeAbout');
        return saved ? JSON.parse(saved) : {
            title: 'About Our Community',
            description1: 'Al-Noor Masjid has been the heart of the local Muslim community since 1995. We are dedicated to preserving an Islamic identity, building and supporting a viable Muslim community, and promoting a comprehensive Islamic way of life based on the Holy Quran and the Sunnah of Prophet Muhammad (PBUH).',
            description2: 'We offer daily prayers, educational programs, social services, and community events for men, women, and children of all backgrounds.',
            imageUrl: 'https://images.unsplash.com/photo-1542043681-325d799be53c?auto=format&fit=crop&q=80&w=800'
        };
    });

    const [announcementList] = useState(() => {
        const saved = localStorage.getItem('homeAnnouncements');
        return saved ? JSON.parse(saved) : announcementsData;
    });

    // Prayer Times & Countdown State
    const [todayTimes, setTodayTimes] = useState(null);
    const [nextPrayer, setNextPrayer] = useState({ name: '', time: '' });
    const [timeRemaining, setTimeRemaining] = useState('');

    useEffect(() => {
        // 1. Get Today's Schedule
        const savedTimes = localStorage.getItem('prayerTimes');
        const allTimes = savedTimes ? JSON.parse(savedTimes) : weeklyPrayerTimes;

        const dayIndex = new Date().getDay(); // 0=Sun, 1=Mon...
        // Map 0(Sun)->6, 1(Mon)->0, etc.
        const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
        const todaySchedule = allTimes[adjustedIndex];
        setTodayTimes(todaySchedule);

        // 2. Countdown Logic
        const calculateCountdown = () => {
            const now = new Date();
            const prayers = [
                { name: 'Fajr', time: todaySchedule.fajr },
                { name: 'Dhuhr', time: todaySchedule.dhuhr },
                { name: 'Asr', time: todaySchedule.asr },
                { name: 'Maghrib', time: todaySchedule.maghrib },
                { name: 'Isha', time: todaySchedule.isha },
            ];

            let next = null;
            let targetDate = null;

            for (const prayer of prayers) {
                const [timeStr, period] = prayer.time.split(' ');
                let [hours, minutes] = timeStr.split(':').map(Number);

                if (period === 'PM' && hours !== 12) hours += 12;
                if (period === 'AM' && hours === 12) hours = 0;

                const prayerDate = new Date();
                prayerDate.setHours(hours, minutes, 0, 0);

                if (prayerDate > now) {
                    next = prayer;
                    targetDate = prayerDate;
                    break;
                }
            }

            // If no next prayer today, target Fajr tomorrow
            if (!next) {
                // Get tomorrow's schedule
                const nextDayIndex = (adjustedIndex + 1) % 7;
                const nextDaySchedule = allTimes[nextDayIndex];

                next = { name: 'Fajr', time: nextDaySchedule.fajr };

                const [timeStr, period] = next.time.split(' ');
                let [hours, minutes] = timeStr.split(':').map(Number);
                if (period === 'PM' && hours !== 12) hours += 12; // Unlikely for Fajr but safe
                if (period === 'AM' && hours === 12) hours = 0;

                targetDate = new Date();
                targetDate.setDate(targetDate.getDate() + 1);
                targetDate.setHours(hours, minutes, 0, 0);
            }

            setNextPrayer(next);

            const diff = targetDate - now;
            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / (1000 * 60)) % 60);
            const s = Math.floor((diff / 1000) % 60);

            setTimeRemaining(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        };

        calculateCountdown(); // Initial call
        const timer = setInterval(calculateCountdown, 1000);

        return () => clearInterval(timer);
    }, []);
    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="bg-slate-50">
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-center text-center text-white overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={HERO_IMAGE}
                        alt="Masjid Interior"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-islamic-dark/70 bg-blend-multiply"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-4 font-serif tracking-tight text-white drop-shadow-lg">
                            Welcome to <span className="text-islamic-gold">Al-Noor Masjid</span>
                        </h1>

                        {/* Countdown Badge */}
                        <div className="inline-flex items-center gap-2 bg-islamic-green/90 backdrop-blur-md text-white px-6 py-2 rounded-full mb-8 shadow-lg border border-white/20">
                            <Clock className="w-5 h-5 animate-pulse" />
                            <span className="font-medium text-lg">
                                Next Prayer: <span className="font-bold text-islamic-gold">{nextPrayer?.name}</span> in <span className="font-mono">{timeRemaining}</span>
                            </span>
                        </div>

                        <p className="text-xl md:text-2xl mb-8 text-gray-100 font-light">
                            A place of peace, prayer, and community.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/prayer-times">
                                <Button variant="primary" className="px-8 py-3 text-lg shadow-lg">
                                    View Prayer Times
                                </Button>
                            </Link>
                            <Link to="/contact">
                                <Button variant="outline" className="px-8 py-3 text-lg border-white text-white hover:bg-white hover:text-islamic-dark">
                                    Contact Us
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Today's Prayer Times - Highlight Strip */}
            <section className="relative z-20 -mt-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="bg-white rounded-xl shadow-xl border-t-4 border-islamic-gold overflow-hidden"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    <div className="bg-islamic-green p-4 text-center">
                        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                            <Clock className="w-6 h-6" /> Today's Prayer Times
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-0">
                        {todayTimes && [
                            { name: 'Fajr', time: todayTimes.fajr },
                            { name: 'Dhuhr', time: todayTimes.dhuhr },
                            { name: 'Asr', time: todayTimes.asr },
                            { name: 'Maghrib', time: todayTimes.maghrib },
                            { name: 'Isha', time: todayTimes.isha },
                            { name: 'Jumu\'ah', time: '12:30 PM' }
                        ].map((prayer) => (
                            <div
                                key={prayer.name}
                                className={`p-6 text-center transition-colors border-r border-b border-gray-100 last:border-r-0 md:last:border-r-0 md:[&:nth-child(6)]:border-r-0 ${nextPrayer?.name === prayer.name
                                        ? 'bg-islamic-green/10'
                                        : 'hover:bg-gray-50'
                                    }`}
                            >
                                <h3 className={`text-lg font-semibold mb-1 ${nextPrayer?.name === prayer.name ? 'text-islamic-green' : 'text-gray-600'
                                    }`}>
                                    {prayer.name}
                                </h3>
                                <p className={`text-2xl font-bold ${nextPrayer?.name === prayer.name ? 'text-islamic-green' : 'text-islamic-dark'
                                    }`}>
                                    {prayer.time}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* This Week's Jumma Bayan */}
            <section className="bg-white py-12 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="inline-block p-2 px-4 rounded-full bg-islamic-gold/20 text-islamic-dark font-medium mb-4">
                        ✨ This Week's Jumma Bayan
                    </div>
                    {bayans.filter(b => b.status === 'Upcoming').slice(0, 1).map(bayan => (
                        <motion.div
                            key={bayan.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="bg-islamic-green text-white rounded-2xl p-8 max-w-3xl mx-auto shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
                                <Mic className="w-64 h-64" />
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">{bayan.topic}</h2>
                            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-lg">
                                <span className="bg-white/20 px-4 py-1 rounded-full">{bayan.speaker}</span>
                                <span className="flex items-center gap-2"><Calendar className="w-5 h-5" /> {bayan.date}</span>
                                <span className="flex items-center gap-2"><Clock className="w-5 h-5" /> {bayan.time}</span>
                            </div>
                            <div className="mt-8 text-islamic-gold font-medium">
                                Language: {bayan.language}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* About Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                        >
                            <h2 className="text-3xl font-bold text-islamic-dark mb-6">{aboutData.title}</h2>
                            <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                {aboutData.description1}
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                {aboutData.description2}
                            </p>
                            <Link to="/contact" className="text-islamic-green font-semibold hover:text-islamic-dark inline-flex items-center gap-1">
                                Learn More <ChevronRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
                                <img
                                    src={aboutData.imageUrl}
                                    alt="Community gathering"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-islamic-gold p-6 rounded-lg shadow-lg hidden md:block">
                                <p className="text-islamic-dark font-bold text-xl">Join Us</p>
                                <p className="text-islamic-dark/80 text-sm">Everyone is welcome</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Latest Announcements */}
            <section className="py-16 bg-gradient-to-br from-islamic-green/5 to-islamic-gold/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-islamic-dark">Latest Announcements</h2>
                        <div className="w-20 h-1 bg-islamic-gold mx-auto mt-4 rounded-full"></div>
                    </div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {announcementList.map((item) => (
                            <motion.div key={item.id} variants={fadeIn}>
                                <Card className="h-full hover:shadow-xl transition-shadow border-t-4 border-t-islamic-green">
                                    <CardContent>
                                        <div className="flex items-center gap-2 mb-4 text-islamic-green font-medium text-sm">
                                            <Calendar className="w-4 h-4" />
                                            {item.date}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                                        <p className="text-gray-600 line-clamp-3">{item.content}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
