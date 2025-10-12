"use client";

import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  FolderOpen, 
  FileText, 
  MoreVertical,
  Tag,
  Calendar,
  Users,
  X,
  Check
} from "lucide-react";
import { useState } from "react";

// Mock data untuk kategori
const mockCategories = [
  {
    id: 1,
    name: "Keuangan",
    description: "Dokumen terkait keuangan, laporan, invoice, dan anggaran",
    color: "#EF4444",
    documentCount: 45,
    createdDate: "2024-01-15",
    createdBy: "Admin",
    lastModified: "2024-10-08"
  },
  {
    id: 2,
    name: "HR",
    description: "Dokumen sumber daya manusia, kontrak, dan kebijakan",
    color: "#3B82F6",
    documentCount: 32,
    createdDate: "2024-01-20",
    createdBy: "HR Manager",
    lastModified: "2024-10-05"
  },
  {
    id: 3,
    name: "Meeting",
    description: "Notulen rapat, presentasi, dan agenda meeting",
    color: "#10B981",
    documentCount: 28,
    createdDate: "2024-02-01",
    createdBy: "Admin",
    lastModified: "2024-10-10"
  },
  {
    id: 4,
    name: "IT",
    description: "Dokumentasi teknis, backup, dan sistem informasi",
    color: "#8B5CF6",
    documentCount: 15,
    createdDate: "2024-02-15",
    createdBy: "IT Support",
    lastModified: "2024-10-07"
  },
  {
    id: 5,
    name: "Design",
    description: "Asset design, logo, template, dan material kreatif",
    color: "#F59E0B",
    documentCount: 22,
    createdDate: "2024-03-01",
    createdBy: "Designer",
    lastModified: "2024-10-09"
  },
  {
    id: 6,
    name: "Legal",
    description: "Dokumen hukum, kontrak, dan peraturan perusahaan",
    color: "#6B7280",
    documentCount: 18,
    createdDate: "2024-03-15",
    createdBy: "Legal Team",
    lastModified: "2024-10-06"
  }
];

// Komponen untuk color picker
function ColorPicker({ selectedColor, onColorChange }) {
  const colors = [
    "#EF4444", "#F97316", "#F59E0B", "#EAB308",
    "#84CC16", "#22C55E", "#10B981", "#14B8A6",
    "#06B6D4", "#0EA5E9", "#3B82F6", "#6366F1",
    "#8B5CF6", "#A855F7", "#D946EF", "#EC4899",
    "#F43F5E", "#6B7280", "#374151", "#1F2937"
  ];

  return (
    <div className="grid grid-cols-10 gap-2">
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onColorChange(color)}
          className={`w-6 h-6 rounded-full border-2 ${
            selectedColor === color ? 'border-gray-400' : 'border-gray-200'
          }`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

// Komponen untuk modal tambah/edit kategori
function CategoryModal({ isOpen, onClose, category, onSave }) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    color: category?.color || '#3B82F6'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {category ? 'Edit Kategori' : 'Tambah Kategori Baru'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Kategori *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Masukkan nama kategori"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Deskripsi kategori (opsional)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Warna Kategori
            </label>
            <ColorPicker 
              selectedColor={formData.color}
              onColorChange={(color) => setFormData({...formData, color})}
            />
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
              {category ? 'Update' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Komponen untuk card kategori
function CategoryCard({ category, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
        </div>
        <div className="relative">
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {category.description}
      </p>
      
      <div className="space-y-2 text-sm text-gray-500 mb-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center space-x-1">
            <FileText className="w-4 h-4" />
            <span>Dokumen:</span>
          </span>
          <span className="font-medium text-gray-900">{category.documentCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Dibuat:</span>
          </span>
          <span>{category.createdDate}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>Oleh:</span>
          </span>
          <span>{category.createdBy}</span>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
        <button 
          onClick={() => onEdit(category)}
          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onDelete(category.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState(mockCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Filter kategori berdasarkan search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSaveCategory = (formData) => {
    if (editingCategory) {
      // Update existing category
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData, lastModified: new Date().toISOString().split('T')[0] }
          : cat
      ));
    } else {
      // Add new category
      const newCategory = {
        id: Math.max(...categories.map(c => c.id)) + 1,
        ...formData,
        documentCount: 0,
        createdDate: new Date().toISOString().split('T')[0],
        createdBy: "Current User",
        lastModified: new Date().toISOString().split('T')[0]
      };
      setCategories([...categories, newCategory]);
    }
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
    }
  };

  const totalDocuments = categories.reduce((sum, cat) => sum + cat.documentCount, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kategori Dokumen</h1>
          <p className="text-gray-600 mt-1">Kelola kategori untuk mengorganisir dokumen Anda</p>
        </div>
        <button 
          onClick={handleAddCategory}
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Tag className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Kategori</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Dokumen</p>
              <p className="text-2xl font-bold text-gray-900">{totalDocuments}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FolderOpen className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Kategori Aktif</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.filter(cat => cat.documentCount > 0).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dibuat Bulan Ini</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Menampilkan {filteredCategories.length} dari {categories.length} kategori
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada kategori</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery ? 'Tidak ada kategori yang cocok dengan pencarian Anda.' : 'Mulai dengan menambahkan kategori baru.'}
          </p>
          {!searchQuery && (
            <div className="mt-6">
              <button 
                onClick={handleAddCategory}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Kategori</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={editingCategory}
        onSave={handleSaveCategory}
      />
    </div>
  );
}