import { useEffect, useState, useMemo } from 'react';
import { getVisitorStats } from '../../services/visitorsService';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { Card, Modal } from '@/components/common';
import { FiClock, FiGlobe, FiFileText, FiSearch, FiExternalLink, FiInfo, FiTrendingUp } from 'react-icons/fi';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ff6b6b', '#4ecdc4'];

interface Visitor {
    id: string;
    path?: string;
    page?: string;
    country?: string;
    user_agent?: string;
    timestamp?: Date | string | number | null;
}

interface ChartStatePayload {
    activeLabel?: string | number;
    activePayload?: Array<{
        payload?: {
            name?: string;
        };
    }>;
}

interface ChartEntryPayload {
    name?: string;
    payload?: {
        name?: string;
    };
}

const extractChartLabel = (state: unknown): string | undefined => {
    if (!state || typeof state !== 'object') return undefined;
    const s = state as ChartStatePayload;
    if (s.activeLabel != null) return String(s.activeLabel);
    return s.activePayload?.[0]?.payload?.name;
};

const extractEntryName = (entry: unknown): string | undefined => {
    if (!entry || typeof entry !== 'object') return undefined;
    const e = entry as ChartEntryPayload;
    return e.name || e.payload?.name;
};

interface ModalState {
    isOpen: boolean;
    type: 'country' | 'time' | 'page' | 'all';
    title: string;
    subtitle: string;
    items: Visitor[];
}

// Format date into human-readable Indonesian locale
const formatDateTime = (timestamp: unknown): string => {
    if (!timestamp) return '-';
    const date = timestamp instanceof Date ? timestamp : new Date(String(timestamp));
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};

// Parse User Agent into concise browser name
const parseBrowser = (ua?: string) => {
    if (!ua) return 'Unknown';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Edg/')) return 'Edge';
    if (ua.includes('Chrome/')) return 'Chrome';
    if (ua.includes('Safari/')) return 'Safari';
    if (ua.includes('OPR/') || ua.includes('Opera/')) return 'Opera';
    return 'Other';
};

// Unified helper to generate consistent time grouping keys
const getTimeKey = (timestamp: unknown, range: string): string => {
    if (!timestamp) return 'Unknown Date';
    const date = timestamp instanceof Date ? timestamp : new Date(String(timestamp));
    if (isNaN(date.getTime())) return 'Unknown Date';

    if (range === 'daily') {
        return date.toLocaleDateString();
    }
    if (range === 'weekly') {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        const weekStart = new Date(d.setDate(diff));
        return `Week of ${weekStart.toLocaleDateString()}`;
    }
    if (range === 'monthly') {
        return `${date.getMonth() + 1}/${date.getFullYear()}`;
    }
    return date.toLocaleDateString();
};

