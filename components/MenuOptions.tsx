
import React from 'react';
import type { MenuOption } from '../types';

interface MenuOptionsProps {
  options: MenuOption[];
  onSelect: (option: MenuOption) => void;
  disabled: boolean;
}

const MenuOptions: React.FC<MenuOptionsProps> = ({ options, onSelect, disabled }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 p-4">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option)}
          disabled={disabled}
          className="bg-white text-indigo font-semibold py-2 px-5 border-2 border-indigo rounded-full shadow-sm hover:bg-indigo-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {option.text}
        </button>
      ))}
    </div>
  );
};

export default MenuOptions;
