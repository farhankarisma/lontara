"use client";

import Image from "next/image";
import Link from "next/link";
import { User, Lock } from "lucide-react";
import Button from "../components/ui/button";
import React, { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

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
        <div className="flex flex-col">
          <div className="relative mb-4">
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Username"
              className="pl-10 w-full border-b rounded-lg px-3 py-2"
            />
          </div>
          <div className="relative mb-4">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="pl-10 w-full border-b rounded-lg px-3 py-2"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 text-sm"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm text-blue-500 justify-end hover:text-blue-300 transition">Forgot Password?</Link>
          </div>
        </div>
        <Button className="mt-4">Login</Button>
      </div>
    </div>
  );
}
