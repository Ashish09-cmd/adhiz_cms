"use client"
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  // Mock session for demo purposes - replace with actual auth later
  const mockSession = { user: { name: 'Admin' } };
  const isLoggedIn = typeof window !== 'undefined' && window.location.pathname === '/dashboard';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-64 right-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className='flex items-center gap-3'>
          <div className='text-2xl text-gray-text-body'>
             <Icon icon="material-symbols:menu"></Icon>
          </div>
           <ul className='flex items-center '>
              <li><Link href="#" className='text-xs font-poppins text-gray-text-body font-regular border-r border-gray-border px-4 transition hover:text-secondary-color'>Certificate list</Link></li>
              <li><Link href="#" className='text-xs font-poppins text-gray-text-body font-regular border-r border-gray-border px-4 transition hover:text-secondary-color'>Certificate Add</Link></li>
              <li><Link href="#" className='text-xs font-poppins text-gray-text-body font-regular border-r border-gray-border px-4 transition hover:text-secondary-color'>View Upcoming Classes</Link></li>
              <li><Link href="#" className='text-xs font-poppins text-gray-text-body font-regular  px-4 transition hover:text-secondary-color'>Added Upcoming Classes</Link></li>
           </ul>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-blue-500 bg-white text-gray-900"
          />
          <Icon icon="heroicons:magnifying-glass-20-solid" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
          <button className="p-2 text-gray-600 hover:text-gray-800">
            <Icon icon="heroicons:bell-20-solid" className="w-5 h-5" />
          </button>
          <div className="relative">
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  router.push('/login');
                } else {
                  setDropdownOpen(!dropdownOpen);
                }
              }}
              className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-800 cursor-pointer"
            >
              <Icon icon="heroicons:user-circle-20-solid" className="w-5 h-5" />
              <span>{isLoggedIn ? mockSession.user.name : 'Login'}</span>
            </button>
            {dropdownOpen && isLoggedIn && (
              <div className="absolute right-0 mt-2 w-70 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Icon icon="heroicons:user-20-solid" className="w-4 h-4 mr-2" />
                  Profile
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Icon icon="heroicons:cog-6-tooth-20-solid" className="w-4 h-4 mr-2" />
                  General Settings
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Icon icon="heroicons:cog-6-tooth-20-solid" className="w-4 h-4 mr-2" />
                  Site Configurations
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Icon icon="heroicons:device-phone-mobile-20-solid" className="w-4 h-4 mr-2" />
                  Mobile App Settings
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Icon icon="heroicons:envelope-20-solid" className="w-4 h-4 mr-2" />
                  Email Template Testing
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Icon icon="heroicons:arrow-path-20-solid" className="w-4 h-4 mr-2" />
                  Purge Cache
                </a>
                <button
                  onClick={() => {
                    router.push('/');
                    setDropdownOpen(false);
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Icon icon="heroicons:arrow-right-on-rectangle-20-solid" className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
          <button className="p-2 text-gray-600 hover:text-gray-800">
            <Icon icon="heroicons:cog-6-tooth-20-solid" className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;