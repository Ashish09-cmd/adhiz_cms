import React from 'react';
import { Icon } from '@iconify/react';

interface Item {
  id: number;
  title: string;
  description: string;
}

interface ThreeColumnSectionProps {
  latestItems: Item[];
  trendingItems: Item[];
  successfulItems: Item[];
}

const ThreeColumnSection: React.FC<ThreeColumnSectionProps> = ({ latestItems, trendingItems, successfulItems }) => {
  const renderItems = (items: Item[]) => (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className="p-3 bg-gray-50 rounded-md">
          <h4 className="font-medium text-gray-900">{item.title}</h4>
          <p className="text-sm text-gray-600">{item.description}</p>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4 text-gray-900 flex items-center">
          <Icon icon="heroicons:clock-20-solid" className="w-5 h-5 mr-2 text-blue-500" />
          Latest Added Courses
        </h3>
        {renderItems(latestItems)}
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4 text-gray-900 flex items-center">
          <Icon icon="heroicons:fire-20-solid" className="w-5 h-5 mr-2 text-red-500" />
          Most Trending Courses
        </h3>
        {renderItems(trendingItems)}
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4 text-gray-900 flex items-center">
          <Icon icon="heroicons:trophy-20-solid" className="w-5 h-5 mr-2 text-yellow-500" />
          Most Successful Courses
        </h3>
        {renderItems(successfulItems)}
      </div>
    </div>
  );
};

export default ThreeColumnSection;
