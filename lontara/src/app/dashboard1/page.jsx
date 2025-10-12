"use client";

import { 
  Users, 
  FileText, 
  Archive, 
  TrendingUp,
  Calendar,
  Clock,
  Download,
  Upload,
  BarChart3,
  PieChart
} from "lucide-react";

// Dashboard Stats Cards Component
function StatsCard({ title, value, icon: Icon, change, changeType }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-xs mt-1 ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'increase' ? '↑' : '↓'} {change}
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-full">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
}

// Recent Activity Component
function RecentActivity() {
  const activities = [
    {
      id: 1,
      action: "Dokumen baru ditambahkan",
      file: "Laporan_Keuangan_Q4.pdf",
      time: "2 menit yang lalu",
      user: "Admin"
    },
    {
      id: 2,
      action: "Dokumen diunduh",
      file: "Kontrak_Kerja_2024.docx",
      time: "15 menit yang lalu",
      user: "John Doe"
    },
    {
      id: 3,
      action: "Kategori baru dibuat",
      file: "Laporan Bulanan",
      time: "1 jam yang lalu",
      user: "Admin"
    },
    {
      id: 4,
      action: "Dokumen diarsipkan",
      file: "Invoice_INV001.pdf",
      time: "2 jam yang lalu",
      user: "Jane Smith"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Aktivitas Terbaru</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.action}
                </p>
                <p className="text-sm text-blue-600">{activity.file}</p>
                <p className="text-xs text-gray-500">
                  {activity.time} • oleh {activity.user}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Quick Actions Component
function QuickActions() {
  const actions = [
    {
      name: "Upload Dokumen",
      icon: Upload,
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      name: "Download Laporan",
      icon: Download,
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      name: "Lihat Kalender",
      icon: Calendar,
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      name: "Analisis Data",
      icon: BarChart3,
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Aksi Cepat</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.name}
                className={`${action.color} text-white p-4 rounded-lg transition-colors flex flex-col items-center space-y-2`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm font-medium">{action.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Storage Usage Component
function StorageUsage() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Penggunaan Storage</h3>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">Terpakai</span>
          <span className="text-sm font-medium text-gray-900">45.2 GB / 100 GB</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45.2%' }}></div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Dokumen PDF</span>
            <span className="text-gray-900">28.1 GB</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Gambar</span>
            <span className="text-gray-900">12.3 GB</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Lainnya</span>
            <span className="text-gray-900">4.8 GB</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Lontara</h1>
            <p className="text-gray-600 mt-1">Selamat datang kembali! Berikut ringkasan sistem arsip Anda.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Dokumen"
              value="1,234"
              icon={FileText}
              change="12% dari bulan lalu"
              changeType="increase"
            />
            <StatsCard
              title="Dokumen Aktif"
              value="956"
              icon={Archive}
              change="8% dari bulan lalu"
              changeType="increase"
            />
            <StatsCard
              title="Pengguna Aktif"
              value="28"
              icon={Users}
              change="3% dari bulan lalu"
              changeType="increase"
            />
            <StatsCard
              title="Akses Harian"
              value="342"
              icon={TrendingUp}
              change="5% dari kemarin"
              changeType="decrease"
            />
          </div>

          {/* Charts and Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Activity - takes 2 columns */}
            <div className="lg:col-span-2">
              <RecentActivity />
            </div>
            
            {/* Storage Usage - takes 1 column */}
            <div>
              <StorageUsage />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <QuickActions />
            
            {/* Additional Stats Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Statistik Bulanan</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Upload</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">156 file</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Download</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">423 kali</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Pencarian</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">789 query</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Arsip</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">45 dokumen</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  );
}