"use client";

import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  User, 
  Shield, 
  Mail, 
  Phone, 
  Calendar, 
  Activity,
  Settings,
  Eye,
  UserCheck,
  UserX,
  Crown,
  Key,
  Clock,
  FileText,
  Download,
  Upload,
  X
} from "lucide-react";
import { useState } from "react";

// Mock data untuk users
const mockUsers = [
  {
    id: 1,
    name: "Ahmad Sudrajat",
    email: "ahmad.sudrajat@lontara.com",
    phone: "+62 812-3456-7890",
    role: "Super Admin",
    department: "IT",
    status: "active",
    lastLogin: "2024-10-15 14:30",
    joinDate: "2023-01-15",
    documentsUploaded: 45,
    documentsDownloaded: 89,
    avatar: "/api/placeholder/40/40"
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    email: "siti.nurhaliza@lontara.com",
    phone: "+62 811-2345-6789",
    role: "Manager",
    department: "Finance",
    status: "active",
    lastLogin: "2024-10-15 10:15",
    joinDate: "2023-03-20",
    documentsUploaded: 67,
    documentsDownloaded: 123,
    avatar: "/api/placeholder/40/40"
  },
  {
    id: 3,
    name: "Budi Santoso",
    email: "budi.santoso@lontara.com",
    phone: "+62 813-4567-8901",
    role: "Staff",
    department: "HR",
    status: "active",
    lastLogin: "2024-10-14 16:45",
    joinDate: "2023-06-10",
    documentsUploaded: 23,
    documentsDownloaded: 45,
    avatar: "/api/placeholder/40/40"
  },
  {
    id: 4,
    name: "Maya Sari",
    email: "maya.sari@lontara.com",
    phone: "+62 814-5678-9012",
    role: "Manager",
    department: "Marketing",
    status: "inactive",
    lastLogin: "2024-10-10 09:20",
    joinDate: "2023-08-05",
    documentsUploaded: 34,
    documentsDownloaded: 67,
    avatar: "/api/placeholder/40/40"
  },
  {
    id: 5,
    name: "Rizki Pratama",
    email: "rizki.pratama@lontara.com",
    phone: "+62 815-6789-0123",
    role: "Staff",
    department: "Legal",
    status: "active",
    lastLogin: "2024-10-15 11:30",
    joinDate: "2024-01-12",
    documentsUploaded: 12,
    documentsDownloaded: 28,
    avatar: "/api/placeholder/40/40"
  },
  {
    id: 6,
    name: "Dewi Lestari",
    email: "dewi.lestari@lontara.com",
    phone: "+62 816-7890-1234",
    role: "Viewer",
    department: "Sales",
    status: "active",
    lastLogin: "2024-10-13 14:15",
    joinDate: "2024-02-28",
    documentsUploaded: 0,
    documentsDownloaded: 15,
    avatar: "/api/placeholder/40/40"
  }
];

// Mock data untuk roles
const roles = [
  {
    name: "Super Admin",
    permissions: ["create", "read", "update", "delete", "manage_users", "system_settings"],
    color: "bg-red-100 text-red-800",
    icon: Crown
  },
  {
    name: "Manager",
    permissions: ["create", "read", "update", "delete", "manage_team"],
    color: "bg-blue-100 text-blue-800",
    icon: Shield
  },
  {
    name: "Staff",
    permissions: ["create", "read", "update"],
    color: "bg-green-100 text-green-800",
    icon: User
  },
  {
    name: "Viewer",
    permissions: ["read"],
    color: "bg-gray-100 text-gray-800",
    icon: Eye
  }
];

// Mock data untuk activity log
const mockActivityLog = [
  { id: 1, user: "Ahmad Sudrajat", action: "Login", timestamp: "2024-10-15 14:30", details: "Login from 192.168.1.100" },
  { id: 2, user: "Siti Nurhaliza", action: "Upload Document", timestamp: "2024-10-15 10:15", details: "Uploaded Laporan_Keuangan.pdf" },
  { id: 3, user: "Budi Santoso", action: "Download Document", timestamp: "2024-10-14 16:45", details: "Downloaded Kontrak_Kerja.pdf" },
  { id: 4, user: "Rizki Pratama", action: "Create Category", timestamp: "2024-10-14 11:30", details: "Created Legal Documents category" },
  { id: 5, user: "Maya Sari", action: "Update Profile", timestamp: "2024-10-10 09:20", details: "Updated phone number" }
];

