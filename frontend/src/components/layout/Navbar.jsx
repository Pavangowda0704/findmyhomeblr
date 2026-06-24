import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBars, FaTimes, FaChevronDown, FaTachometerAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setDropdownOpen(false);
    setMobileOpen(false);
  };

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'agent') return '/agent';
    return '/dashboard';
  };

  const navLinks = [
    { to: '/buy', label: 'Buy' },
    { to: '/rent', label: 'Rent' },
    { to: '/commercial', label: 'Commercial' },
    { to: '/compare', label: 'Compare' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo + Brand */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img
              src="/logo-light1.jpeg"
              alt="Find My Home BLR"
              className="h-16 w-auto object-contain"
              style={{ maxWidth: '240px' }}
            />
            
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-text-main hover:text-primary hover:bg-primary/5'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 border border-border hover:border-primary text-dark rounded-lg px-3 py-2 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-dark font-bold text-xs">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">{user?.name}</span>
                  <FaChevronDown className="text-xs text-text-sub" />
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-border z-20 py-2">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="font-semibold text-text-main text-sm truncate">{user?.name}</p>
                        <p className="text-text-sub text-xs mt-0.5 capitalize">{user?.role}</p>
                      </div>
                      <Link to={getDashboardLink()} onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-main hover:bg-background transition-colors">
                        <FaTachometerAlt className="text-primary" /> Dashboard
                      </Link>
                      <Link to="/dashboard/profile" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-main hover:bg-background transition-colors">
                        <FaUser className="text-primary" /> Profile
                      </Link>
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <FaSignOutAlt /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"
                  className="hidden sm:block text-sm font-medium text-dark border border-border hover:border-primary hover:text-primary px-5 py-2 rounded-lg transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg text-dark hover:bg-background transition-colors ml-1"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-1">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-text-main hover:text-primary hover:bg-primary/5'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {!isAuthenticated && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                  <Link to="/login" onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center text-dark border border-border hover:border-primary rounded-lg py-2.5 text-sm font-medium transition-colors">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center bg-primary text-dark font-semibold py-2.5 rounded-lg text-sm">
                    Register
                  </Link>
                </div>
              )}
              {isAuthenticated && (
                <div className="mt-3 pt-3 border-t border-border space-y-1">
                  <Link to={getDashboardLink()} onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-text-main hover:bg-background rounded-lg transition-colors">
                    <FaTachometerAlt className="text-primary" /> Dashboard
                  </Link>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;