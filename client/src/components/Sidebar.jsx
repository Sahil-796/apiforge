import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/DataContext';

const navItems = [
  { label: "Dashboard", path: "/" },
  // Add more items here as needed
];

export default function Sidebar() {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#1a1a1a] border-b border-[#2f2f2f] text-white">
        <span className="text-xl font-semibold">API Forge</span>
        <button onClick={() => setOpen(true)}><Menu size={24} /></button>
      </div>

      {/* Sidebar */}
      <div className={`fixed z-40 inset-y-0 left-0 transform ${open ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 md:w-64 w-60 bg-[#2f2f2f] text-white transition-transform duration-300`}>

        {/* Mobile close header */}
        <div className="flex items-center justify-between md:hidden p-4 border-b border-white/10">
          <span className="font-semibold">Menu</span>
          <button onClick={() => setOpen(false)}><X size={24} /></button>
        </div>

        {/* Desktop logo/header */}
        <div className="items-center justify-between hidden md:flex p-4 border-b border-white/10">
          <span className="font-semibold text-lg">API Forge</span>
        </div>

        {/* Sidebar content: nav + logout */}
        <div className="flex flex-col justify-between h-[calc(100%-64px)]"> {/* subtract header height */}
          
          {/* Navigation links */}
          <nav className="mt-4 flex flex-col gap-2 px-4">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className="py-2 px-3 rounded hover:bg-emerald-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Logout button pinned to bottom */}
          <div className="p-4">
            <button 
              onClick={logout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
