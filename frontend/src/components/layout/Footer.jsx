import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-5">
              <img
                src="/logo-dark.jpeg"
                alt="Find My Home BLR"
                className="h-16 w-auto object-contain"
                style={{ maxWidth: '160px' }}
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Bangalore's most trusted real estate platform. Find your dream home with ease.
            </p>
            <div className="flex gap-3">
              {[FaFacebook, FaInstagram, FaLinkedin, FaTwitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-white/10 hover:bg-primary hover:text-dark rounded-lg flex items-center justify-center transition-all">
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wide">Properties</h3>
            <ul className="space-y-3">
              {[
                { to: '/buy', label: 'Buy Property' },
                { to: '/rent', label: 'Rent Property' },
                { to: '/commercial', label: 'Commercial' },
                { to: '/compare', label: 'Compare Properties' }
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-white/60 hover:text-primary text-sm transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Areas */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wide">Popular Areas</h3>
            <ul className="space-y-3">
              {['Whitefield', 'Koramangala', 'Indiranagar', 'HSR Layout', 'Electronic City', 'Marathahalli'].map(area => (
                <li key={area}>
                  <Link to={`/buy?locality=${area}`} className="text-white/60 hover:text-primary text-sm transition-colors">{area}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wide">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <FaMapMarkerAlt className="text-primary mt-0.5 flex-shrink-0" />
                <span>123 MG Road, Bangalore, Karnataka 560001</span>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <FaPhone className="text-primary flex-shrink-0" />
                <a href="tel:+918001234567" className="hover:text-primary transition-colors">+91 800 123 4567</a>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <FaEnvelope className="text-primary flex-shrink-0" />
                <a href="mailto:hello@findmyhomeblr.com" className="hover:text-primary transition-colors">hello@findmyhomeblr.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo-dark.jpeg" alt="Find My Home BLR" className="h-8 w-auto object-contain" />
            <p className="text-white/40 text-sm">&copy; {currentYear} Find My Home BLR. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <a key={item} href="#" className="text-white/40 hover:text-primary text-xs transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
