"use client";

import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  User,
  UserCheck,
  UserX,
  Crown,
  X,
  ShieldUser,
} from "lucide-react";
import { useState } from "react";
import ProtectedRoute from "../components/Routes/ProtectedRoutes";
import AppLayout from "../components/ui/AppLayout";
import AdminRoute from "../components/Routes/AdminRoutes";
import CreateUserModal from "../components/modals/CreateUserModal";

// Mock data untuk users
const mockUsers = [
  {
    id: 1,
    name: "Ahmad Sudrajat",
    email: "ahmad.sudrajat@lontara.com",
    phone: "+62 812-3456-7890",
    role: "Admin",
    department: "IT",
    status: "active",
    lastLogin: "2024-10-15 14:30",
    joinDate: "2023-01-15",
    documentsUploaded: 45,
    documentsDownloaded: 89,
    avatar: "/api/placeholder/40/40",
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    email: "siti.nurhaliza@lontara.com",
    phone: "+62 811-2345-6789",
    role: "Staff",
    department: "Finance",
    status: "active",
    lastLogin: "2024-10-15 10:15",
    joinDate: "2023-03-20",
    documentsUploaded: 67,
    documentsDownloaded: 123,
    avatar: "/api/placeholder/40/40",
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
    avatar: "/api/placeholder/40/40",
  },
  {
    id: 4,
    name: "Maya Sari",
    email: "maya.sari@lontara.com",
    phone: "+62 814-5678-9012",
    role: "Staff",
    department: "Marketing",
    status: "inactive",
    lastLogin: "2024-10-10 09:20",
    joinDate: "2023-08-05",
    documentsUploaded: 34,
    documentsDownloaded: 67,
    avatar: "/api/placeholder/40/40",
  },
  {
    id: 5,
    name: "Rizki Pratama",
    email: "rizki.pratama@lontara.com",
    role: "Staff",
    documentsUploaded: 12,
    documentsDownloaded: 28,
    avatar: "/api/placeholder/40/40",
  },
  {
    id: 6,
    name: "Dewi Lestari",
    email: "dewi.lestari@lontara.com",
    phone: "+62 816-7890-1234",
    role: "Staff",
    department: "Sales",
    status: "active",
    lastLogin: "2024-10-13 14:15",
    joinDate: "2024-02-28",
    documentsUploaded: 0,
    documentsDownloaded: 15,
    avatar: "/api/placeholder/40/40",
  },
];

const roles = [
  {
    name: "Admin",
    permissions: [
      "create",
      "read",
      "update",
      "delete",
      "manage_users",
      "system_settings",
    ],
    color: "bg-red-100 text-red-800",
    icon: Crown,
  },
  {
    name: "Staff",
    permissions: ["create", "read", "update"],
    color: "bg-green-100 text-green-800",
    icon: User,
  },
];

// Komponen untuk User Card
function UserCard({ user, onEdit, onDelete }) {
  // ✅ FIX: Safe role lookup with proper fallback
  const getRoleConfig = (roleName) => {
    const found = roles.find((role) => role.name === roleName);
    // Return Staff as default if role not found
    return found || roles.find((r) => r.name === "Staff") || roles[2];
  };

  const roleConfig = getRoleConfig(user.role);
  const RoleIcon = roleConfig?.icon || User;

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
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleConfig.color}`}
          >
            <RoleIcon className="w-3 h-3 mr-1" />
            {user.role}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <div className="flex space-x-2">
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

function UserModal({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "Staff",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...user, ...formData });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {user ? "Edit Pengguna" : "Tambah Pengguna"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Masukkan username"
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
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Masukkan email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            >
              {roles.map((role) => (
                <option key={role.name} value={role.name}>
                  {role.name}
                </option>
              ))}
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
              {user ? "Update" : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UsersPageContent() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleAddUser = () => {
    setShowCreateModal(true);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const handleCreateSuccess = () => {
    console.log("✅ User created successfully");
    // TODO: Refresh user list if you have GET /api/admin/users endpoint
    // Example:
    // fetchUsers();
  };

  const handleDeleteUser = (user) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pengguna ${user.name}?`)) {
      setUsers(users.filter((u) => u.id !== user.id));
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleSaveUser = (userData) => {
    if (selectedUser) {
      setUsers(
        users.map((u) => (u.id === selectedUser.id ? { ...u, ...userData } : u))
      );
    } else {
      const newUser = {
        id: users.length + 1,
        ...userData,
        lastLogin: "-",
        joinDate: new Date().toISOString().split("T")[0],
        documentsUploaded: 0,
        documentsDownloaded: 0,
        avatar: "/api/placeholder/40/40",
      };
      setUsers([...users, newUser]);
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const inactiveUsers = users.filter((u) => u.status === "inactive").length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manajemen Pengguna
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola pengguna, role, dan permissions
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <p className="text-sm text-gray-600">Staff</p>
              <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Admin</p>
              <p className="text-2xl font-bold text-red-600">{inactiveUsers}</p>
            </div>
            <ShieldUser className="w-9 h-9 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <option key={role.name} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tidak ada pengguna ditemukan
          </h3>
          <p className="text-gray-500">
            Tidak ada pengguna yang sesuai dengan filter yang dipilih.
          </p>
        </div>
      )}

      {/* Modals */}
      <UserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />

      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* <UserDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        user={selectedUser}
      /> */}
    </div>
  );
}

export default function UsersPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminRoute>
        <AppLayout>
          <UsersPageContent />
        </AppLayout>
      </AdminRoute>
    </ProtectedRoute>
  );
}
