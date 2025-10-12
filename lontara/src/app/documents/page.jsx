"use client";

import { 
  Upload, 
  Search, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  FileText, 
  Image, 
  File,
  Calendar,
  User,
  FolderOpen,
  MoreVertical,
  Grid,
  List,
  X
} from "lucide-react";
import { useState } from "react";

// Mock data untuk dokumen
const mockDocuments = [
  {
    id: 1,
    name: "Laporan_Keuangan_Q4_2024.pdf",
    category: "Keuangan",
    size: "2.4 MB",
    uploadDate: "2024-10-10",
    uploadBy: "Admin",
    type: "pdf",
    status: "active"
  },
  {
    id: 2,
    name: "Kontrak_Kerja_John_Doe.docx",
    category: "HR",
    size: "1.8 MB",
    uploadDate: "2024-10-09",
    uploadBy: "HR Manager",
    type: "docx",
    status: "active"
  },
  {
    id: 3,
    name: "Invoice_INV001_Oktober.pdf",
    category: "Keuangan",
    size: "892 KB",
    uploadDate: "2024-10-08",
    uploadBy: "Finance",
    type: "pdf",
    status: "active"
  },
  {
    id: 4,
    name: "Meeting_Notes_Project_Alpha.txt",
    category: "Meeting",
    size: "45 KB",
    uploadDate: "2024-10-07",
    uploadBy: "Project Manager",
    type: "txt",
    status: "archived"
  },
  {
    id: 5,
    name: "Design_Logo_Company.png",
    category: "Design",
    size: "3.2 MB",
    uploadDate: "2024-10-06",
    uploadBy: "Designer",
    type: "png",
    status: "active"
  },
  {
    id: 6,
    name: "Database_Backup_Oct.sql",
    category: "IT",
    size: "15.7 MB",
    uploadDate: "2024-10-05",
    uploadBy: "IT Admin",
    type: "sql",
    status: "archived"
  }
];

// Data untuk filter
const categories = ["all", "Keuangan", "HR", "Meeting", "Design", "IT"];
const statuses = ["all", "active", "archived"];

// Fungsi untuk mendapatkan icon berdasarkan tipe file
function getFileIcon(type) {
  switch (type) {
    case 'pdf':
      return <FileText className="w-8 h-8 text-red-500" />;
    case 'doc':
    case 'docx':
      return <FileText className="w-8 h-8 text-blue-500" />;
    case 'xls':
    case 'xlsx':
      return <FileText className="w-8 h-8 text-green-500" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
      return <Image className="w-8 h-8 text-purple-500" />;
    case 'txt':
      return <FileText className="w-8 h-8 text-gray-500" />;
    default:
      return <File className="w-8 h-8 text-gray-500" />;
  }
}

// Komponen untuk Document Card (Grid View)
function DocumentCard({ document, onView, onDownload, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {getFileIcon(document.type)}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate" title={document.name}>
              {document.name}
            </h3>
            <p className="text-sm text-gray-500">{document.size}</p>
          </div>
        </div>
        
        <div className="relative ml-2">
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <FolderOpen className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{document.category}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{document.uploadDate}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <User className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{document.uploadBy}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          document.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {document.status === 'active' ? 'Aktif' : 'Arsip'}
        </span>
        
        <div className="flex space-x-1">
          <button 
            onClick={() => onView(document)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="Lihat"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDownload(document)}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onEdit(document)}
            className="p-1 text-orange-600 hover:bg-orange-50 rounded"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(document)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="Hapus"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Komponen untuk Table View
function DocumentTable({ documents, onView, onDownload, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dokumen
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ukuran
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Upload By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getFileIcon(doc.type)}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                        {doc.name}
                      </div>
                      <div className="text-sm text-gray-500">{doc.type.toUpperCase()}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {doc.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {doc.size}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {doc.uploadDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {doc.uploadBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    doc.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {doc.status === 'active' ? 'Aktif' : 'Arsip'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button onClick={() => onView(doc)} className="text-blue-600 hover:text-blue-900">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDownload(doc)} className="text-green-600 hover:text-green-900">
                      <Download className="w-4 h-4" />
                    </button>
                    <button onClick={() => onEdit(doc)} className="text-orange-600 hover:text-orange-900">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(doc)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Komponen untuk Upload Modal
function UploadModal({ isOpen, onClose, onUpload }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Keuangan',
    file: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpload(formData);
    setFormData({ name: '', category: 'Keuangan', file: null });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Upload Dokumen</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Dokumen *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Masukkan nama dokumen"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            >
              {categories.filter(c => c !== 'all').map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File *
            </label>
            <input
              type="file"
              onChange={(e) => setFormData({...formData, file: e.target.files[0]})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Format yang didukung: PDF, DOC, DOCX, XLS, XLSX, PNG, JPG, TXT
            </p>
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
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Filter dokumen berdasarkan search dan filter
  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || doc.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleView = (document) => {
    alert(`Melihat dokumen: ${document.name}`);
  };

  const handleDownload = (document) => {
    alert(`Mengunduh dokumen: ${document.name}`);
  };

  const handleEdit = (document) => {
    alert(`Mengedit dokumen: ${document.name}`);
  };

  const handleDelete = (document) => {
    if (confirm(`Apakah Anda yakin ingin menghapus dokumen "${document.name}"?`)) {
      alert(`Dokumen "${document.name}" telah dihapus`);
    }
  };

  const handleUpload = (uploadData) => {
    alert(`Dokumen "${uploadData.name}" berhasil diupload ke kategori ${uploadData.category}`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Arsip Dokumen</h1>
          <p className="text-gray-600 mt-1">Kelola dan organisir dokumen perusahaan</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 w-full sm:w-auto justify-center"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Dokumen</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Dokumen</p>
              <p className="text-2xl font-bold text-gray-900">{mockDocuments.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FolderOpen className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dokumen Aktif</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockDocuments.filter(d => d.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Upload className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upload Bulan Ini</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Download className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Download</p>
              <p className="text-2xl font-bold text-gray-900">247</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-4">
          {/* Search */}
          <div className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari dokumen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>

          {/* Filters and View Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'Semua Kategori' : cat}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'Semua Status' : 
                     status === 'active' ? 'Aktif' : 
                     status === 'archived' ? 'Arsip' : status}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1 self-start sm:self-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded ${viewMode === 'table' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Menampilkan {filteredDocuments.length} dari {mockDocuments.length} dokumen
        </p>
      </div>

      {/* Documents Display */}
      {filteredDocuments.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onView={handleView}
                onDownload={handleDownload}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <DocumentTable
            documents={filteredDocuments}
            onView={handleView}
            onDownload={handleDownload}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada dokumen ditemukan</h3>
          <p className="text-gray-500">Tidak ada dokumen yang sesuai dengan filter yang dipilih.</p>
        </div>
      )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}