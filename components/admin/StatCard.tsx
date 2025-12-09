import React from 'react';
import { Icon } from '@iconify/react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
          <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <div className="text-3xl">
          <Icon icon={icon} className="w-8 h-8 text-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
