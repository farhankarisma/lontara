"use client";

import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Eye, 
  Mail, 
  Smartphone, 
  Moon, 
  Sun, 
  Globe, 
  HardDrive, 
  Upload, 
  Download, 
  Lock, 
  Key, 
  Trash2, 
  Save, 
  RefreshCw, 
  AlertTriangle, 
  Check, 
  X,
  Monitor,
  Palette,
  FileText,
  Clock,
  Users,
  Activity,
  BarChart3,
  Zap,
  Wifi,
  Server
} from "lucide-react";
import { useState } from "react";

// Mock data untuk pengaturan
const initialSettings = {
  // Profile pengguna
  profile: {
    name: "Ahmad Sudrajat",
    email: "ahmad.sudrajat@lontara.com",
    phone: "+62 812-3456-7890",
    position: "Super Admin",
    avatar: "/api/placeholder/80/80"
  },
  
  // Notifikasi
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    documentUpload: true,
    documentDownload: false,
    systemAlerts: true,
    weeklyReport: true,
    soundEnabled: true
  },
  
  // Tampilan
  appearance: {
    theme: "light", // light, dark, system
    language: "id", // id, en
    timezone: "Asia/Jakarta",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h" // 12h, 24h
  },
  
  // Keamanan
  security: {
    twoFactorAuth: false,
    sessionTimeout: 30, // minutes
    passwordExpiry: 90, // days
    loginAlerts: true,
    ipWhitelist: false
  },
  
  // Sistem
  system: {
    autoBackup: true,
    backupFrequency: "daily", // daily, weekly, monthly
    maxFileSize: 100, // MB
    allowedFileTypes: ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "png", "jpg", "jpeg"],
    retentionPeriod: 365, // days
    enableLogging: true
  }
};

// Komponen untuk Setting Section
function SettingSection({ title, icon: Icon, children, className = "" }) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <Icon className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// Komponen untuk Setting Item
function SettingItem({ label, description, children, className = "" }) {
  return (
    <div className={`flex items-center justify-between py-3 ${className}`}>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-900">{label}</h4>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      <div className="ml-4">
        {children}
      </div>
    </div>
  );
}

