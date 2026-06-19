import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../../components/shared/SearchBar';
import PropertyCard from '../../components/property/PropertyCard';
import { propertyService } from '../../services/property/propertyService';
import api from '../../services/api/axiosInstance';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  FaHome, FaBuilding, FaUsers, FaHandshake, FaShieldAlt,
  FaMapMarkerAlt, FaStar, FaChevronDown, FaChevronUp,
  FaPhone, FaEnvelope, FaLock, FaSearch, FaThumbsUp, FaCheckCircle
} from 'react-icons/fa';

const STATS = [
  { label: 'Properties Listed', value: '5,000+', sub: 'Verified & Active', icon: FaBuilding },
  { label: 'Happy Customers', value: '12,000+', sub: 'Trusted by Thousands', icon: FaUsers },
  { label: 'Expert Agents', value: '350+', sub: 'Professional Support', icon: FaHandshake },
  { label: 'Cities Covered', value: '15+', sub: 'Across Karnataka', icon: FaMapMarkerAlt }
];

const LOCATIONS = [
  { name: 'Whitefield', count: 342, color: '#1A2229' },
  { name: 'Koramangala', count: 289, color: '#24303A' },
  { name: 'Indiranagar', count: 201, color: '#2D3F4A' },
  { name: 'HSR Layout', count: 178, color: '#1A2229' },
  { name: 'Electronic City', count: 265, color: '#24303A' },
  { name: 'Marathahalli', count: 190, color: '#2D3F4A' }
];

const WHY_US = [
  { icon: FaShieldAlt, title: 'Verified Listings', desc: 'Every property is manually verified by our team before listing.' },
  { icon: FaSearch, title: 'Easy Search', desc: 'Advanced filters to find your perfect home quickly.' },
  { icon: FaUsers, title: 'Expert Agents', desc: 'Connect with certified, experienced real estate professionals.' },
  { icon: FaThumbsUp, title: 'Best Deals', desc: 'Negotiate directly with agents for the best market prices.' },
  { icon: FaLock, title: 'Secure Transactions', desc: 'Your data and transactions are always protected.' },
  { icon: FaHome, title: 'End-to-End Support', desc: 'We guide you from search to possession of your property.' }
];

const TESTIMONIALS = [
  { name: 'Rahul Sharma', role: 'Homebuyer', rating: 5, text: 'Found my dream apartment in Koramangala within 2 weeks! The process was incredibly smooth.', avatar: 'RS' },
  { name: 'Priya Nair', role: 'Renter', rating: 5, text: 'Best platform for rental properties in Bangalore. Verified listings saved me so much time.', avatar: 'PN' },
  { name: 'Vikram Singh', role: 'Investor', rating: 5, text: 'Used Find My Home BLR for 3 investments. The analytics and agent support is outstanding.', avatar: 'VS' }
];

const FAQS = [
  { q: 'How do I search for properties?', a: 'Use the search bar on our homepage to filter by location, type, and budget. You can also browse by listing type using the Buy, Rent, or Commercial tabs.' },
  { q: 'Are the listings verified?', a: 'Yes, all listings go through a manual verification process. Verified properties display a green badge.' },
  { q: 'How do I contact an agent?', a: 'Click on any property card to view details, then use the enquiry form to reach the assigned agent directly.' },
  { q: 'Is registration required to browse?', a: 'No, you can browse all properties without registration. However, registration is required to save properties and send enquiries.' },
  { q: 'Can I compare properties?', a: 'Yes! Use the Compare button on property cards to add up to 4 properties for a side-by-side comparison.' }
];

