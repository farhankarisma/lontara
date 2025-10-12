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
  Calendar
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-white w-64 min-h-screen shadow-lg border-r border-gray-200 relative">
      <div className="p-6 pb-24">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Menu Utama</h2>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
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
  );
}