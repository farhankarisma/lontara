"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Modal from "../ui/Modal";
import Alert from "../ui/Alert";
import Button from "../ui/button";
import Input from "../ui/Input";
import userService from "@/services/userService";

export default function CreateUserModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "STAFF",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Call API: POST /api/admin/create-user
    const result = await userService.createUser(formData);

    if (result.success) {
      // Success response from backend:
      // { message: 'User created & activation email sent', userId, username, email }

      alert(
        `✅ User berhasil dibuat!\n\n` +
          `Username: ${result.data.username}\n` +
          `Email: ${result.data.email}\n\n` +
          `📧 Email aktivasi telah dikirim!\n\n` +
          `User akan menerima link untuk:\n` +
          `• Set password\n` +
          `• Connect Gmail account`
      );

      // Reset form
      setFormData({ username: "", email: "", role: "STAFF" });

      // Call callbacks
      onSuccess?.();
      onClose();
    } else {
      // Error handling
      setError(result.error || "Gagal membuat user");
    }

    setLoading(false);
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tambah Pengguna Baru">
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <Input
          label="Username"
          type="text"
          value={formData.username}
          onChange={handleChange("username")}
          placeholder="Masukkan username"
          required
          disabled={loading}
        />

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange("email")}
          placeholder="user@example.com"
          required
          disabled={loading}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.role}
            onChange={handleChange("role")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            required
            disabled={loading}
          >
            <option value="STAFF">Staff</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <Alert
          type="info"
          message={
            <div>
              <p className="font-medium mb-1">
                📧 Email aktivasi akan dikirim ke user dengan link untuk:
              </p>
              <ul className="text-xs mt-2 ml-4 list-disc space-y-1">
                <li>Set password (link valid 24 jam)</li>
                <li>Connect Gmail account</li>
              </ul>
            </div>
          }
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button type="submit" variant="primary" icon={Plus} loading={loading}>
            Buat User
          </Button>
        </div>
      </form>
    </Modal>
  );
}
