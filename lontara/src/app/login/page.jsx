"use client";

import Image from "next/image";
import Link from "next/link";
import { User, Lock, AlertCircle, Loader2 } from "lucide-react";
import Button from "../components/ui/button";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loginType, setLoginType] = useState("user"); // "user" or "admin"
  const [error, setError] = useState("");
  
  const { login, loading, isAuthenticated, error: authError } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.username || !formData.password) {
      setError("Username dan password harus diisi");
      return;
    }

    try {
      const result = await login(formData, loginType === "admin");
      
      if (result.success) {
        // Redirect based on user type
        if (loginType === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(result.error || "Login gagal");
      }
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat login");
    }
  };

  return (
    <div
      style={{ backgroundImage: "url('/background.svg')" }}
      className="w-full h-screen flex justify-center items-center"
    >
      <div className="w-full max-w-md h-screen flex flex-col justify-center items-center bg-white m-4 gap-5">
        <Image
          src="/logo_lontara.svg"
          width={200}
          height={300}
          alt="Lontara Logo"
        />
        
        {/* Login Type Selector */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
          <button
            type="button"
            onClick={() => setLoginType("user")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              loginType === "user"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => setLoginType("admin")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              loginType === "admin"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-xs">
          {/* Error Message */}
          {(error || authError) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle size={16} />
              <span>{error || authError}</span>
            </div>
          )}

          <div className="relative mb-4">
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              className="pl-10 w-full border-b rounded-lg px-3 py-2 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              disabled={loading}
              required
            />
          </div>
          
          <div className="relative mb-4">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="pl-10 w-full border-b rounded-lg px-3 py-2 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              disabled={loading}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 text-sm"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
          
          <div className="flex justify-end mb-4">
            <Link 
              href="/forgot-password" 
              className="text-sm text-blue-500 hover:text-blue-300 transition"
            >
              Forgot Password?
            </Link>
          </div>

          <Button 
            type="submit" 
            className="mt-4 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Logging in...
              </>
            ) : (
              `Login as ${loginType === "admin" ? "Admin" : "User"}`
            )}
          </Button>
        </form>

        {/* Email Verification Link */}
        {loginType === "user" && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Belum verifikasi email?{" "}
              <Link 
                href="/verify-email" 
                className="text-blue-500 hover:text-blue-300 transition"
              >
                Klik di sini
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
