"use client";

import { 
  Search, 
  Filter, 
  Calendar, 
  FileText, 
  Image, 
  File, 
  Download, 
  Eye, 
  Clock,
  User,
  Tag,
  X,
  ChevronDown,
  SlidersHorizontal,
  History
} from "lucide-react";
import { useState } from "react";

// Mock data untuk dokumen (sama seperti di documents)
const mockDocuments = [
  {
    id: 1,
    name: "Laporan_Keuangan_Q4_2024.pdf",
    category: "Keuangan",
    size: "2.4 MB",
    uploadDate: "2024-10-10",
    uploadBy: "Admin",
    type: "pdf",
    status: "active",
    content: "laporan keuangan triwulan keempat tahun 2024 pendapatan profit loss balance sheet"
  },
  {
    id: 2,
    name: "Kontrak_Kerja_John_Doe.docx",
    category: "HR",
    size: "1.8 MB",
    uploadDate: "2024-10-09",
    uploadBy: "HR Manager",
    type: "docx",
    status: "active",
    content: "kontrak kerja karyawan john doe posisi software engineer gaji benefits"
  },
  {
    id: 3,
    name: "Invoice_INV001_Oktober.pdf",
    category: "Keuangan",
    size: "892 KB",
    uploadDate: "2024-10-08",
    uploadBy: "Finance",
    type: "pdf",
    status: "archived",
    content: "invoice tagihan pembayaran oktober inv001 client customer billing"
  },
  {
    id: 4,
    name: "Presentasi_Meeting_Q4.pptx",
    category: "Meeting",
    size: "5.2 MB",
    uploadDate: "2024-10-08",
    uploadBy: "Admin",
    type: "pptx",
    status: "active",
    content: "presentasi meeting triwulan keempat planning strategy roadmap"
  },
  {
    id: 5,
    name: "Database_Backup_Oktober.sql",
    category: "IT",
    size: "45.6 MB",
    uploadDate: "2024-10-07",
    uploadBy: "IT Support",
    type: "sql",
    status: "active",
    content: "database backup oktober mysql data recovery restore"
  },
  {
    id: 6,
    name: "Company_Logo_2024.png",
    category: "Design",
    size: "2.1 MB",
    uploadDate: "2024-10-07",
    uploadBy: "Designer",
    type: "png",
    status: "active",
    content: "company logo design brand identity corporate visual branding"
  },
  {
    id: 7,
    name: "Marketing_Campaign_Q4.pdf",
    category: "Marketing",
    size: "3.2 MB",
    uploadDate: "2024-10-06",
    uploadBy: "Marketing",
    type: "pdf",
    status: "active",
    content: "marketing campaign strategy advertising promotion social media digital"
  },
  {
    id: 8,
    name: "Budget_Planning_2025.xlsx",
    category: "Keuangan",
    size: "1.5 MB",
    uploadDate: "2024-10-05",
    uploadBy: "Finance",
    type: "xlsx",
    status: "active",
    content: "budget planning anggaran 2025 forecast projection expenses revenue"
  }
];

// Mock recent searches
const mockRecentSearches = [
  "laporan keuangan",
  "kontrak kerja",
  "invoice oktober",
  "meeting notes",
  "backup database"
];

// Mock saved searches
const mockSavedSearches = [
  { id: 1, name: "Dokumen Keuangan Q4", query: "keuangan", filters: { category: "Keuangan", dateFrom: "2024-10-01" }},
  { id: 2, name: "Kontrak HR Aktif", query: "kontrak", filters: { category: "HR", status: "active" }},
  { id: 3, name: "File Backup IT", query: "backup", filters: { category: "IT", type: "sql" }}
];

// Komponen untuk icon file
function FileIcon({ type }) {
  const iconClass = "w-6 h-6";
  
  switch (type) {
    case 'pdf':
      return <FileText className={`${iconClass} text-red-500`} />;
    case 'docx':
      return <FileText className={`${iconClass} text-blue-500`} />;
    case 'pptx':
      return <FileText className={`${iconClass} text-orange-500`} />;
    case 'xlsx':
      return <FileText className={`${iconClass} text-green-600`} />;
    case 'png':
    case 'jpg':
    case 'jpeg':
      return <Image className={`${iconClass} text-green-500`} />;
    case 'sql':
      return <File className={`${iconClass} text-purple-500`} />;
    default:
      return <File className={`${iconClass} text-gray-500`} />;
  }
}

// Komponen untuk highlight search text
function HighlightText({ text, highlight }) {
  if (!highlight) return text;
  
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <>
      {parts.map((part, index) => 
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark>
        ) : (
          part
        )
      )}
    </>
  );
}

