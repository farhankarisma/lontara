"use client";

import { Loader2 } from "lucide-react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  onClick,
  type = "button",
  className = "",
}) {
  const baseClasses =
    "rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center justify-center space-x-2";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 disabled:opacity-50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4" />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}
