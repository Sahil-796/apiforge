import React from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from "react-router-dom";

const Layout = ({children}) => {
  return (
    <div className="min-h-dvh flex flex-col md:flex-row">
    <Sidebar />
    <main className="flex-1 bg-[#1a1a1a] text-white p-4">
     <Outlet/>
    </main>
  </div>
  )
}

export default Layout