// Komponen untuk advanced filters
function AdvancedFilters({ filters, onFiltersChange, isOpen, onToggle }) {
  if (!isOpen) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFiltersChange({...filters, category: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="">Semua Kategori</option>
            <option value="Keuangan">Keuangan</option>
            <option value="HR">HR</option>
            <option value="Meeting">Meeting</option>
            <option value="IT">IT</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>

        {/* File Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipe File
          </label>
          <select
            value={filters.type}
            onChange={(e) => onFiltersChange({...filters, type: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="">Semua Tipe</option>
            <option value="pdf">PDF</option>
            <option value="docx">Word</option>
            <option value="pptx">PowerPoint</option>
            <option value="xlsx">Excel</option>
            <option value="png">Gambar</option>
            <option value="sql">Database</option>
          </select>
        </div>

        {/* Date From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dari Tanggal
          </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFiltersChange({...filters, dateFrom: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sampai Tanggal
          </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onFiltersChange({...filters, dateTo: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
        </div>

        {/* Upload By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Diupload Oleh
          </label>
          <select
            value={filters.uploadBy}
            onChange={(e) => onFiltersChange({...filters, uploadBy: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="">Semua Pengguna</option>
            <option value="Admin">Admin</option>
            <option value="HR Manager">HR Manager</option>
            <option value="Finance">Finance</option>
            <option value="IT Support">IT Support</option>
            <option value="Designer">Designer</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>

        {/* File Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ukuran File
          </label>
          <select
            value={filters.fileSize}
            onChange={(e) => onFiltersChange({...filters, fileSize: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="">Semua Ukuran</option>
            <option value="small">Kecil (&lt; 1 MB)</option>
            <option value="medium">Sedang (1-10 MB)</option>
            <option value="large">Besar (&gt; 10 MB)</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFiltersChange({...filters, status: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="archived">Arsip</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="flex items-end">
          <button
            onClick={() => onFiltersChange({
              category: '',
              type: '',
              dateFrom: '',
              dateTo: '',
              uploadBy: '',
              fileSize: '',
              status: ''
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Reset Filter
          </button>
        </div>
      </div>
    </div>
  );
}

// Komponen untuk search result item
function SearchResultItem({ document, searchQuery }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <FileIcon type={document.type} />
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            <HighlightText text={document.name} highlight={searchQuery} />
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-1">
              <Tag className="w-4 h-4" />
              <span>{document.category}</span>
            </div>
            <div className="flex items-center space-x-1">
              <File className="w-4 h-4" />
              <span>{document.size}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{document.uploadDate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{document.uploadBy}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">
            <HighlightText text={document.content} highlight={searchQuery} />
          </p>
          
          <div className="flex items-center justify-between">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              document.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {document.status === 'active' ? 'Aktif' : 'Arsip'}
            </span>
            
            <div className="flex space-x-2">
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    dateFrom: '',
    dateTo: '',
    uploadBy: '',
    fileSize: '',
    status: ''
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Function to perform search
  const performSearch = () => {
    if (!searchQuery && !Object.values(filters).some(filter => filter)) {
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    // Simulate search delay
    setTimeout(() => {
      let results = mockDocuments;

      // Filter by search query
      if (searchQuery) {
        results = results.filter(doc =>
          doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.uploadBy.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply filters
      if (filters.category) {
        results = results.filter(doc => doc.category === filters.category);
      }
      if (filters.type) {
        results = results.filter(doc => doc.type === filters.type);
      }
      if (filters.status) {
        results = results.filter(doc => doc.status === filters.status);
      }
      if (filters.uploadBy) {
        results = results.filter(doc => doc.uploadBy === filters.uploadBy);
      }
      if (filters.dateFrom) {
        results = results.filter(doc => doc.uploadDate >= filters.dateFrom);
      }
      if (filters.dateTo) {
        results = results.filter(doc => doc.uploadDate <= filters.dateTo);
      }

      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch();
  };

  const handleRecentSearchClick = (query) => {
    setSearchQuery(query);
    performSearch();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pencarian Dokumen</h1>
        <p className="text-gray-600 mt-1">Temukan dokumen yang Anda butuhkan dengan mudah</p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari dokumen berdasarkan nama, konten, atau kategori..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-900"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>{isSearching ? 'Mencari...' : 'Cari'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter Lanjutan</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
            </button>

            {Object.values(filters).some(filter => filter) && (
              <button
                type="button"
                onClick={() => setFilters({
                  category: '',
                  type: '',
                  dateFrom: '',
                  dateTo: '',
                  uploadBy: '',
                  fileSize: '',
                  status: ''
                })}
                className="text-red-600 hover:text-red-800 text-sm flex items-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Hapus Semua Filter</span>
              </button>
            )}
          </div>
        </form>

        <AdvancedFilters
          filters={filters}
          onFiltersChange={setFilters}
          isOpen={showAdvancedFilters}
          onToggle={() => setShowAdvancedFilters(!showAdvancedFilters)}
        />
      </div>

      {/* Sidebar with Recent and Saved Searches */}
      {!hasSearched && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Searches */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <History className="w-5 h-5" />
              <span>Pencarian Terbaru</span>
            </h3>
            <div className="space-y-2">
              {mockRecentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(search)}
                  className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>

          {/* Saved Searches */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Tag className="w-5 h-5" />
              <span>Pencarian Tersimpan</span>
            </h3>
            <div className="space-y-3">
              {mockSavedSearches.map((search) => (
                <div key={search.id} className="border border-gray-200 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900">{search.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">"{search.query}"</p>
                  <button
                    onClick={() => {
                      setSearchQuery(search.query);
                      setFilters(search.filters);
                      performSearch();
                    }}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Gunakan Pencarian Ini
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Hasil Pencarian {searchQuery && `untuk "${searchQuery}"`}
            </h2>
            <p className="text-sm text-gray-600">
              {searchResults.length} hasil ditemukan
            </p>
          </div>

          {isSearching ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Mencari dokumen...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((document) => (
                <SearchResultItem
                  key={document.id}
                  document={document}
                  searchQuery={searchQuery}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada hasil</h3>
              <p className="mt-1 text-sm text-gray-500">
                Coba ubah kata kunci atau filter pencarian Anda.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}