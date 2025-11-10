"use client";

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  icon: Icon,
  rightElement,
  className = "",
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full border ${
            error ? "border-red-300" : "border-gray-300"
          } rounded-lg px-3 py-2 ${
            Icon ? "pl-10" : ""
          } ${
            rightElement ? "pr-10" : ""
          } focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 disabled:bg-gray-50 disabled:text-gray-500`}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}