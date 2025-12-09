'use client';


import { useState } from 'react';
import Link from 'next/link';
// import { ChevronRight, Plus, Search, Edit2, Trash2 } from 'lucide-react';




interface HeroBanner {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    status: 'active' | 'inactive';
    createdAt: string;
}

const ITEMS_PER_PAGE = 5;

const mockBanners: HeroBanner[] = [
    {
        id: '1',
        title: 'Summer Collection 2024',
        subtitle: 'Discover amazing deals',
        image: '/banner-1.jpg',
        status: 'active',
        createdAt: '2024-01-15',
    },
    {
        id: '2',
        title: 'New Arrivals',
        subtitle: 'Fresh products just added',
        image: '/banner-2.jpg',
        status: 'active',
        createdAt: '2024-01-14',
    },
    {
        id: '3',
        title: 'Flash Sale',
        subtitle: '50% off selected items',
        image: '/banner-3.jpg',
        status: 'inactive',
        createdAt: '2024-01-13',
    },
    {
        id: '4',
        title: 'Spring Trends',
        subtitle: 'Be the first to shop',
        image: '/banner-4.jpg',
        status: 'active',
        createdAt: '2024-01-12',
    },
    {
        id: '5',
        title: 'Clearance Sale',
        subtitle: 'Up to 70% discount',
        image: '/banner-5.jpg',
        status: 'active',
        createdAt: '2024-01-11',
    },
    {
        id: '6',
        title: 'Holiday Special',
        subtitle: 'Celebrate with us',
        image: '/banner-6.jpg',
        status: 'inactive',
        createdAt: '2024-01-10',
    },
];

export default function HeroBannersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredBanners = mockBanners.filter((banner) =>
        banner.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredBanners.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedBanners = filteredBanners.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 mb-6 text-sm text-gray-600">
                <Link href="/dashboard" className="hover:text-gray-900">
                    Dashboard
                </Link>
                {/* <ChevronRight size={16} /> */}
                <span className="text-gray-900 font-medium">Hero Banners</span>
            </nav>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Hero Banners</h1>
                    <p className="text-gray-600 mt-1">Manage your hero banner content</p>
                </div>
                <Link
                    href="/dashboard/edit/create"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                    {/* <Plus size={20} /> */}
                    Create Banner
                </Link>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    {/* <Search className="absolute left-3 top-3 text-gray-400" size={20} /> */}
                    <input
                        type="text"
                        placeholder="Search banners..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                Title
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                Subtitle
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                Created
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedBanners.map((banner) => (
                            <tr
                                key={banner.id}
                                className="border-b border-gray-200 hover:bg-gray-50 transition"
                            >
                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                    {banner.title}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {banner.subtitle}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            banner.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        {banner.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {banner.createdAt}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 hover:bg-blue-100 rounded transition">
                                            {/* <Edit2 size={18} className="text-blue-600" /> */}
                                        </button>
                                        <button className="p-2 hover:bg-red-100 rounded transition">
                                            {/* <Trash2 size={18} className="text-red-600" /> */}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                    Showing {startIndex + 1} to{' '}
                    {Math.min(startIndex + ITEMS_PER_PAGE, filteredBanners.length)} of{' '}
                    {filteredBanners.length} results
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                currentPage === page
                                    ? 'bg-blue-600 text-white'
                                    : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}