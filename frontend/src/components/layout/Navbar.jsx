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
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setDropdownOpen(false);
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-dark ${scrolled ? 'shadow-lg' : ''}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">

          {/* Logo + Brand Title */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              src="/logo-dark.png"
              alt="Find My Home BLR"
              className="navbar-logo"
            />
            <div className="navbar-brand-title hidden sm:flex flex-col">
              <span className="brand-main">Find My Home <span>BLR</span></span>
              <span className="brand-sub">We Find. You Live.</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'text-primary bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-lg px-3 py-2 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-dark font-bold text-xs">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">{user?.name}</span>
                  <FaChevronDown className="text-xs" />
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-border z-20 py-2">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="font-semibold text-text-main text-sm truncate">{user?.name}</p>
                        <p className="text-text-sub text-xs mt-0.5 capitalize">{user?.role}</p>
                      </div>
                      <Link to={getDashboardLink()} onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-main hover:bg-background transition-colors">
                        <FaTachometerAlt className="text-primary" /> Dashboard
                      </Link>
                      <Link to="/dashboard/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-main hover:bg-background transition-colors">
                        <FaUser className="text-primary" /> Profile
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <FaSignOutAlt /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-white/80 hover:text-white text-sm font-medium px-4 py-2 transition-colors hidden sm:block">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Register</Link>
              </div>
            )}

            <button
              className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-1">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'text-primary bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {!isAuthenticated && (
                <div className="flex gap-2 mt-2 pt-2 border-t border-white/10">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-white/80 hover:text-white py-2 border border-white/20 rounded-lg text-sm">Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center bg-primary text-dark font-semibold py-2 rounded-lg text-sm">Register</Link>
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