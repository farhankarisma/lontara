"use client";

import { 
  Home, 
  FileText, 
  Archive, 
  Users, 
  Settings, 
  PieChart,
  FolderOpen,
  Search,
  Calendar,
  X,
  Menu
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

const menuItems = [
  {
    name: "Dashboard",
    icon: Home,
    href: "/dashboard1"
  },
  {
    name: "Arsip Dokumen",
    icon: FileText,
    href: "/documents"
  },
  {
    name: "Kategori",
    icon: FolderOpen,
    href: "/categories"
  },
  {
    name: "Pencarian",
    icon: Search,
    href: "/search"
  },
  {
    name: "Laporan",
    icon: PieChart,
    href: "/reports"
  },
  {
    name: "Kalender",
    icon: Calendar,
    href: "/calendar"
  },
  {
    name: "Pengguna",
    icon: Users,
    href: "/users"
  },
  {
    name: "Pengaturan",
    icon: Settings,
    href: "/settings"
  }
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Close sidebar when clicking on a link on mobile
  const handleLinkClick = () => {
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        bg-white min-h-screen shadow-lg border-r border-gray-200
        lg:relative lg:w-64 lg:translate-x-0
        fixed top-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile close button */}
        <div className="lg:hidden flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 pb-24">
          <h2 className="hidden lg:block text-lg font-semibold text-gray-800 mb-6">Menu Utama</h2>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-4 border-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* Footer section in sidebar */}
        <div className="absolute bottom-0 left-0 w-full p-6 border-t border-gray-200 bg-white">
          <div className="text-xs text-gray-500 text-center">
            <p>© 2024 Lontara</p>
            <p>Arsip Cerdas v1.0</p>
          </div>
        </div>
      </div>
    </>
  );
}