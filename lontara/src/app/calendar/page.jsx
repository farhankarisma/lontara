"use client";

import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  FileText, 
  Clock, 
  User,
  Filter,
  Eye,
  Download,
  Bell,
  X,
  Check
} from "lucide-react";
import { useState } from "react";

// Mock data untuk dokumen dengan tanggal
const mockCalendarData = {
  "2024-10-01": [
    { id: 1, name: "Laporan_Bulanan_September.pdf", category: "Keuangan", time: "09:30", user: "Finance" },
    { id: 2, name: "Meeting_Notes_Q4.docx", category: "Meeting", time: "14:00", user: "Admin" }
  ],
  "2024-10-05": [
    { id: 3, name: "Kontrak_Baru_ClientA.pdf", category: "Legal", time: "10:15", user: "Legal" }
  ],
  "2024-10-08": [
    { id: 4, name: "Backup_Database.sql", category: "IT", time: "02:00", user: "IT Support" },
    { id: 5, name: "Design_Logo_Update.png", category: "Design", time: "11:30", user: "Designer" },
    { id: 6, name: "Invoice_October.pdf", category: "Keuangan", time: "16:45", user: "Finance" }
  ],
  "2024-10-10": [
    { id: 7, name: "HR_Policy_Update.docx", category: "HR", time: "13:20", user: "HR Manager" }
  ],
  "2024-10-12": [
    { id: 8, name: "Marketing_Campaign.pptx", category: "Marketing", time: "15:00", user: "Marketing" },
    { id: 9, name: "Budget_2025.xlsx", category: "Keuangan", time: "09:00", user: "Finance" }
  ],
  "2024-10-15": [
    { id: 10, name: "Server_Maintenance.pdf", category: "IT", time: "08:00", user: "IT Support" }
  ]
};

// Mock data untuk reminders
const mockReminders = [
  { id: 1, title: "Review laporan keuangan Q4", date: "2024-10-15", time: "10:00", type: "review" },
  { id: 2, title: "Backup database mingguan", date: "2024-10-14", time: "02:00", type: "backup" },
  { id: 3, title: "Deadline kontrak client", date: "2024-10-20", time: "17:00", type: "deadline" }
];

// Komponen untuk cell tanggal
function CalendarCell({ date, documents, isToday, isCurrentMonth, onClick }) {
  const dayNumber = date.getDate();
  const dateString = date.toISOString().split('T')[0];
  const dayDocuments = documents[dateString] || [];
  
  return (
    <div
      onClick={() => onClick(date, dayDocuments)}
      className={`min-h-24 p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
        !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'
      } ${isToday ? 'bg-blue-50 border-blue-300' : ''}`}
    >
      <div className={`text-sm font-medium mb-1 ${
        isToday ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
      }`}>
        {dayNumber}
      </div>
      
      <div className="space-y-1">
        {dayDocuments.slice(0, 2).map((doc, index) => (
          <div
            key={index}
            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded truncate"
            title={doc.name}
          >
            {doc.time} - {doc.name.substring(0, 15)}...
          </div>
        ))}
        
        {dayDocuments.length > 2 && (
          <div className="text-xs text-gray-500">
            +{dayDocuments.length - 2} lainnya
          </div>
        )}
      </div>
    </div>
  );
}

// Komponen untuk detail modal
function DateDetailModal({ isOpen, onClose, date, documents }) {
  if (!isOpen || !date) return null;
  
  const dateString = date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Dokumen - {dateString}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{doc.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{doc.time}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{doc.user}</span>
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {doc.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CalendarIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Tidak ada dokumen pada tanggal ini</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Komponen untuk reminder modal
function ReminderModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    type: 'reminder'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ title: '', date: '', time: '', type: 'reminder' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Tambah Reminder</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul Reminder *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Masukkan judul reminder"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Waktu *
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipe Reminder
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              <option value="reminder">Reminder</option>
              <option value="deadline">Deadline</option>
              <option value="backup">Backup</option>
              <option value="review">Review</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tambah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminders, setReminders] = useState(mockReminders);
  const [viewMode, setViewMode] = useState("month"); // month, week, day
  
  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Generate calendar days
  const startDate = new Date(currentYear, currentMonth, 1);
  const endDate = new Date(currentYear, currentMonth + 1, 0);
  const startCalendar = new Date(startDate);
  startCalendar.setDate(startCalendar.getDate() - startDate.getDay());
  
  const calendarDays = [];
  const currentCalendarDate = new Date(startCalendar);
  
  for (let i = 0; i < 42; i++) {
    calendarDays.push(new Date(currentCalendarDate));
    currentCalendarDate.setDate(currentCalendarDate.getDate() + 1);
  }
  
  const handleDateClick = (date, documents) => {
    setSelectedDate(date);
    setSelectedDocuments(documents);
    setShowDetailModal(true);
  };
  
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  const handleAddReminder = (reminderData) => {
    const newReminder = {
      id: reminders.length + 1,
      ...reminderData
    };
    setReminders([...reminders, newReminder]);
  };
  
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kalender Dokumen</h1>
          <p className="text-gray-600 mt-1">Lihat dokumen berdasarkan tanggal upload dan reminder</p>
        </div>
        <button 
          onClick={() => setShowReminderModal(true)}
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Reminder</span>
        </button>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Hari Ini
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
          {/* Day Headers */}
          {dayNames.map((day) => (
            <div key={day} className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-700 border-b border-gray-200">
              {day}
            </div>
          ))}
          
          {/* Calendar Days */}
          {calendarDays.map((date, index) => {
            const isToday = date.toDateString() === today.toDateString();
            const isCurrentMonth = date.getMonth() === currentMonth;
            
            return (
              <CalendarCell
                key={index}
                date={date}
                documents={mockCalendarData}
                isToday={isToday}
                isCurrentMonth={isCurrentMonth}
                onClick={handleDateClick}
              />
            );
          })}
        </div>
      </div>

      {/* Upcoming Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reminders */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Reminder Mendatang</span>
          </h3>
          
          <div className="space-y-3">
            {reminders.slice(0, 5).map((reminder) => (
              <div key={reminder.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  reminder.type === 'deadline' ? 'bg-red-500' : 
                  reminder.type === 'backup' ? 'bg-blue-500' : 
                  reminder.type === 'review' ? 'bg-orange-500' : 'bg-green-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900">{reminder.title}</h4>
                  <p className="text-sm text-gray-500">
                    {reminder.date} • {reminder.time}
                  </p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistik Bulan Ini</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600">Dokumen Diupload</span>
              </div>
              <span className="font-medium text-gray-900">24</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">Hari Aktif</span>
              </div>
              <span className="font-medium text-gray-900">8</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-gray-600">Reminder Aktif</span>
              </div>
              <span className="font-medium text-gray-900">{reminders.length}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-gray-600">Pengguna Aktif</span>
              </div>
              <span className="font-medium text-gray-900">6</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Keterangan</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
            <span className="text-sm text-gray-600">Hari ini</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Ada dokumen</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">Deadline</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Reminder</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DateDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        date={selectedDate}
        documents={selectedDocuments}
      />
      
      <ReminderModal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        onSave={handleAddReminder}
      />
    </div>
  );
}