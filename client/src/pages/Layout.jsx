import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Loading from '../components/Loading';
import { useAuth } from '../context/DataContext';

const Layout = () => {
  const { user, loading } = useAuth();
  
  // Show loading with sidebar layout while checking authentication
  if (loading) {
    return <Loading message="Authenticating..." showSidebar={true} />;
  }

  // Redirect to login if not authenticated
  if (!user) return <Navigate to="/login" replace />;
  
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