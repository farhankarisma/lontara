"use client";

import Image from "next/image";
import { Bell, User, Settings, Menu } from "lucide-react";

export default function Header({ onMenuClick }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          {/* Mobile Menu Button */}
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
{/*           
          <Image
            src="/logo_lontara.svg"
            width={180}
            height={45}
            alt="Lontara Logo"
            className="h-6 sm:h-8 w-auto"
          /> */}
        </div>

        {/* User Section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notification Bell */}
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>

          {/* Settings - Hidden on mobile */}
          <button className="hidden sm:block p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </div>
            <div className="hidden sm:block text-sm">
              <p className="font-medium text-gray-900">Admin User</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}