import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { BANGALORE_LOCALITIES, PROPERTY_TYPES } from '../../constants';

const SearchBar = ({ variant = 'hero' }) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('buy');
  const [locality, setLocality] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [budget, setBudget] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (locality) params.set('locality', locality);
    if (propertyType) params.set('propertyType', propertyType);
    if (budget) {
      const [min, max] = budget.split('-');
      if (min) params.set('minPrice', min);
      if (max) params.set('maxPrice', max);
    }
    navigate(`/${tab}?${params.toString()}`);
  };

  const tabs = [
    { id: 'buy', label: 'Buy' },
    { id: 'rent', label: 'Rent' },
    { id: 'commercial', label: 'Commercial' }
  ];

  if (variant === 'hero') {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-2 w-full max-w-4xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-1 mb-2 p-1 bg-background rounded-xl">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                tab === t.id ? 'bg-primary text-dark shadow-sm' : 'text-text-sub hover:text-text-main'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 p-1">
          <div className="flex-1 relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-primary text-sm" />
            <select
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className="w-full pl-9 pr-4 py-3.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary text-text-main appearance-none"
            >
              <option value="">Select Locality</option>
              {BANGALORE_LOCALITIES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div className="flex-1 relative">
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full px-4 py-3.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary text-text-main appearance-none"
            >
              <option value="">Property Type</option>
              {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <div className="flex-1 relative">
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-4 py-3.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary text-text-main appearance-none"
            >
              <option value="">Budget</option>
              {tab === 'rent' ? (
                <>
                  <option value="0-10000">Under ₹10,000</option>
                  <option value="10000-20000">₹10k - 20k</option>
                  <option value="20000-35000">₹20k - 35k</option>
                  <option value="35000-50000">₹35k - 50k</option>
                  <option value="50000-">Above ₹50k</option>
                </>
              ) : (
                <>
                  <option value="0-3000000">Under 30 Lakh</option>
                  <option value="3000000-5000000">30L - 50L</option>
                  <option value="5000000-8000000">50L - 80L</option>
                  <option value="8000000-10000000">80L - 1Cr</option>
                  <option value="10000000-20000000">1Cr - 2Cr</option>
                  <option value="20000000-">Above 2Cr</option>
                </>
              )}
            </select>
          </div>

          <button type="submit" className="btn-primary px-8 py-3.5 rounded-xl whitespace-nowrap">
            <FaSearch /> Search
          </button>
        </form>
      </div>
    );
  }

  // Compact variant
  return (
    <form onSubmit={handleSearch} className="flex gap-2 items-center bg-white rounded-xl border border-border p-2">
      <div className="relative flex-1">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub text-sm" />
        <input
          type="text"
          value={locality}
          onChange={(e) => setLocality(e.target.value)}
          placeholder="Search by locality..."
          className="w-full pl-9 py-2 text-sm focus:outline-none"
        />
      </div>
      <button type="submit" className="bg-primary text-dark px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