// Komponen untuk User Card
function UserCard({ user, onEdit, onDelete, onViewDetails }) {
  const getRoleConfig = (roleName) => {
    return roles.find(role => role.name === roleName) || roles[2];
  };

  const roleConfig = getRoleConfig(user.role);
  const RoleIcon = roleConfig.icon;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleConfig.color}`}>
            <RoleIcon className="w-3 h-3 mr-1" />
            {user.role}
          </span>
          
          <div className="relative">
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-2" />
          <span>{user.department}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="w-4 h-4 mr-2" />
          <span>{user.phone}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>Last login: {user.lastLogin}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">{user.documentsUploaded}</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
            <Download className="w-4 h-4" />
            <span>Download</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">{user.documentsDownloaded}</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {user.status === 'active' ? <UserCheck className="w-3 h-3 mr-1" /> : <UserX className="w-3 h-3 mr-1" />}
          {user.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => onViewDetails(user)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="Lihat Detail"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onEdit(user)}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(user)}
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

// Komponen untuk User Modal (Add/Edit)
function UserModal({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'Staff',
    department: user?.department || '',
    status: user?.status || 'active'
  });

  const departments = ['IT', 'Finance', 'HR', 'Marketing', 'Legal', 'Sales', 'Operations'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...user, ...formData });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {user ? 'Edit Pengguna' : 'Tambah Pengguna'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Masukkan email"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor Telepon
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Masukkan nomor telepon"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            >
              {roles.map((role) => (
                <option key={role.name} value={role.name}>{role.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departemen *
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            >
              <option value="">Pilih Departemen</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
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
              {user ? 'Update' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Komponen untuk User Detail Modal
function UserDetailModal({ isOpen, onClose, user }) {
  if (!isOpen || !user) return null;

  const getRoleConfig = (roleName) => {
    return roles.find(role => role.name === roleName) || roles[2];
  };

  const roleConfig = getRoleConfig(user.role);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Detail Pengguna</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-gray-600" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900">{user.name}</h4>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Role:</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleConfig.color}`}>
                  {user.role}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Departemen:</span>
                <span className="text-sm font-medium text-gray-900">{user.department}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Telepon:</span>
                <span className="text-sm font-medium text-gray-900">{user.phone}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Bergabung:</span>
                <span className="text-sm font-medium text-gray-900">{user.joinDate}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Activity Stats */}
          <div className="space-y-4">
            <h5 className="font-medium text-gray-900">Aktivitas</h5>
            
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Dokumen Diupload</span>
                  <span className="text-lg font-semibold text-blue-600">{user.documentsUploaded}</span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Dokumen Didownload</span>
                  <span className="text-lg font-semibold text-green-600">{user.documentsDownloaded}</span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Login Terakhir</span>
                  <span className="text-sm font-medium text-gray-900">{user.lastLogin}</span>
                </div>
              </div>
            </div>
            
            {/* Permissions */}
            <div className="mt-6">
              <h5 className="font-medium text-gray-900 mb-3">Permissions</h5>
              <div className="space-y-2">
                {roleConfig.permissions.map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Key className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-gray-600 capitalize">
                      {permission.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActivityLog, setShowActivityLog] = useState(false);

  const departments = [...new Set(users.map(user => user.department))];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    const matchesDepartment = !filterDepartment || user.department === filterDepartment;
    const matchesStatus = !filterStatus || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
  });

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const handleDeleteUser = (user) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pengguna ${user.name}?`)) {
      setUsers(users.filter(u => u.id !== user.id));
    }
  };

  const handleSaveUser = (userData) => {
    if (selectedUser) {
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...userData } : u));
    } else {
      const newUser = {
        id: users.length + 1,
        ...userData,
        lastLogin: '-',
        joinDate: new Date().toISOString().split('T')[0],
        documentsUploaded: 0,
        documentsDownloaded: 0,
        avatar: "/api/placeholder/40/40"
      };
      setUsers([...users, newUser]);
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const inactiveUsers = users.filter(u => u.status === 'inactive').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
          <p className="text-gray-600 mt-1">Kelola pengguna, role, dan permissions</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button 
            onClick={() => setShowActivityLog(!showActivityLog)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <Activity className="w-4 h-4" />
            <span>Activity Log</span>
          </button>
          <button 
            onClick={handleAddUser}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pengguna</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pengguna</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pengguna Aktif</p>
              <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tidak Aktif</p>
              <p className="text-2xl font-bold text-red-600">{inactiveUsers}</p>
            </div>
            <UserX className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Roles</p>
              <p className="text-2xl font-bold text-purple-600">{roles.length}</p>
            </div>
            <Shield className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari pengguna..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="">Semua Role</option>
            {roles.map((role) => (
              <option key={role.name} value={role.name}>{role.name}</option>
            ))}
          </select>
          
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="">Semua Departemen</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Tidak Aktif</option>
          </select>
        </div>
      </div>

      {/* Activity Log (conditional) */}
      {showActivityLog && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Log</h3>
          <div className="space-y-3">
            {mockActivityLog.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <p className="text-xs text-gray-500">{activity.action} - {activity.details}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{activity.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada pengguna ditemukan</h3>
          <p className="text-gray-500">Tidak ada pengguna yang sesuai dengan filter yang dipilih.</p>
        </div>
      )}

      {/* Modals */}
      <UserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />
      
      <UserDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        user={selectedUser}
      />
    </div>
  );
}