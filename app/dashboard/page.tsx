"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import StatCard from '../../components/admin/StatCard';
import DataTable from '../../components/admin/DataTable';
import FilterPanel from '../../components/admin/FilterPanel';
import ButtonGroup from '../../components/admin/ButtonGroup';
import CategorySelector from '../../components/admin/CategorySelector';
import ExportPanel from '../../components/admin/ExportPanel';
import ThreeColumnSection from '../../components/admin/ThreeColumnSection';
import { Button } from '../../components/ui/Button';

const Dashboard: React.FC = () => {
  // Sample data for demonstration
  const statCards = [
    { title: 'Courses',  value: 128, icon: 'fa:book', color: 'border-primary-500' },
    { title: 'Total Enquiries',value: 128, icon: 'heroicons:phone-20-solid', color: 'border-green-500' },
    { title: 'Testimonials', value: 67, icon: 'heroicons:star-20-solid', color: 'border-yellow-500' },
    { title: 'Active Users', value: 892, icon: 'heroicons:users-20-solid', color: 'border-purple-500' },

  ];

  const tableHeaders = ['Name', 'Email', 'Status', 'Date'];
  const tableRows = [
    ['John Doe', 'john@example.com', 'Active', '2023-10-01'],
    ['Jane Smith', 'jane@example.com', 'Pending', '2023-10-02'],
    ['Bob Johnson', 'bob@example.com', 'Inactive', '2023-10-03'],
  ];

  const buttonGroupButtons = [
    { label: 'Add New', onClick: () => console.log('Add new'), icon: 'heroicons:plus-20-solid' },
    { label: 'Edit', onClick: () => console.log('Edit'), icon: 'heroicons:pencil-20-solid' },
    { label: 'Delete', onClick: () => console.log('Delete'), variant: 'secondary' as const, icon: 'heroicons:trash-20-solid' },
  ];

  const categories = ['Web Development', 'Data Science', 'Design', 'Marketing'];
  const [selectedCategory, setSelectedCategory] = React.useState('');

  const [selectedEnquiry, setSelectedEnquiry] = useState('');
  const [selectedContact, setSelectedContact] = useState('');
  const [selectedAdmission, setSelectedAdmission] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const latestItems = [
    { id: 1, title: 'New Course: React Basics', description: 'Added 2 days ago' },
    { id: 2, title: 'Blog Post: CMS Trends', description: 'Added 1 week ago' },
    { id: 3, title: 'Event: Webinar on AI', description: 'Added 3 days ago' },
  ];

  const trendingItems = [
    { id: 1, title: 'Python for Beginners', description: 'Trending for 3 weeks' },
    { id: 2, title: 'UI/UX Design Course', description: 'Trending for 1 week' },
    { id: 3, title: 'Digital Marketing', description: 'Trending for 3 days' },
  ];

  const successfulItems = [
    { id: 1, title: 'Full Stack Development', description: '95% completion rate' },
    { id: 2, title: 'Data Analysis Bootcamp', description: '90% completion rate' },
    { id: 3, title: 'Graphic Design Masterclass', description: '88% completion rate' },
  ];

  return (
    <>
          {/* Top Menu Section */}
          <section id="top-menu-section" className="mb-2">

          {/* Statistics Section */}
          <section id="statistics-section" className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((card, index) => (
                <StatCard key={index} title={card.title}  value={card.value}  icon={card.icon} color={card.color} />
              ))}
            </div>
          </section>
            <div className="py-4 ">
              <div className="flex flex-wrap gap-4 items-center">
                <Link href="/dashboard/instructor-applications" className="px-4 py-2 bg-blue-50 text-blue-700  hover:bg-blue-100 font-dmSans transition-colors">
                  Online Admission
                </Link>
                <Link href={'#'} className="px-4 py-2 bg-green-50 text-green-700  hover:bg-green-100 font-dmSans transition-colors">
                  Enquiry
                </Link>
              </div>
            </div>
          </section>

          {/* Record Section */}
          <section id="record-section" className="mb-6  bg-white p-6 border border-primary-border">
            <h2 className="text-xl font-semibold text-gray-text-body font-poppins mb-4">Records</h2>
            <div className=" mb-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Side */}
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <select
                      value={selectedEnquiry}
                      onChange={(e) => setSelectedEnquiry(e.target.value)}
                      className="px-4 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 font-dmSans"
                    >
                      <option value="">Choose Enquiry</option>
                      <option value="general">General Enquiry</option>
                      <option value="course">Course Enquiry</option>
                    </select>
                    <select
                      value={selectedContact}
                      onChange={(e) => setSelectedContact(e.target.value)}
                      className="px-4 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 font-dmSans"
                    >
                      <option value="">Choose Course</option>
                      <option value="phone">In Person</option>
                      <option value="email">Online</option>
                    </select>
                    <select
                      value={selectedAdmission}
                      onChange={(e) => setSelectedAdmission(e.target.value)}
                      className="px-4 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 font-dmSans"
                    >
                      <option value="">Online Admission</option>
                      <option value="Enquiry">Enquiry</option>
                    </select>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-4 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 font-dmSans"
                    />
                  </div>
                    <div className="flex gap-3 mt-4">
                    <Button 
                      variant="primary" 
                      size="md"
                      className="flex-1 text-xs bg-primary-border cursor-pointer"
                    >
                      Submit
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="md"
                      className="flex-1 text-xs cursor-pointer"
                    >
                      Apply
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="md"
                      className="flex-1 text-xs cursor-pointer"
                    >
                      Cancel
                    </Button>
                    </div>
                </div>
                {/* Right Side */}
                <div className="flex-1">
                  <div className="bg-gray-50 p-4">
                    <h3 className="text-md text-gray-text-body  font-poppins mb-2">Total New Inquiry on Date</h3>
                    <p className="text-3xl font-bold text-blue-600">25</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 ">
              <h3 className="text-sm font-medium text-gray-text-title font-poppins mb-4">Enquiry, Contact list & Online Admission List (Today & Yesterday)</h3>
              <DataTable
                headers={['S.N', 'Date', 'Name', 'Email', 'Mobile', 'Courses', 'Action']}
                rows={[
                  [1, '2023-10-01', 'John Doe', 'john@example.com', '1234567890', 'Web Development', ''],
                  [2, '2023-10-02', 'Jane Smith', 'jane@example.com', '0987654321', 'Data Science', ''],
                ]}
              />
            </div>
          </section>
    </>
  );
};

export default Dashboard;
