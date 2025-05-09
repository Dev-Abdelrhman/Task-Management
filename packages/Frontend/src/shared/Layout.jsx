import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Sidebar for mobile (absolute and handled internally) */}
      <div className="md:hidden">
        <Sidebar />
      </div>

      {/* Sidebar for md and up */}
      <div className="hidden md:block fixed top-0 left-0 bottom-0 z-20 w-64">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="bg-[#FAFAFA] dark:bg-[#121212] flex-1 md:ml-64">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="pt-20 px-4 sm:px-6 lg:px-8 dark:bg-[#121212] min-h-[calc(100vh-80px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;