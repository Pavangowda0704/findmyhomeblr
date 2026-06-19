import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  FaListAlt, FaPlusCircle, FaUsers, FaSignOutAlt,
  FaTachometerAlt, FaUser, FaBars, FaTimes, FaHome
} from 'react-icons/fa';

const AgentLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  const links = [
    { to: '/agent', label: 'Dashboard', icon: FaTachometerAlt, end: true },
    { to: '/agent/listings', label: 'My Listings', icon: FaListAlt },
    { to: '/agent/listings/create', label: 'Add Listing', icon: FaPlusCircle },
    { to: '/agent/leads', label: 'My Leads', icon: FaUsers },
    { to: '/dashboard/profile', label: 'Profile', icon: FaUser },
  ];

  const SidebarContent = () => (
    <div className="p-5 flex flex-col h-full">
      {/* User profile */}
      <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border">
        <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-dark font-bold text-base flex-shrink-0">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-text-main text-sm truncate">{user?.name}</p>
          <p className="text-primary text-xs font-medium">Real Estate Agent</p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="space-y-1 flex-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to} to={to} end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-text-sub hover:bg-background hover:text-text-main'
              }`
            }
          >
            <Icon className="text-base flex-shrink-0" /> {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="pt-4 mt-4 border-t border-border space-y-1">
        <Link
          to="/"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-text-sub hover:bg-background hover:text-text-main transition-colors"
        >
          <FaHome className="text-base" /> View Website
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ── Top Navbar — WHITE ── */}
      <header className="bg-white border-b border-border h-16 fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-6 shadow-sm">

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg text-dark hover:bg-background transition-colors"
          >
            {sidebarOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
          </button>

          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/logo-light.jpeg"
              alt="Find My Home BLR"
              className="h-10 w-auto object-contain"
              style={{ maxWidth: '44px' }}
            />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-sm font-bold text-dark" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Find My Home <span className="text-primary">BLR</span>
              </span>
              <span className="text-[9px] text-text-sub uppercase tracking-widest">Agent Panel</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-text-sub text-sm hidden sm:block">{user?.name}</span>
          <span className="text-xs bg-primary text-dark font-bold px-2.5 py-1 rounded-full">Agent</span>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 text-text-sub hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FaSignOutAlt className="text-base" />
          </button>
        </div>
      </header>

      <div className="flex pt-16 min-h-screen">

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-border overflow-y-auto z-30
          transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}>
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AgentLayout;