const HERO_BG = '/hero-page.png';
export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  useEffect(() => {
    propertyService.getFeatured()
      .then(res => setFeatured(res.data.properties || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setLeadLoading(true);
    try {
      await api.post('/leads', leadForm);
      setLeadSubmitted(true);
      setLeadForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setLeadLoading(false);
    }
  };

  return (
    <div>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden -mt-20">

        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${HERO_BG}')` }}
        />
        {/* Dark overlay — stronger on left for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/70 to-dark/30" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left — Text + Search */}
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6">
                <FaStar className="text-xs" /> Bangalore's #1 Real Estate Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
                Find Your Dream Home<br />
                <span className="text-primary">in Bangalore</span>
              </h1>

              <p className="text-white/70 text-lg mb-8 max-w-lg leading-relaxed">
                Discover 5,000+ verified properties across Bangalore. Buy, Rent and Invest with confidence.
              </p>

              {/* Search bar */}
              <div className="bg-white rounded-2xl shadow-2xl p-3 w-full max-w-xl">
                <SearchBar variant="hero" />
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-6 mt-8">
                {[
                  { icon: FaShieldAlt, label: 'Verified Listings' },
                  { icon: FaUsers, label: 'Expert Agents' },
                  { icon: FaHandshake, label: 'Best Deals' }
                ].map(b => (
                  <div key={b.label} className="flex items-center gap-2 text-white/80 text-sm">
                    <b.icon className="text-primary" /> {b.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Floating stat cards (hidden on small screens) */}
            
            {/* <div className="hidden lg:flex flex-col items-end gap-4 pr-4">
              <div className="bg-white rounded-2xl shadow-2xl p-5 flex items-center gap-4 w-56">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaBuilding className="text-primary text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-dark">5,000+</p>
                  <p className="text-text-sub text-sm">Properties Listed</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-2xl p-5 flex items-center gap-4 w-56 mr-12">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaUsers className="text-primary text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-dark">350+</p>
                  <p className="text-text-sub text-sm">Expert Agents</p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-white py-14 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <stat.icon className="text-xl text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-dark">{stat.value}</p>
                  <p className="text-text-sub text-xs mt-0.5">{stat.label}</p>
                  <p className="text-primary text-xs font-medium">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR LOCALITIES ── */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Popular Localities</h2>
            <p className="section-subtitle">Explore properties in Bangalore's most sought-after areas</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {LOCATIONS.map((loc) => (
              <Link
                key={loc.name}
                to={`/buy?locality=${loc.name}`}
                className="group relative h-40 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
                style={{ backgroundColor: loc.color }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/50 transition-all" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-white">
                  <FaMapMarkerAlt className="text-primary text-2xl mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-bold text-sm text-center">{loc.name}</p>
                  <p className="text-white/70 text-xs mt-1">{loc.count} Properties</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROPERTIES ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">Featured Properties</h2>
              <p className="section-subtitle">Handpicked premium listings just for you</p>
            </div>
            <Link to="/buy" className="btn-outline text-sm py-2 px-5 hidden sm:flex">View All</Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map(property => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-text-sub">
              <FaHome className="text-5xl mx-auto mb-4 text-border" />
              <p>No featured properties at the moment. Check back soon!</p>
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link to="/buy" className="btn-outline text-sm">View All Properties</Link>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose Find My Home BLR?</h2>
            <p className="section-subtitle">We make property search simple, safe, and successful</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_US.map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 border border-border hover:shadow-md hover:border-primary/30 transition-all group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <item.icon className="text-xl text-primary group-hover:text-dark transition-colors" />
                </div>
                <h3 className="font-bold text-text-main mb-2">{item.title}</h3>
                <p className="text-text-sub text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">What Our Customers Say</h2>
            <p className="text-white/60 mt-3">Real stories from real homeowners</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-secondary rounded-xl p-6 border border-white/10 hover:border-primary/30 transition-colors">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => <FaStar key={i} className="text-primary text-sm" />)}
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-dark font-bold text-sm">{t.avatar}</div>
                  <div>
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-white/50 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-border overflow-hidden hover:border-primary/30 transition-colors">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-text-main hover:text-primary transition-colors"
                >
                  {faq.q}
                  {openFaq === i
                    ? <FaChevronUp className="text-primary flex-shrink-0 text-sm" />
                    : <FaChevronDown className="text-text-sub flex-shrink-0 text-sm" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-text-sub text-sm leading-relaxed border-t border-border pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEAD CTA ── */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-dark mb-4">Can't Find What You're Looking For?</h2>
              <p className="text-dark/70 mb-6">Tell us your requirements and our expert agents will find the perfect property for you.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="tel:+918001234567" className="btn-secondary gap-3">
                  <FaPhone /> Call Us Now
                </a>
                <Link to="/contact" className="bg-white text-dark font-semibold px-6 py-3 rounded-lg hover:bg-background transition-colors inline-flex items-center gap-2">
                  <FaEnvelope /> Send Message
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h3 className="font-bold text-text-main mb-4">Quick Enquiry</h3>
              {leadSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaCheckCircle className="text-green-500 text-xl" />
                  </div>
                  <p className="font-semibold text-dark">Enquiry Submitted!</p>
                  <p className="text-text-sub text-sm mt-1">Our team will contact you within 24 hours.</p>
                  <button onClick={() => setLeadSubmitted(false)} className="mt-4 text-primary text-sm font-medium hover:underline">
                    Submit another enquiry
                  </button>
                </div>
              ) : (
                <form className="space-y-3" onSubmit={handleLeadSubmit}>
                  <input type="text" placeholder="Your Name" required
                    value={leadForm.name} onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                    className="input-field text-sm" />
                  <input type="email" placeholder="Email Address" required
                    value={leadForm.email} onChange={e => setLeadForm({ ...leadForm, email: e.target.value })}
                    className="input-field text-sm" />
                  <input type="tel" placeholder="Mobile Number" required
                    value={leadForm.phone} onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                    className="input-field text-sm" />
                  <textarea placeholder="Your requirements..." rows={3}
                    value={leadForm.message} onChange={e => setLeadForm({ ...leadForm, message: e.target.value })}
                    className="input-field text-sm resize-none" />
                  <button type="submit" disabled={leadLoading}
                    className="w-full bg-dark text-white font-semibold py-3 rounded-lg hover:bg-secondary transition-colors disabled:opacity-60">
                    {leadLoading ? 'Submitting...' : 'Submit Enquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}