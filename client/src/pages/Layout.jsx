import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/DataContext';

const Layout = () => {
  // const { user, loading } = useAuth();
  

  //   if (loading) {
  //   return (
  //     <div className="min-h-dvh flex items-center justify-center bg-[#1a1a1a] text-white">
  //       <p className="text-gray-400">Loading...</p>
  //     </div>
  //   );
  // }

  // if (!user) return <Navigate to="/login" replace />;
  return (
    <div className="min-h-dvh flex flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 bg-[#1a1a1a] text-white p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
