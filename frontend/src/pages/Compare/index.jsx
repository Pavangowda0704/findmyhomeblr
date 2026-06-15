import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../../services/user/userService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatPrice, AMENITIES } from '../../constants';
import { FaTimes, FaCheckCircle, FaTimesCircle, FaSearch } from 'react-icons/fa';
import toast from 'react-hot-toast';

const COMPARE_FIELDS = [
  { key: 'price', label: 'Price', format: (v, p) => formatPrice(v, p.priceUnit) },
  { key: 'propertyType', label: 'Property Type', format: v => v?.replace('_', ' ') },
  { key: 'listingType', label: 'Listing Type', format: v => v },
  { key: 'bedrooms', label: 'Bedrooms', format: v => v || 'N/A' },
  { key: 'bathrooms', label: 'Bathrooms', format: v => v || 'N/A' },
  { key: 'area', label: 'Total Area', format: v => v?.total ? `${v.total} ${v.unit}` : 'N/A' },
  { key: 'floor', label: 'Floor', format: v => v?.current ? `${v.current}/${v.total}` : 'N/A' },
  { key: 'facing', label: 'Facing', format: v => v?.replace('_', ' ') || 'N/A' },
  { key: 'ageOfProperty', label: 'Age', format: v => v ? `${v} years` : 'N/A' },
  { key: 'verified', label: 'Verified', format: v => v ? '✓ Yes' : '✗ No' },
  { key: 'featured', label: 'Featured', format: v => v ? '✓ Yes' : '✗ No' }
];

export default function Compare() {
  const { isAuthenticated } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      userService.getCompareList()
        .then(res => setProperties(res.data.properties || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  const removeFromCompare = async (propertyId) => {
    try {
      await userService.toggleCompare(propertyId);
      setProperties(prev => prev.filter(p => p._id !== propertyId));
      toast.success('Removed from comparison');
    } catch { toast.error('Failed to remove'); }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🔒</p>
        <h2 className="text-2xl font-bold text-text-main mb-3">Login Required</h2>
        <p className="text-text-sub mb-6">Please login to use the property comparison feature.</p>
        <Link to="/login" className="btn-primary">Login Now</Link>
      </div>
    );
  }

  if (loading) return <LoadingSpinner />;

  if (properties.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">⚖️</p>
        <h2 className="text-2xl font-bold text-text-main mb-3">No Properties to Compare</h2>
        <p className="text-text-sub mb-6">Browse properties and click the compare icon to add them here.</p>
        <Link to="/buy" className="btn-primary"><FaSearch /> Browse Properties</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark">Compare Properties</h1>
        <p className="text-text-sub mt-1">Comparing {properties.length} {properties.length === 1 ? 'property' : 'properties'}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-xl border border-border overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-background">
              <th className="text-left p-4 text-text-sub text-sm font-medium w-40 border-b border-border">Feature</th>
              {properties.map(p => (
                <th key={p._id} className="p-4 border-b border-border min-w-[220px]">
                  <div className="relative">
                    <button
                      onClick={() => removeFromCompare(p._id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                    <img
                      src={p.images?.[0]?.url || 'https://via.placeholder.com/200x120?text=No+Image'}
                      alt={p.title}
                      className="w-full h-28 object-cover rounded-lg mb-2"
                      onError={e => { e.target.src = 'https://via.placeholder.com/200x120?text=No+Image'; }}
                    />
                    <Link to={`/property/${p._id}`} className="font-semibold text-text-main text-sm hover:text-primary transition-colors line-clamp-2">
                      {p.title}
                    </Link>
                    <p className="text-primary font-bold text-base mt-1">{formatPrice(p.price, p.priceUnit)}</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE_FIELDS.map((field, i) => (
              <tr key={field.key} className={i % 2 === 0 ? 'bg-white' : 'bg-background/50'}>
                <td className="p-4 text-text-sub text-sm font-medium border-b border-border">{field.label}</td>
                {properties.map(p => (
                  <td key={p._id} className="p-4 text-center text-sm text-text-main border-b border-border capitalize">
                    {field.format(p[field.key], p)}
                  </td>
                ))}
              </tr>
            ))}
            {/* Amenities row */}
            <tr className="bg-white">
              <td className="p-4 text-text-sub text-sm font-medium border-b border-border">Amenities</td>
              {properties.map(p => (
                <td key={p._id} className="p-4 border-b border-border">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {AMENITIES.filter(a => p.amenities?.includes(a.value)).map(a => (
                      <span key={a.value} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{a.label}</span>
                    ))}
                    {!p.amenities?.length && <span className="text-text-sub text-xs">None listed</span>}
                  </div>
                </td>
              ))}
            </tr>
            {/* CTA row */}
            <tr>
              <td className="p-4" />
              {properties.map(p => (
                <td key={p._id} className="p-4 text-center">
                  <Link to={`/property/${p._id}`} className="btn-primary text-sm py-2 px-4">View Details</Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <Link to="/buy" className="btn-outline text-sm"><FaSearch /> Browse More</Link>
        <button
          onClick={() => {
            properties.forEach(p => userService.toggleCompare(p._id).catch(() => {}));
            setProperties([]);
            toast.success('Compare list cleared');
          }}
          className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium"
        >
          <FaTimes /> Clear All
        </button>
      </div>
    </div>
  );
}