// Komponen untuk Toggle Switch
function ToggleSwitch({ enabled, onChange, disabled = false }) {
  return (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`} />
    </button>
  );
}

// Komponen untuk Profile Picture Upload
function ProfilePictureUpload({ currentAvatar, onUpload }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpload(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
        {currentAvatar ? (
          <img src={currentAvatar} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <User className="w-10 h-10 text-gray-400" />
        )}
      </div>
      <div>
        <label className="cursor-pointer bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Upload Foto
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
        <p className="text-xs text-gray-500 mt-1">JPG, PNG maksimal 2MB</p>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState("profile");
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setHasChanges(false);
    alert("Pengaturan berhasil disimpan!");
  };

  const handleReset = () => {
    if (confirm("Apakah Anda yakin ingin mengembalikan pengaturan ke default?")) {
      setSettings(initialSettings);
      setHasChanges(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "notifications", label: "Notifikasi", icon: Bell },
    { id: "appearance", label: "Tampilan", icon: Palette },
    { id: "security", label: "Keamanan", icon: Shield },
    { id: "system", label: "Sistem", icon: Database }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
          <p className="text-gray-600 mt-1">Kelola preferensi dan konfigurasi aplikasi</p>
        </div>
        
        {hasChanges && (
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button 
              onClick={handleReset}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saving ? 'Menyimpan...' : 'Simpan'}</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation Tabs */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {/* Profile Settings */}
          {activeTab === "profile" && (
            <SettingSection title="Profil Pengguna" icon={User}>
              <div className="space-y-6">
                <ProfilePictureUpload
                  currentAvatar={settings.profile.avatar}
                  onUpload={(avatar) => updateSetting('profile', 'avatar', avatar)}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      value={settings.profile.name}
                      onChange={(e) => updateSetting('profile', 'name', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                    <input
                      type="tel"
                      value={settings.profile.phone}
                      onChange={(e) => updateSetting('profile', 'phone', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Posisi</label>
                    <input
                      type="text"
                      value={settings.profile.position}
                      onChange={(e) => updateSetting('profile', 'position', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </SettingSection>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <SettingSection title="Pengaturan Notifikasi" icon={Bell}>
              <div className="space-y-4">
                <SettingItem
                  label="Email Notifications"
                  description="Terima notifikasi melalui email"
                >
                  <ToggleSwitch
                    enabled={settings.notifications.emailNotifications}
                    onChange={(value) => updateSetting('notifications', 'emailNotifications', value)}
                  />
                </SettingItem>
                
                <SettingItem
                  label="Push Notifications"
                  description="Terima notifikasi push di browser"
                >
                  <ToggleSwitch
                    enabled={settings.notifications.pushNotifications}
                    onChange={(value) => updateSetting('notifications', 'pushNotifications', value)}
                  />
                </SettingItem>
                
                <SettingItem
                  label="Notifikasi Upload Dokumen"
                  description="Notifikasi saat ada dokumen baru diupload"
                >
                  <ToggleSwitch
                    enabled={settings.notifications.documentUpload}
                    onChange={(value) => updateSetting('notifications', 'documentUpload', value)}
                  />
                </SettingItem>
                
                <SettingItem
                  label="Notifikasi Download Dokumen"
                  description="Notifikasi saat dokumen didownload"
                >
                  <ToggleSwitch
                    enabled={settings.notifications.documentDownload}
                    onChange={(value) => updateSetting('notifications', 'documentDownload', value)}
                  />
                </SettingItem>
                
                <SettingItem
                  label="System Alerts"
                  description="Notifikasi untuk peringatan sistem"
                >
                  <ToggleSwitch
                    enabled={settings.notifications.systemAlerts}
                    onChange={(value) => updateSetting('notifications', 'systemAlerts', value)}
                  />
                </SettingItem>
                
                <SettingItem
                  label="Laporan Mingguan"
                  description="Terima laporan aktivitas mingguan"
                >
                  <ToggleSwitch
                    enabled={settings.notifications.weeklyReport}
                    onChange={(value) => updateSetting('notifications', 'weeklyReport', value)}
                  />
                </SettingItem>
                
                <SettingItem
                  label="Sound Notifications"
                  description="Putar suara untuk notifikasi"
                >
                  <ToggleSwitch
                    enabled={settings.notifications.soundEnabled}
                    onChange={(value) => updateSetting('notifications', 'soundEnabled', value)}
                  />
                </SettingItem>
              </div>
            </SettingSection>
          )}

          {/* Appearance Settings */}
          {activeTab === "appearance" && (
            <SettingSection title="Pengaturan Tampilan" icon={Palette}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "light", label: "Light", icon: Sun },
                      { value: "dark", label: "Dark", icon: Moon },
                      { value: "system", label: "System", icon: Monitor }
                    ].map((theme) => {
                      const Icon = theme.icon;
                      return (
                        <button
                          key={theme.value}
                          onClick={() => updateSetting('appearance', 'theme', theme.value)}
                          className={`flex flex-col items-center p-4 rounded-lg border transition-colors ${
                            settings.appearance.theme === theme.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="w-6 h-6 mb-2" />
                          <span className="text-sm font-medium">{theme.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bahasa</label>
                    <select
                      value={settings.appearance.language}
                      onChange={(e) => updateSetting('appearance', 'language', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value="id">Bahasa Indonesia</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                      value={settings.appearance.timezone}
                      onChange={(e) => updateSetting('appearance', 'timezone', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                      <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                      <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Format Tanggal</label>
                    <select
                      value={settings.appearance.dateFormat}
                      onChange={(e) => updateSetting('appearance', 'dateFormat', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Format Waktu</label>
                    <select
                      value={settings.appearance.timeFormat}
                      onChange={(e) => updateSetting('appearance', 'timeFormat', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value="24h">24 Jam</option>
                      <option value="12h">12 Jam (AM/PM)</option>
                    </select>
                  </div>
                </div>
              </div>
            </SettingSection>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <SettingSection title="Pengaturan Keamanan" icon={Shield}>
              <div className="space-y-6">
                <SettingItem
                  label="Two-Factor Authentication"
                  description="Tambahan keamanan dengan verifikasi dua langkah"
                >
                  <ToggleSwitch
                    enabled={settings.security.twoFactorAuth}
                    onChange={(value) => updateSetting('security', 'twoFactorAuth', value)}
                  />
                </SettingItem>
                
                <SettingItem
                  label="Login Alerts"
                  description="Notifikasi saat ada login dari device baru"
                >
                  <ToggleSwitch
                    enabled={settings.security.loginAlerts}
                    onChange={(value) => updateSetting('security', 'loginAlerts', value)}
                  />
                </SettingItem>
                
                <SettingItem
                  label="IP Whitelist"
                  description="Batasi akses hanya dari IP yang diizinkan"
                >
                  <ToggleSwitch
                    enabled={settings.security.ipWhitelist}
                    onChange={(value) => updateSetting('security', 'ipWhitelist', value)}
                  />
                </SettingItem>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (menit)</label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      min="5"
                      max="180"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (hari)</label>
                    <input
                      type="number"
                      value={settings.security.passwordExpiry}
                      onChange={(e) => updateSetting('security', 'passwordExpiry', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      min="30"
                      max="365"
                    />
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Ganti Password</h4>
                      <p className="text-sm text-yellow-700 mt-1">Disarankan untuk mengganti password secara berkala</p>
                      <button className="mt-2 bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700">
                        Ganti Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SettingSection>
          )}

          {/* System Settings */}
          {activeTab === "system" && (
            <div className="space-y-6">
              <SettingSection title="Backup & Storage" icon={Database}>
                <div className="space-y-4">
                  <SettingItem
                    label="Auto Backup"
                    description="Backup otomatis database dan file"
                  >
                    <ToggleSwitch
                      enabled={settings.system.autoBackup}
                      onChange={(value) => updateSetting('system', 'autoBackup', value)}
                    />
                  </SettingItem>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Frekuensi Backup</label>
                    <select
                      value={settings.system.backupFrequency}
                      onChange={(e) => updateSetting('system', 'backupFrequency', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      disabled={!settings.system.autoBackup}
                    >
                      <option value="daily">Harian</option>
                      <option value="weekly">Mingguan</option>
                      <option value="monthly">Bulanan</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Retention Period (hari)</label>
                    <input
                      type="number"
                      value={settings.system.retentionPeriod}
                      onChange={(e) => updateSetting('system', 'retentionPeriod', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      min="30"
                      max="3650"
                    />
                    <p className="text-xs text-gray-500 mt-1">Berapa lama file akan disimpan sebelum dihapus otomatis</p>
                  </div>
                </div>
              </SettingSection>
              
              <SettingSection title="File Upload Settings" icon={Upload}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max File Size (MB)</label>
                    <input
                      type="number"
                      value={settings.system.maxFileSize}
                      onChange={(e) => updateSetting('system', 'maxFileSize', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      min="1"
                      max="1000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Allowed File Types</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "png", "jpg", "jpeg", "zip", "rar"].map((type) => (
                        <label key={type} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={settings.system.allowedFileTypes.includes(type)}
                            onChange={(e) => {
                              const types = e.target.checked
                                ? [...settings.system.allowedFileTypes, type]
                                : settings.system.allowedFileTypes.filter(t => t !== type);
                              updateSetting('system', 'allowedFileTypes', types);
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 uppercase">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </SettingSection>
              
              <SettingSection title="System Monitoring" icon={Activity}>
                <div className="space-y-4">
                  <SettingItem
                    label="Enable System Logging"
                    description="Catat semua aktivitas sistem untuk audit"
                  >
                    <ToggleSwitch
                      enabled={settings.system.enableLogging}
                      onChange={(value) => updateSetting('system', 'enableLogging', value)}
                    />
                  </SettingItem>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600">Storage Used</p>
                          <p className="text-lg font-semibold text-blue-900">2.4 GB</p>
                        </div>
                        <HardDrive className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600">System Health</p>
                          <p className="text-lg font-semibold text-green-900">Good</p>
                        </div>
                        <Activity className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-orange-600">Last Backup</p>
                          <p className="text-lg font-semibold text-orange-900">2h ago</p>
                        </div>
                        <Server className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </SettingSection>
            </div>
          )}
        </div>
      </div>

      {/* Save Indicator */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 bg-amber-100 border border-amber-300 rounded-lg p-4 shadow-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span className="text-amber-800 font-medium">Ada perubahan yang belum disimpan</span>
          </div>
        </div>
      )}
    </div>
  );
}