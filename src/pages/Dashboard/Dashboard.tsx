import { useEffect, useState } from 'react';
import { getVisitorStats } from '../../services/visitorsService';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { Card } from '@/components/common';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Dashboard = () => {
    const [visitors, setVisitors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('daily'); // daily, weekly, monthly

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await getVisitorStats();
            setVisitors(data);
            setLoading(false);
        };
        fetchData();
    }, []);

    // Helper to process data based on time range
    const processDataByTime = () => {
        const grouped: any = {};
        
        visitors.forEach(v => {
            const date = new Date(v.timestamp);
            let key = '';

            if (timeRange === 'daily') {
                key = date.toLocaleDateString();
            } else if (timeRange === 'weekly') {
                // Get start of the week (Sunday)
                const d = new Date(date);
                const day = d.getDay();
                const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
                const weekStart = new Date(d.setDate(diff));
                key = `Week of ${weekStart.toLocaleDateString()}`;
            } else if (timeRange === 'monthly') {
                key = `${date.getMonth() + 1}/${date.getFullYear()}`;
            }

            if (!grouped[key]) grouped[key] = 0;
            grouped[key]++;
        });

        return Object.keys(grouped).map(key => ({
            name: key,
            visits: grouped[key]
        }));
    };

    // Helper to process data by country
    const processDataByCountry = () => {
        const grouped: any = {};
        visitors.forEach(v => {
            const country = v.country || 'Unknown';
            if (!grouped[country]) grouped[country] = 0;
            grouped[country]++;
        });

        return Object.keys(grouped).map(key => ({
            name: key,
            value: grouped[key]
        })).sort((a, b) => b.value - a.value); // Sort desc
    };

    const timeData = processDataByTime();
    const countryData = processDataByCountry();

    if (loading) return <div className="p-8">Loading stats...</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-8">Visitor Dashboard</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Total Visits</h3>
                    <p className="text-4xl font-bold text-gray-800 mt-2">{visitors.length}</p>
                </Card>
                <Card>
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Unique Countries</h3>
                    <p className="text-4xl font-bold text-gray-800 mt-2">{countryData.length}</p>
                </Card>
                <Card>
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Top Country</h3>
                    <p className="text-4xl font-bold text-gray-800 mt-2">{countryData[0]?.name || 'N/A'}</p>
                </Card>
            </div>

            {/* Visits Over Time Chart */}
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Visits Over Time</h2>
                    <div className="space-x-2">
                        {['daily', 'weekly', 'monthly'].map(range => (
                            <button 
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1 rounded text-sm capitalize ${timeRange === range ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={timeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="visits" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Country Distribution (Pie) */}
                <Card className='h-[400px] mb-4'>
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Visits by Country</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={countryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }: { name?: string, percent?: number }) => `${name || 'Unknown'} ${((percent || 0) * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {countryData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Top Countries (Bar) */}
                <Card>
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Top Countries</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={countryData.slice(0, 10)} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" name="Visits" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;