
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-indigo text-white p-4 shadow-md flex items-center fixed top-0 left-0 right-0 z-10 w-full max-w-2xl mx-auto rounded-t-lg">
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo font-bold text-2xl">
          Z
        </div>
      </div>
      <div>
        <h1 className="text-xl font-bold">Ziata</h1>
        <p className="text-sm opacity-90">Lifestyle & Wellness Assistant</p>
      </div>
    </header>
  );
};

export default Header;
