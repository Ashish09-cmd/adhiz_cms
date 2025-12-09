import React from 'react';
import { Icon } from '@iconify/react';

interface ButtonGroupProps {
  buttons: { label: string; onClick: () => void; variant?: 'primary' | 'secondary'; icon?: string }[];
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({ buttons }) => {
  return (
    <div className="flex gap-2">
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={button.onClick}
          className={`px-4 py-2 rounded-md font-medium flex items-center gap-2 ${
            button.variant === 'secondary'
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {button.icon && <Icon icon={button.icon} className="w-4 h-4" />}
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default ButtonGroup;
