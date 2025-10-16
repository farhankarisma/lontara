"use client";

import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  Calendar, 
  FileText, 
  Users, 
  Filter,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Clock,
  FolderOpen,
  Search
} from "lucide-react";
import { useState } from "react";

// Mock data untuk charts
const mockChartData = {
  documentsByCategory: [
    { name: "Keuangan", value: 45, color: "#EF4444" },
    { name: "HR", value: 32, color: "#3B82F6" },
    { name: "Meeting", value: 28, color: "#10B981" },
    { name: "IT", value: 15, color: "#8B5CF6" },
    { name: "Design", value: 22, color: "#F59E0B" },
    { name: "Legal", value: 18, color: "#6B7280" }
  ],
  monthlyUploads: [
    { month: "Jan", uploads: 45, downloads: 120 },
    { month: "Feb", uploads: 52, downloads: 135 },
    { month: "Mar", uploads: 48, downloads: 128 },
    { month: "Apr", uploads: 61, downloads: 155 },
    { month: "May", uploads: 55, downloads: 142 },
    { month: "Jun", uploads: 67, downloads: 178 },
    { month: "Jul", uploads: 72, downloads: 195 },
    { month: "Aug", uploads: 68, downloads: 182 },
    { month: "Sep", uploads: 74, downloads: 201 },
    { month: "Oct", uploads: 58, downloads: 168 }
  ],
  topUsers: [
    { name: "Admin", uploads: 145, downloads: 89 },
    { name: "HR Manager", uploads: 98, downloads: 156 },
    { name: "Finance", uploads: 87, downloads: 134 },
    { name: "IT Support", uploads: 72, downloads: 98 },
    { name: "Designer", uploads: 64, downloads: 87 }
  ],
  fileTypes: [
    { type: "PDF", count: 89, percentage: 35 },
    { type: "Word", count: 67, percentage: 26 },
    { type: "Excel", count: 45, percentage: 18 },
    { type: "PowerPoint", count: 32, percentage: 13 },
    { type: "Image", count: 20, percentage: 8 }
  ]
};

// Komponen untuk Simple Bar Chart
function SimpleBarChart({ data, title, className = "" }) {
  const maxValue = Math.max(...data.map(item => item.value || item.uploads || item.count));
  
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-20 text-sm text-gray-600 truncate">
              {item.name || item.month || item.type}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
              <div
                className="bg-blue-500 h-4 rounded-full flex items-center justify-end pr-2"
                style={{ 
                  width: `${((item.value || item.uploads || item.count) / maxValue) * 100}%`,
                  backgroundColor: item.color || '#3B82F6'
                }}
              >
                <span className="text-xs text-white font-medium">
                  {item.value || item.uploads || item.count}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Komponen untuk Line Chart sederhana
function SimpleLineChart({ data, title }) {
  const maxValue = Math.max(...data.map(item => Math.max(item.uploads, item.downloads)));
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-64 flex items-end justify-between space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center space-y-2">
            <div className="w-full flex flex-col items-center space-y-1">
              {/* Upload bar */}
              <div
                className="w-full bg-blue-500 rounded-t"
                style={{ height: `${(item.uploads / maxValue) * 200}px` }}
                title={`Uploads: ${item.uploads}`}
              />
              {/* Download bar */}
              <div
                className="w-full bg-green-500 rounded-b"
                style={{ height: `${(item.downloads / maxValue) * 200}px` }}
                title={`Downloads: ${item.downloads}`}
              />
            </div>
            <span className="text-xs text-gray-600">{item.month}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Upload</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Download</span>
        </div>
      </div>
    </div>
  );
}