const Dashboard = () => {
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('daily'); // daily, weekly, monthly

    // Modal drilldown state
    const [modalState, setModalState] = useState<ModalState>({
        isOpen: false,
        type: 'all',
        title: '',
        subtitle: '',
        items: []
    });

    // Modal internal search & pagination
    const [modalSearch, setModalSearch] = useState('');
    const [modalPage, setModalPage] = useState(1);
    const modalPageSize = 10;

    // Bottom activity log search, filter, and pagination
    const [logSearch, setLogSearch] = useState('');
    const [logCountryFilter, setLogCountryFilter] = useState('all');
    const [logCurrentPage, setLogCurrentPage] = useState(1);
    const logPageSize = 10;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await getVisitorStats();
            setVisitors(data || []);
            setLoading(false);
        };
        fetchData();
    }, []);

    // Helper to process data based on time range
    const timeData = useMemo(() => {
        const grouped: Record<string, number> = {};
        visitors.forEach(v => {
            const key = getTimeKey(v.timestamp, timeRange);
            if (!grouped[key]) grouped[key] = 0;
            grouped[key]++;
        });

        return Object.keys(grouped).map(key => ({
            name: key,
            visits: grouped[key]
        }));
    }, [visitors, timeRange]);

    // Helper to process data by country
    const countryData = useMemo(() => {
        const grouped: Record<string, number> = {};
        visitors.forEach(v => {
            const country = v.country || 'Unknown';
            if (!grouped[country]) grouped[country] = 0;
            grouped[country]++;
        });

        return Object.keys(grouped).map(key => ({
            name: key,
            value: grouped[key]
        })).sort((a, b) => b.value - a.value);
    }, [visitors]);

    // Helper to process data by visited page / path
    const pageData = useMemo(() => {
        const grouped: Record<string, { visits: number; pageName: string }> = {};
        visitors.forEach(v => {
            const path = v.path || '/';
            const pageName = v.page || path;
            if (!grouped[path]) {
                grouped[path] = { visits: 0, pageName };
            }
            grouped[path].visits++;
        });

        return Object.entries(grouped).map(([path, data]) => ({
            path,
            name: data.pageName,
            visits: data.visits
        })).sort((a, b) => b.visits - a.visits);
    }, [visitors]);

    // Sort all visitors newest first for activity logs
    const sortedVisitorsDesc = useMemo(() => {
        return [...visitors].sort((a, b) => {
            const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
        });
    }, [visitors]);

    // Open detail modal when clicking a country
    const handleCountryClick = (countryName?: string) => {
        if (!countryName) return;
        const matching = sortedVisitorsDesc.filter(v => (v.country || 'Unknown') === countryName);
        setModalSearch('');
        setModalPage(1);
        setModalState({
            isOpen: true,
            type: 'country',
            title: `Detail Kunjungan: ${countryName}`,
            subtitle: `Total ${matching.length} kunjungan tercatat dari ${countryName}`,
            items: matching
        });
    };

    // Open detail modal when clicking a time point on the chart
    const handleTimeClick = (timeLabel?: string) => {
        if (!timeLabel) return;
        const matching = sortedVisitorsDesc.filter(v => getTimeKey(v.timestamp, timeRange) === timeLabel);
        setModalSearch('');
        setModalPage(1);
        setModalState({
            isOpen: true,
            type: 'time',
            title: `Detail Kunjungan: ${timeLabel}`,
            subtitle: `Periode ${timeRange.toUpperCase()} — Total ${matching.length} kunjungan tercatat`,
            items: matching
        });
    };

    // Open detail modal when clicking a page
    const handlePageClick = (pathName?: string) => {
        if (!pathName) return;
        const matching = sortedVisitorsDesc.filter(v => (v.path || '/') === pathName);
        setModalSearch('');
        setModalPage(1);
        setModalState({
            isOpen: true,
            type: 'page',
            title: `Detail Kunjungan Halaman: ${pathName}`,
            subtitle: `Total ${matching.length} kunjungan ke halaman ini`,
            items: matching
        });
    };

    // Filtered visitors inside the Modal
    const filteredModalItems = useMemo(() => {
        if (!modalSearch.trim()) return modalState.items;
        const query = modalSearch.toLowerCase();
        return modalState.items.filter(v =>
            (v.country || '').toLowerCase().includes(query) ||
            (v.path || '').toLowerCase().includes(query) ||
            (v.page || '').toLowerCase().includes(query) ||
            parseBrowser(v.user_agent).toLowerCase().includes(query)
        );
    }, [modalState.items, modalSearch]);

    const paginatedModalItems = useMemo(() => {
        const start = (modalPage - 1) * modalPageSize;
        return filteredModalItems.slice(start, start + modalPageSize);
    }, [filteredModalItems, modalPage]);

    const modalTotalPages = Math.ceil(filteredModalItems.length / modalPageSize) || 1;

    // Filtered visitors in the bottom Activity Log table
    const filteredLogVisitors = useMemo(() => {
        return sortedVisitorsDesc.filter(v => {
            const matchesCountry = logCountryFilter === 'all' || (v.country || 'Unknown') === logCountryFilter;
            const matchesSearch = !logSearch.trim() ||
                (v.country || '').toLowerCase().includes(logSearch.toLowerCase()) ||
                (v.path || '').toLowerCase().includes(logSearch.toLowerCase()) ||
                (v.page || '').toLowerCase().includes(logSearch.toLowerCase()) ||
                parseBrowser(v.user_agent).toLowerCase().includes(logSearch.toLowerCase());
            return matchesCountry && matchesSearch;
        });
    }, [sortedVisitorsDesc, logCountryFilter, logSearch]);

    const paginatedLogVisitors = useMemo(() => {
        const start = (logCurrentPage - 1) * logPageSize;
        return filteredLogVisitors.slice(start, start + logPageSize);
    }, [filteredLogVisitors, logCurrentPage]);

    const logTotalPages = Math.ceil(filteredLogVisitors.length / logPageSize) || 1;

    if (loading) {
        return (
            <div className="p-8 font-mono text-sm tracking-wider uppercase flex items-center gap-2">
                <FiClock className="animate-spin" /> Memuat statistik dashboard...
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 space-y-8">
            {/* Header Title */}
            <div>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-black">Visitor Dashboard</h1>
                <p className="text-gray-600 font-mono text-xs uppercase tracking-widest mt-1">
                    Statistik & Log Kunjungan Real-Time Portfolio
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <div className="flex justify-between items-start">
                        <span className="text-gray-500 text-xs font-mono uppercase tracking-wider">Total Kunjungan</span>
                        <FiTrendingUp className="text-gray-400" size={16} />
                    </div>
                    <p className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 font-mono">{visitors.length}</p>
                    <p className="text-xs text-gray-500 mt-1">Akumulasi seluruh hit</p>
                </Card>
                <Card>
                    <div className="flex justify-between items-start">
                        <span className="text-gray-500 text-xs font-mono uppercase tracking-wider">Negara Unik</span>
                        <FiGlobe className="text-gray-400" size={16} />
                    </div>
                    <p className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 font-mono">{countryData.length}</p>
                    <p className="text-xs text-gray-500 mt-1">Sebaran geografis visitor</p>
                </Card>
                <Card>
                    <div className="flex justify-between items-start">
                        <span className="text-gray-500 text-xs font-mono uppercase tracking-wider">Top Negara</span>
                        <FiGlobe className="text-gray-400" size={16} />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 truncate font-serif">
                        {countryData[0]?.name || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {countryData[0] ? `${countryData[0].value} kunjungan` : 'Belum ada data'}
                    </p>
                </Card>
                <Card>
                    <div className="flex justify-between items-start">
                        <span className="text-gray-500 text-xs font-mono uppercase tracking-wider">Halaman Terpopuler</span>
                        <FiFileText className="text-gray-400" size={16} />
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-gray-900 mt-2 truncate font-mono" title={pageData[0]?.path}>
                        {pageData[0]?.path || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {pageData[0] ? `${pageData[0].visits} kali dilihat` : 'Belum ada data'}
                    </p>
                </Card>
            </div>

            {/* Visits Over Time Chart */}
            <Card>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-serif font-bold text-gray-900">Visits Over Time</h2>
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200">
                                <FiInfo size={12} /> Klik titik untuk rincian
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">
                            Klik tanggal atau titik pada grafik untuk melihat siapa yang mengunjungi & halaman apa saja
                        </p>
                    </div>

                    <div className="flex items-center gap-1">
                        {['daily', 'weekly', 'monthly'].map(range => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer border ${
                                    timeRange === range
                                        ? 'bg-black text-white border-black'
                                        : 'bg-paper text-gray-700 border-gray-300 hover:bg-gray-100'
                                }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-80 w-full cursor-pointer">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={timeData}
                            onClick={(state: unknown) => {
                                const clickedLabel = extractChartLabel(state);
                                if (clickedLabel) handleTimeClick(clickedLabel);
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 11, fontFamily: 'monospace' }}
                            />
                            <YAxis
                                allowDecimals={false}
                                tick={{ fontSize: 11, fontFamily: 'monospace' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#F9F9F9',
                                    border: '1px solid black',
                                    fontFamily: 'monospace',
                                    fontSize: '12px'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="visits"
                                name="Visits"
                                stroke="#000000"
                                strokeWidth={2}
                                activeDot={{
                                    r: 7,
                                    stroke: '#000000',
                                    strokeWidth: 2,
                                    fill: '#ffffff',
                                    cursor: 'pointer',
                                    onClick: (_: unknown, payload: unknown) => {
                                        const label = extractEntryName(payload);
                                        if (label) handleTimeClick(label);
                                    }
                                }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Geographical Distribution Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visits by Country (Pie) */}
                <Card className="flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-serif font-bold text-gray-900">Visits by Country</h2>
                            <span className="text-[11px] font-mono text-gray-500 uppercase">Proporsi (%)</span>
                        </div>
                        <p className="text-xs text-gray-500 font-mono mb-4">
                            Klik potongan lingkaran untuk detail pengunjung per negara
                        </p>
                    </div>

                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={countryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }: { name?: string; percent?: number }) =>
                                        `${name || 'Unknown'} ${((percent || 0) * 100).toFixed(0)}%`
                                    }
                                    outerRadius={90}
                                    dataKey="value"
                                    cursor="pointer"
                                    onClick={(entry: unknown) => {
                                        const name = extractEntryName(entry);
                                        if (name) handleCountryClick(name);
                                    }}
                                >
                                    {countryData.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            cursor="pointer"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#F9F9F9',
                                        border: '1px solid black',
                                        fontFamily: 'monospace',
                                        fontSize: '12px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Top Countries (Bar) */}
                <Card className="flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-serif font-bold text-gray-900">Top Countries</h2>
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200">
                                <FiInfo size={12} /> Klik bar untuk rincian
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 font-mono mb-4">
                            Klik batang negara untuk melihat kapan & halaman apa yang mereka kunjungi
                        </p>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={countryData.slice(0, 8)}
                                layout="vertical"
                                onClick={(state: unknown) => {
                                    const country = extractChartLabel(state);
                                    if (country) handleCountryClick(country);
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis
                                    type="number"
                                    allowDecimals={false}
                                    tick={{ fontSize: 11, fontFamily: 'monospace' }}
                                />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={95}
                                    tick={{ fontSize: 11, fontFamily: 'monospace' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#F9F9F9',
                                        border: '1px solid black',
                                        fontFamily: 'monospace',
                                        fontSize: '12px'
                                    }}
                                />
                                <Bar
                                    dataKey="value"
                                    name="Visits"
                                    fill="#000000"
                                    cursor="pointer"
                                    onClick={(data: unknown) => {
                                        const country = extractEntryName(data);
                                        if (country) handleCountryClick(country);
                                    }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Quick clickable country tags */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-3 mt-3 border-t border-gray-200">
                        <span className="text-[11px] font-mono text-gray-500 uppercase mr-1">Akses Cepat:</span>
                        {countryData.slice(0, 6).map(c => (
                            <button
                                key={c.name}
                                onClick={() => handleCountryClick(c.name)}
                                className="text-xs font-mono px-2 py-0.5 bg-paper hover:bg-black hover:text-white border border-black transition-colors cursor-pointer"
                                title={`Buka rincian kunjungan dari ${c.name}`}
                            >
                                {c.name} <span className="font-bold">({c.value})</span>
                            </button>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Top Visited Pages Section */}
            <Card>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4 pb-4 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-serif font-bold text-gray-900">Top Visited Pages</h2>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">
                            Halaman dan konten yang paling sering diakses. Klik halaman untuk melihat siapa & kapan dikunjungi.
                        </p>
                    </div>
                    <span className="text-xs font-mono text-gray-500 uppercase">
                        Total {pageData.length} Halaman Unik
                    </span>
                </div>

                <div className="space-y-3">
                    {pageData.slice(0, 6).map((item, idx) => {
                        const totalVisits = visitors.length || 1;
                        const percentage = Math.round((item.visits / totalVisits) * 100);
                        return (
                            <div
                                key={item.path}
                                onClick={() => handlePageClick(item.path)}
                                className="group p-3 border border-gray-200 hover:border-black bg-white/50 hover:bg-paper transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                                <div className="flex items-start gap-3 min-w-0">
                                    <span className="font-mono text-xs text-gray-400 font-bold mt-0.5">#{idx + 1}</span>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-sm font-bold text-black truncate group-hover:underline">
                                                {item.path}
                                            </span>
                                            <FiExternalLink size={12} className="text-gray-400 group-hover:text-black opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <p className="text-xs text-gray-500 truncate font-sans">
                                            Label: {item.name || 'Halaman'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 shrink-0 sm:w-48">
                                    <div className="w-full bg-gray-200 h-2 border border-gray-300 overflow-hidden">
                                        <div
                                            className="bg-black h-full transition-all"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="font-mono text-xs text-right whitespace-nowrap font-bold text-black min-w-16">
                                        {item.visits} visit ({percentage}%)
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* Recent Visitor Activity Log */}
            <Card>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4 pb-4 border-b border-black">
                    <div>
                        <h2 className="text-xl font-serif font-bold text-gray-900">Riwayat Log Kunjungan</h2>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">
                            Daftar lengkap siapa yang mengunjungi, kapan, dan halaman apa yang dibuka
                        </p>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Search input */}
                        <div className="relative min-w-44">
                            <FiSearch className="absolute left-2.5 top-2.5 text-gray-400" size={14} />
                            <input
                                type="text"
                                value={logSearch}
                                onChange={(e) => {
                                    setLogSearch(e.target.value);
                                    setLogCurrentPage(1);
                                }}
                                placeholder="Cari path, negara..."
                                className="w-full pl-8 pr-3 py-1.5 text-xs font-mono bg-paper border border-black focus:outline-none focus:ring-1 focus:ring-black rounded-none"
                            />
                        </div>

                        {/* Country filter dropdown */}
                        <select
                            value={logCountryFilter}
                            onChange={(e) => {
                                setLogCountryFilter(e.target.value);
                                setLogCurrentPage(1);
                            }}
                            className="py-1.5 px-2 text-xs font-mono bg-paper border border-black focus:outline-none rounded-none cursor-pointer"
                        >
                            <option value="all">Semua Negara ({visitors.length})</option>
                            {countryData.map(c => (
                                <option key={c.name} value={c.name}>
                                    {c.name} ({c.value})
                                </option>
                            ))}
                        </select>

                        {(logSearch || logCountryFilter !== 'all') && (
                            <button
                                onClick={() => {
                                    setLogSearch('');
                                    setLogCountryFilter('all');
                                    setLogCurrentPage(1);
                                }}
                                className="px-2.5 py-1.5 text-xs font-mono uppercase bg-gray-200 hover:bg-black hover:text-white transition-colors cursor-pointer border border-black"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>

                {/* Table of Activity */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-black text-gray-500 font-mono uppercase text-[11px] tracking-wider">
                                <th className="py-2.5 px-3">#</th>
                                <th className="py-2.5 px-3">Waktu Kunjungan</th>
                                <th className="py-2.5 px-3">Negara</th>
                                <th className="py-2.5 px-3">Halaman & Path</th>
                                <th className="py-2.5 px-3">Browser</th>
                                <th className="py-2.5 px-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 font-sans">
                            {paginatedLogVisitors.length > 0 ? (
                                paginatedLogVisitors.map((v, index) => {
                                    const rowNumber = (logCurrentPage - 1) * logPageSize + index + 1;
                                    const browserName = parseBrowser(v.user_agent);
                                    return (
                                        <tr key={v.id || index} className="hover:bg-gray-100/60 transition-colors">
                                            <td className="py-2.5 px-3 font-mono text-xs text-gray-400">{rowNumber}</td>
                                            <td className="py-2.5 px-3 font-mono text-xs whitespace-nowrap text-gray-800">
                                                <div className="flex items-center gap-1.5">
                                                    <FiClock size={12} className="text-gray-400 shrink-0" />
                                                    {formatDateTime(v.timestamp)}
                                                </div>
                                            </td>
                                            <td className="py-2.5 px-3 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleCountryClick(v.country || 'Unknown')}
                                                    className="inline-flex items-center gap-1 text-xs font-mono font-medium hover:underline text-black cursor-pointer bg-gray-100 px-2 py-0.5 border border-gray-300 hover:border-black"
                                                    title={`Lihat semua kunjungan dari ${v.country || 'Unknown'}`}
                                                >
                                                    <FiGlobe size={11} className="text-gray-500" />
                                                    {v.country || 'Unknown'}
                                                </button>
                                            </td>
                                            <td className="py-2.5 px-3 min-w-56">
                                                <div className="flex flex-col">
                                                    <button
                                                        onClick={() => handlePageClick(v.path || '/')}
                                                        className="text-left font-mono text-xs text-black font-semibold hover:underline cursor-pointer truncate max-w-md"
                                                        title={`Lihat semua kunjungan ke ${v.path || '/'}`}
                                                    >
                                                        {v.path || '/'}
                                                    </button>
                                                    {v.page && (
                                                        <span className="text-[11px] text-gray-500 truncate">
                                                            {v.page}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-2.5 px-3 font-mono text-xs whitespace-nowrap text-gray-600">
                                                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-[11px] border border-gray-200">
                                                    {browserName}
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-3 text-right whitespace-nowrap">
                                                <button
                                                    onClick={() => handleCountryClick(v.country || 'Unknown')}
                                                    className="text-xs font-mono text-black hover:underline cursor-pointer uppercase tracking-wider"
                                                >
                                                    Detail
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center font-mono text-xs text-gray-500">
                                        Tidak ada catatan kunjungan yang cocok dengan pencarian.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {filteredLogVisitors.length > logPageSize && (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 mt-4 border-t border-gray-200 font-mono text-xs">
                        <span className="text-gray-500">
                            Menampilkan {(logCurrentPage - 1) * logPageSize + 1} -{' '}
                            {Math.min(logCurrentPage * logPageSize, filteredLogVisitors.length)} dari {filteredLogVisitors.length} riwayat
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setLogCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={logCurrentPage === 1}
                                className="px-3 py-1 bg-paper border border-black hover:bg-black hover:text-white disabled:opacity-40 disabled:hover:bg-paper disabled:hover:text-black transition-colors cursor-pointer"
                            >
                                Prev
                            </button>
                            <span className="px-3 py-1 bg-gray-100 border border-gray-300">
                                {logCurrentPage} / {logTotalPages}
                            </span>
                            <button
                                onClick={() => setLogCurrentPage(prev => Math.min(prev + 1, logTotalPages))}
                                disabled={logCurrentPage === logTotalPages}
                                className="px-3 py-1 bg-paper border border-black hover:bg-black hover:text-white disabled:opacity-40 disabled:hover:bg-paper disabled:hover:text-black transition-colors cursor-pointer"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Detail Drilldown Modal */}
            <Modal
                isOpen={modalState.isOpen}
                onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
                title={modalState.title}
                subtitle={modalState.subtitle}
                maxWidth="max-w-4xl"
            >
                <div className="space-y-4">
                    {/* Modal Stats & Filter Header */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-3 bg-gray-50 border border-gray-200">
                        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                            <span className="px-2 py-0.5 bg-black text-white">
                                {filteredModalItems.length} Catatan
                            </span>
                            {modalState.type === 'country' && (
                                <span className="text-gray-600">
                                    Halaman paling sering dikunjungi: <strong className="text-black">
                                        {(() => {
                                            const pageCount: Record<string, number> = {};
                                            modalState.items.forEach(i => {
                                                const p = i.path || '/';
                                                pageCount[p] = (pageCount[p] || 0) + 1;
                                            });
                                            const topP = Object.entries(pageCount).sort((a, b) => b[1] - a[1])[0];
                                            return topP ? `${topP[0]} (${topP[1]}x)` : '-';
                                        })()}
                                    </strong>
                                </span>
                            )}
                            {modalState.type === 'time' && (
                                <span className="text-gray-600">
                                    Negara terbanyak: <strong className="text-black">
                                        {(() => {
                                            const cCount: Record<string, number> = {};
                                            modalState.items.forEach(i => {
                                                const c = i.country || 'Unknown';
                                                cCount[c] = (cCount[c] || 0) + 1;
                                            });
                                            const topC = Object.entries(cCount).sort((a, b) => b[1] - a[1])[0];
                                            return topC ? `${topC[0]} (${topC[1]}x)` : '-';
                                        })()}
                                    </strong>
                                </span>
                            )}
                        </div>

                        {/* Search in modal */}
                        <div className="relative min-w-48">
                            <FiSearch className="absolute left-2.5 top-2.5 text-gray-400" size={13} />
                            <input
                                type="text"
                                value={modalSearch}
                                onChange={(e) => {
                                    setModalSearch(e.target.value);
                                    setModalPage(1);
                                }}
                                placeholder="Filter dalam modal..."
                                className="w-full pl-8 pr-3 py-1.5 text-xs font-mono bg-paper border border-gray-300 focus:border-black focus:outline-none rounded-none"
                            />
                        </div>
                    </div>

                    {/* Modal Visitors Table */}
                    <div className="overflow-x-auto border border-black">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="bg-black text-white font-mono uppercase text-[11px] tracking-wider">
                                    <th className="py-2.5 px-3">#</th>
                                    <th className="py-2.5 px-3">Waktu Kunjungan</th>
                                    <th className="py-2.5 px-3">Halaman yang Dikunjungi</th>
                                    <th className="py-2.5 px-3">Negara Asal</th>
                                    <th className="py-2.5 px-3">Browser</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 font-sans bg-white">
                                {paginatedModalItems.length > 0 ? (
                                    paginatedModalItems.map((item, idx) => {
                                        const rowNo = (modalPage - 1) * modalPageSize + idx + 1;
                                        return (
                                            <tr key={item.id || idx} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-2.5 px-3 font-mono text-gray-400">{rowNo}</td>
                                                <td className="py-2.5 px-3 font-mono whitespace-nowrap text-gray-800">
                                                    <div className="flex items-center gap-1.5">
                                                        <FiClock size={12} className="text-gray-400" />
                                                        {formatDateTime(item.timestamp)}
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-3">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-mono font-bold text-black">
                                                                {item.path || '/'}
                                                            </span>
                                                        </div>
                                                        {item.page && (
                                                            <span className="text-[11px] text-gray-500">
                                                                {item.page}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-3 whitespace-nowrap">
                                                    <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 bg-gray-100 border border-gray-300">
                                                        <FiGlobe size={11} className="text-gray-500" />
                                                        {item.country || 'Unknown'}
                                                    </span>
                                                </td>
                                                <td className="py-2.5 px-3 font-mono text-gray-600 whitespace-nowrap">
                                                    {parseBrowser(item.user_agent)}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center font-mono text-gray-500">
                                            Tidak ada data kunjungan yang cocok.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Modal Pagination */}
                    {filteredModalItems.length > modalPageSize && (
                        <div className="flex justify-between items-center font-mono text-xs pt-2">
                            <span className="text-gray-500">
                                Halaman {modalPage} dari {modalTotalPages}
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setModalPage(p => Math.max(p - 1, 1))}
                                    disabled={modalPage === 1}
                                    className="px-3 py-1 bg-paper border border-black hover:bg-black hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
                                >
                                    Prev
                                </button>
                                <button
                                    onClick={() => setModalPage(p => Math.min(p + 1, modalTotalPages))}
                                    disabled={modalPage === modalTotalPages}
                                    className="px-3 py-1 bg-paper border border-black hover:bg-black hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default Dashboard;
