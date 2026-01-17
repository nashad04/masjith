import { Users, Calendar, Clock, MessageSquare, TrendingUp } from 'lucide-react';
import Card, { CardContent } from '../../components/ui/Card';
import { familySubmissionsData, messagesData } from '../../data/adminData';
import { eventsData } from '../../data/events';

const StatCard = ({ title, value, icon: Icon, colorClass, trend }) => (
    <Card className="border-none shadow-md">
        <CardContent className="p-6 flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
                {trend && (
                    <p className="text-green-600 text-xs flex items-center mt-2 font-medium">
                        <TrendingUp className="w-3 h-3 mr-1" /> {trend} this month
                    </p>
                )}
            </div>
            <div className={`p-4 rounded-full ${colorClass} bg-opacity-20`}>
                <Icon className={`w-8 h-8 ${colorClass.replace('bg-', 'text-')}`} />
            </div>
        </CardContent>
    </Card>
);

const Dashboard = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Events"
                    value={eventsData.length}
                    icon={Calendar}
                    colorClass="bg-blue-600"
                    trend="+2"
                />
                <StatCard
                    title="Family Submissions"
                    value={familySubmissionsData.length}
                    icon={Users}
                    colorClass="bg-islamic-green"
                    trend="+12%"
                />
                <StatCard
                    title="Messages"
                    value={messagesData.length}
                    icon={MessageSquare}
                    colorClass="bg-purple-600"
                    trend="+5"
                />
                <StatCard
                    title="Jumu'ah Attendees"
                    value="450+"
                    icon={Clock}
                    colorClass="bg-islamic-gold"
                    trend="Avg."
                />
            </div>

            {/* Recent Activity Section (Placeholder) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Family Submissions</h3>
                        <div className="space-y-4">
                            {familySubmissionsData.slice(0, 3).map(sub => (
                                <div key={sub.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-semibold text-gray-800">{sub.headOfFamily}</p>
                                        <p className="text-sm text-gray-500">{sub.email}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${sub.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {sub.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Upcoming Events</h3>
                        <div className="space-y-4">
                            {eventsData.slice(0, 3).map(event => (
                                <div key={event.id} className="flex items-start gap-3">
                                    <img src={event.image} alt="" className="w-12 h-12 rounded object-cover" />
                                    <div>
                                        <p className="font-semibold text-gray-800">{event.title}</p>
                                        <p className="text-xs text-gray-500">{event.date} • {event.location}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
export default Dashboard;