// Komponen untuk Stats Card
function StatsCard({ title, value, change, changeType, icon: Icon, color = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600"
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              {changeType === 'increase' ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm ml-1 ${
                changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

// Komponen untuk tabel top users
function TopUsersTable({ users }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Pengguna Teraktif</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-sm font-medium text-gray-500 pb-2">Pengguna</th>
              <th className="text-right text-sm font-medium text-gray-500 pb-2">Upload</th>
              <th className="text-right text-sm font-medium text-gray-500 pb-2">Download</th>
              <th className="text-right text-sm font-medium text-gray-500 pb-2">Total Aktivitas</th>
            </tr>
          </thead>
          <tbody className="space-y-2">
            {users.map((user, index) => (
              <tr key={index} className="border-b border-gray-100 last:border-0">
                <td className="py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-900">{user.name}</span>
                  </div>
                </td>
                <td className="py-3 text-right text-gray-900">{user.uploads}</td>
                <td className="py-3 text-right text-gray-900">{user.downloads}</td>
                <td className="py-3 text-right font-medium text-gray-900">
                  {user.uploads + user.downloads}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Komponen untuk recent activities
function RecentActivities() {
  const activities = [
    { action: "Upload dokumen", file: "Budget_2025.xlsx", user: "Finance", time: "5 menit lalu" },
    { action: "Download dokumen", file: "Kontrak_John.pdf", user: "HR Manager", time: "12 menit lalu" },
    { action: "Upload dokumen", file: "Logo_Update.png", user: "Designer", time: "25 menit lalu" },
    { action: "Download dokumen", file: "Meeting_Notes.docx", user: "Admin", time: "1 jam lalu" },
    { action: "Upload dokumen", file: "Server_Backup.sql", user: "IT Support", time: "2 jam lalu" }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-medium">{activity.user}</span> {activity.action.toLowerCase()}
              </p>
              <p className="text-sm text-blue-600 truncate">{activity.file}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("30");
  const [reportType, setReportType] = useState("overview");

  const handleExportReport = (format) => {
    console.log(`Exporting report as ${format}`);
    // Implement export functionality
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan & Analytics</h1>
          <p className="text-gray-600 mt-1">Analisis performa dan penggunaan sistem arsip dokumen</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="7">7 Hari Terakhir</option>
            <option value="30">30 Hari Terakhir</option>
            <option value="90">3 Bulan Terakhir</option>
            <option value="365">1 Tahun Terakhir</option>
          </select>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => handleExportReport('pdf')}
              className="px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>
            <button
              onClick={() => handleExportReport('excel')}
              className="px-4 py-2 text-gray-700 hover:bg-gray-50 border-l border-gray-300 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Dokumen"
          value="1,234"
          change="12% dari bulan lalu"
          changeType="increase"
          icon={FileText}
          color="blue"
        />
        <StatsCard
          title="Upload Bulan Ini"
          value="156"
          change="8% dari bulan lalu"
          changeType="increase"
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="Download Bulan Ini"
          value="892"
          change="15% dari bulan lalu"
          changeType="increase"
          icon={Activity}
          color="orange"
        />
        <StatsCard
          title="Pengguna Aktif"
          value="28"
          change="2% dari bulan lalu"
          changeType="decrease"
          icon={Users}
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload/Download Trends */}
        <SimpleLineChart
          data={mockChartData.monthlyUploads}
          title="Tren Upload & Download"
        />

        {/* Documents by Category */}
        <SimpleBarChart
          data={mockChartData.documentsByCategory}
          title="Dokumen per Kategori"
        />
      </div>

      {/* File Types and Storage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Types Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribusi Tipe File</h3>
          <div className="space-y-4">
            {mockChartData.fileTypes.map((fileType, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded" style={{
                    backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                  }}></div>
                  <span className="text-sm font-medium text-gray-900">{fileType.type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{fileType.count}</span>
                  <span className="text-sm text-gray-500">({fileType.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Storage Usage */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Penggunaan Storage</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Storage Terpakai</span>
                <span>45.2 GB / 100 GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-blue-600 h-3 rounded-full" style={{ width: '45.2%' }}></div>
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Dokumen PDF</span>
                <span className="text-sm font-medium text-gray-900">28.1 GB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">File Word/Excel</span>
                <span className="text-sm font-medium text-gray-900">12.3 GB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Gambar</span>
                <span className="text-sm font-medium text-gray-900">3.2 GB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Lainnya</span>
                <span className="text-sm font-medium text-gray-900">1.6 GB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Users */}
        <div className="lg:col-span-2">
          <TopUsersTable users={mockChartData.topUsers} />
        </div>

        {/* Recent Activities */}
        <div>
          <RecentActivities />
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Wawasan Cepat</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="p-3 bg-green-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900">Pertumbuhan Upload</h4>
            <p className="text-sm text-gray-600 mt-1">
              Upload dokumen meningkat 15% dibanding bulan lalu
            </p>
          </div>
          
          <div className="text-center">
            <div className="p-3 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-900">Kategori Terpopuler</h4>
            <p className="text-sm text-gray-600 mt-1">
              Kategori "Keuangan" memiliki dokumen terbanyak (45 dokumen)
            </p>
          </div>
          
          <div className="text-center">
            <div className="p-3 bg-orange-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <h4 className="font-medium text-gray-900">Jam Tersibuk</h4>
            <p className="text-sm text-gray-600 mt-1">
              Aktivitas paling tinggi antara pukul 09:00 - 11:00
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}