"use client"

export default function Button({className="", children, ...props }) {
    return (
        <button
            className={`px-7 py-4 bg-[#4D4D4D] text-white rounded-lg hover:bg-[#4D4D4D]/70 transition ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}