import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  return (
    <div className="min-h-screen w-full flex">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 bottom-0 z-20">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="bg-[#FAFAFA] dark:bg-[#121212] ml-64 flex-1">
        {/* Fixed Navbar */}
        <Navbar />
        
        {/* Page Content */}
        <main className=" pt-20 dark:bg-[#121212]">  {/* pt-20 accounts for navbar height */}

          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;