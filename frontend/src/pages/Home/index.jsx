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
  FaPhone, FaEnvelope, FaLock, FaSearch, FaThumbsUp
} from 'react-icons/fa';

const STATS = [
  { label: 'Properties Listed', value: '5,000+', icon: FaBuilding },
  { label: 'Happy Customers', value: '12,000+', icon: FaUsers },
  { label: 'Expert Agents', value: '350+', icon: FaHandshake },
  { label: 'Cities Covered', value: '15+', icon: FaMapMarkerAlt }
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

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setLeadLoading(true);
    try {
      await api.post('/leads', {
        name: leadForm.name,
        email: leadForm.email,
        phone: leadForm.phone,
        message: leadForm.message
      });
      setLeadSubmitted(true);
      setLeadForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setLeadLoading(false);
    }
  };

  useEffect(() => {
    propertyService.getFeatured()
      .then(res => setFeatured(res.data.properties || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-dark min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-secondary to-dark/90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6">
            <FaStar className="text-xs" /> Bangalore's #1 Real Estate Platform
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Find Your Dream Home<br />
            <span className="text-primary">in Bangalore</span>
          </h1>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
            Discover 5,000+ verified properties across Bangalore. Buy, rent, or invest with confidence.
          </p>
          <SearchBar variant="hero" />
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-white/60 text-sm">
            <span className="flex items-center gap-2"><FaShieldAlt className="text-primary" /> Verified Listings</span>
            <span className="flex items-center gap-2"><FaUsers className="text-primary" /> Expert Agents</span>
            <span className="flex items-center gap-2"><FaHandshake className="text-primary" /> Best Deals</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="text-2xl text-primary" />
                </div>
                <p className="text-3xl font-bold text-dark">{stat.value}</p>
                <p className="text-text-sub text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Locations */}
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
                className="group relative h-40 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                style={{ backgroundColor: loc.color }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/40 transition-all" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-white">
                  <FaMapMarkerAlt className="text-primary text-2xl mb-2" />
                  <p className="font-bold text-sm text-center">{loc.name}</p>
                  <p className="text-white/70 text-xs mt-1">{loc.count} Properties</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
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

      {/* Why Choose Us */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose Find My Home BLR?</h2>
            <p className="section-subtitle">We make property search simple, safe, and successful</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {WHY_US.map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 border border-border hover:shadow-md transition-all group">
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

      {/* Testimonials */}
      <section className="py-16 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">What Our Customers Say</h2>
            <p className="text-white/60 mt-3">Real stories from real homeowners</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-secondary rounded-xl p-6 border border-white/10">
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

      {/* FAQ */}
      <section className="py-16 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-text-main hover:text-primary transition-colors"
                >
                  {faq.q}
                  {openFaq === i ? <FaChevronUp className="text-primary flex-shrink-0" /> : <FaChevronDown className="text-text-sub flex-shrink-0" />}
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

      {/* Lead CTA Section */}
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
                    <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <p className="font-semibold text-dark">Enquiry Submitted!</p>
                  <p className="text-text-sub text-sm mt-1">Our team will contact you within 24 hours.</p>
                  <button onClick={() => setLeadSubmitted(false)} className="mt-4 text-primary text-sm font-medium hover:underline">Submit another enquiry</button>
                </div>
              ) : (
              <form className="space-y-3" onSubmit={handleLeadSubmit}>
                <input
                  type="text" placeholder="Your Name" required
                  value={leadForm.name} onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                  className="input-field text-sm"
                />
                <input
                  type="email" placeholder="Email Address" required
                  value={leadForm.email} onChange={e => setLeadForm({ ...leadForm, email: e.target.value })}
                  className="input-field text-sm"
                />
                <input
                  type="tel" placeholder="Mobile Number" required
                  value={leadForm.phone} onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                  className="input-field text-sm"
                />
                <textarea
                  placeholder="Your requirements..."
                  rows={3} value={leadForm.message}
                  onChange={e => setLeadForm({ ...leadForm, message: e.target.value })}
                  className="input-field text-sm resize-none"
                />
                <button type="submit" disabled={leadLoading} className="w-full bg-dark text-white font-semibold py-3 rounded-lg hover:bg-secondary transition-colors disabled:opacity-60">
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