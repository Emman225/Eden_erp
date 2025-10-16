import React, { useState } from 'react';
import { Page } from '../../types';
import { 
    BellIcon, 
    UserCircleIcon, 
    ChevronDownIcon, 
    Cog6ToothIcon, 
    ArrowLeftStartOnRectangleIcon 
} from '../icons/Icon';

interface HeaderProps {
  page: Page;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ page, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-blue-600 rounded-bl-lg">
      <h1 className="text-2xl font-semibold text-white">{page}</h1>
      <div className="flex items-center space-x-5">
        
        {/* Notification Bell */}
        <button className="relative p-2 text-white rounded-full hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white">
            <span className="sr-only">View notifications</span>
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-orange-500 ring-2 ring-white"></span>
        </button>
        
        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
            </div>

            <ChevronDownIcon className="w-5 h-5 text-white" />
          </button>
          
          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-xl py-1 z-20 ring-1 ring-black ring-opacity-5"
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-800">Admin User</p>
                <p className="text-sm text-gray-500 truncate">admin@church.org</p>
              </div>
              
              <a href="#" className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <UserCircleIcon className="w-5 h-5 mr-3 text-gray-400" />
                Profile Settings
              </a>
              <a href="#" className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Cog6ToothIcon className="w-5 h-5 mr-3 text-gray-400" />
                Preferences
              </a>
              
              <div className="border-t border-gray-200 my-1"></div>
              
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
              >
                <ArrowLeftStartOnRectangleIcon className="w-5 h-5 mr-3" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;