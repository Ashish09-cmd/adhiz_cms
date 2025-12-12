"use client"
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import CategorySelector from './CategorySelector';

const Sidebar: React.FC = () => {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  const toggleOpen = (index: number) => {
    setOpenItems(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const menuItems = [
    { category: 'Dashboard' , slug:'/dashboard',  icon: 'heroicons:home-20-solid', },

    { category: 'Enquriy', categoryTitle:"Enquiry & Enrollment", items: ['List','Add','Enquiry List',], icon: 'fa:question-circle', dropicon:'iconoir:nav-arrow-down' },
    { category: 'Enrollment',  items: ['List','Add',], icon: 'fa:edit', dropicon:'iconoir:nav-arrow-down' },

    { category: 'Courses', categoryTitle:"Courses", items: ['List','Add','Home Page Course', 'Featured Course','Enquiry Courses','Popular Courses', 'Running Courses'], icon: 'fa:book', dropicon:'iconoir:nav-arrow-down' },
    { category: 'Upcoming classes ', items: ['List','Add','Add Multiple', 'ReOrder'], icon: 'fa:arrow-circle-down', dropicon:'iconoir:nav-arrow-down' },
    { category: 'Course Category', items: ['List','Add','Featured Category', 'Featured Course Category'], icon: 'fa:edit', dropicon:'iconoir:nav-arrow-down' },
    { category: 'Tag Management', slug:'admin/tag-management', icon: 'fa:tags',},
    { category: 'Skills',   items: ['List','Add','Add Multiple', 'ReOrder'], icon: 'mdi:star-circle-outline', dropicon:'iconoir:nav-arrow-down' ,},

    { category: 'Manage Pages', categoryTitle:"Content", items: ['List','Add',], icon: 'fa:edit', dropicon:'iconoir:nav-arrow-down' },
    { category: 'Menu Management', items: ['Re-order Course Menu','List Course Menu', 'Add Course Menu', 'Add Menu','Top bar Menu List', 'Logo Bar Menu', 'Banner Menu', 'Footer Management', 'Footer Second Row', 'Footer Second Columnn Menu', 'Footer Third Menu Column'], icon: 'fa:tasks', dropicon:'iconoir:nav-arrow-down' },
    { category: 'Contact Info', items: ['Top Header', 'Body Broadwayinfo', 'Body Broadwayinfo USA', 'Footer', 'Bottom Bar'], icon:'fa:mobile-phone', dropicon:'iconoir:nav-arrow-down' },
    { category: 'Banner', items: ['Top Header', 'Body Broadwayinfo', 'Body Broadwayinfo USA', 'Footer', 'Bottom Bar'], icon:'mdi:image-size-select-large', dropicon:'iconoir:nav-arrow-down' },
    

    { category: 'home page slider', categoryTitle:"others", items: ['List', 'Add'], icon: 'fa:photo', dropicon:'iconoir:nav-arrow-down' },
    { category: 'Settings', items: ['General', 'Security'], icon: 'heroicons:cog-6-tooth-20-solid', dropicon:'iconoir:nav-arrow-down' },
    { category: 'Course Colletion', items: ['List', 'Add'], icon: 'fa:photo', dropicon:'iconoir:nav-arrow-down' },
    { category: 'Hero Bar', items: ['List', 'Add'], icon: 'fa:pencil-square-o', dropicon:'iconoir:nav-arrow-down' },
    { category:'Instructor', items: ['List', 'Add'], icon: 'fa:calendar', dropicon:'iconoir:nav-arrow-down' },
    { category:'ACL', items: ['Roll', 'Permission', 'User Roll Mapping'], icon: 'fa:calendar', dropicon:'iconoir:nav-arrow-down' },

  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 flex flex-col border-r border-gray-200">
      <div className="sticky top-0 p-3 shadow-sm border-b border-gray-200 bg-white z-10">
        <a href='/dashboard' className=" flex items-center justify-center">
            <img src="/logo.svg" alt="" />
        </a>
      </div>
      <nav className="flex-1 mt-5 overflow-y-auto p-4">
        {menuItems.map((category, index) => (
          <div key={index} className="mb-6">
            {category.categoryTitle && (
              <h3 className='mb-4 text-primary-text-body font-poppins text-xs font-semibold'>{category.categoryTitle}</h3>
            )}
            {category.items && category.items.length > 0 ? (
              <button onClick={() => toggleOpen(index)} className="w-full mb-2 flex items-center justify-between cursor-pointer">
                <div className='flex items-center gap-2'>
                  <div className='text-xs mb-0.5 text-gray-text-body'><Icon icon={category.icon} /></div>
                  <h3 className='text-xs font-medium text-gray-text-body font-poppins capitalize tracking-wide'>{category.category}</h3>
                </div>
                <div className={`text-sm text-gray-text-body transition-transform ease-in duration-200 ${openItems[index] ? 'rotate-180' : ''}`}>
                  <Icon icon={category.dropicon} />
                </div>
              </button>
            ) : (
              <a href={category.slug} className="mb-2 flex items-center justify-between">
                <div className='flex items-center gap-2'>
                  <div className='text-sm mb-0.5 text-gray-text-body'><Icon icon={category.icon} /></div>
                  <h3 className='text-xs font-medium text-gray-text-body font-poppins capitalize tracking-wide'>{category.category}</h3>
                </div>
                { category.dropicon && (
                <div className='text-sm text-gray-text-body'>
                  <Icon icon={category.dropicon} />
                </div>
                )}
              
              </a>
            )}
            {category.items && category.items.length > 0 && (
              <div className={`overflow-hidden transition-all duration-600 ease-linear ${openItems[index] ? 'max-h-120 opacity-100 pb-2' : 'max-h-0 opacity-0'}`}>
                <ul className="space-y-1 ps-1.5 border-primary-border-darker border-s ms-1.5">
                  {category.items.map((item, itemIndex) => {
                    // Create dynamic routes for Skills section
                    const getRoute = () => {
                      if (category.category === 'Skills') {
                        if (item === 'List') {
                          return `/dashboard/skills`;
                        }
                        const itemSlug = item.toLowerCase().replace(/\s+/g, '-');
                        return `/dashboard/skills/${itemSlug}`;
                      }
                      // Add similar logic for other categories as needed
                      return '#';
                    };

                    return (
                      <li key={itemIndex}>
                        <a
                          href={getRoute()}
                          className="block ps-3 relative before:absolute before:-left-2.5 before:h-2 before:w-2 before:rounded-full before:bg-primary-color before:mt-1 text-xs py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          {item}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
