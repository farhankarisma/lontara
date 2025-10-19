"use client";

import Header from "./Header";
import Sidebar from "./Sidebar";
import { useState } from "react";

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex-col h-screen bg-gray-50">
      {/* Sidebar - Single component that handles both desktop and mobile */}

      <Header onMenuClick={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden lg:ml-0">
        {/* Header */}

        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
