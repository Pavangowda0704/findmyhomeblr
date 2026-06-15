import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaUsers, FaBuilding, FaEnvelope, FaChartBar, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); toast.success('Logged out'); navigate('/'); };

  const links = [
    { to: '/admin', label: 'Dashboard', icon: FaTachometerAlt, end: true },
    { to: '/admin/users', label: 'Users', icon: FaUsers },
    { to: '/admin/properties', label: 'Properties', icon: FaBuilding },
    { to: '/admin/leads', label: 'Leads', icon: FaEnvelope },
    { to: '/admin/analytics', label: 'Analytics', icon: FaChartBar }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-dark text-white h-16 fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6">
        <Link to="/" className="flex items-center">
          <img src="/logo-dark.jpeg" alt="Find My Home BLR" className="h-10 w-auto object-contain" style={{ maxWidth: '130px' }} />
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-white/70 text-sm hidden sm:block">{user?.name}</span>
          <span className="text-xs bg-red-500 text-white font-semibold px-2 py-0.5 rounded-full">Admin</span>
          <button onClick={handleLogout} className="text-white/70 hover:text-white transition-colors">
            <FaSignOutAlt />
          </button>
        </div>
      </header>

      <div className="flex pt-16 min-h-screen">
        <aside className="w-64 bg-white border-r border-border fixed left-0 top-16 bottom-0 overflow-y-auto hidden md:block">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
              <div className="w-12 h-12 rounded-full bg-dark flex items-center justify-center text-white font-bold text-lg">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-text-main text-sm">{user?.name}</p>
                <p className="text-red-500 text-xs font-medium">Administrator</p>
              </div>
            </div>
            <nav className="space-y-1">
              {links.map(({ to, label, icon: Icon, end }) => (
                <NavLink key={to} to={to} end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-primary/10 text-primary' : 'text-text-sub hover:bg-background hover:text-text-main'
                    }`
                  }
                >
                  <Icon className="text-base" /> {label}
                </NavLink>
              ))}
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                <FaSignOutAlt /> Logout
              </button>
            </nav>
          </div>
        </aside>
        <main className="flex-1 md:ml-64 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
