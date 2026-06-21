import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "../components/nav";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-white">
      
      <Nav />

      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;