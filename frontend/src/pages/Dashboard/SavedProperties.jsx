import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../../services/user/userService';
import { formatPrice } from '../../constants';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { FaHeart, FaMapMarkerAlt, FaBed, FaBath, FaRuler, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function SavedProperties() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getSavedProperties()
      .then(res => setSaved(res.data.savedProperties || []))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (propertyId) => {
    try {
      await userService.saveProperty(propertyId);
      setSaved(prev => prev.filter(s => s.property?._id !== propertyId));
      toast.success('Removed from saved');
    } catch { toast.error('Failed to remove'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark">Saved Properties</h1>
        <p className="text-text-sub mt-1">{saved.length} properties saved</p>
      </div>

      {saved.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-border">
          <FaHeart className="text-5xl text-border mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-text-main mb-2">No Saved Properties</h3>
          <p className="text-text-sub mb-6">Browse properties and save your favorites</p>
          <Link to="/buy" className="btn-primary">Browse Properties</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {saved.map(({ _id, property }) => property && (
            <div key={_id} className="card group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={property.images?.[0]?.url || 'https://via.placeholder.com/400x250'}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={e => { e.target.src = 'https://via.placeholder.com/400x250'; }}
                />
                <button
                  onClick={() => handleRemove(property._id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow"
                >
                  <FaTrash className="text-xs" />
                </button>
              </div>
              <div className="p-4">
                <Link to={`/property/${property._id}`} className="font-semibold text-text-main hover:text-primary text-sm line-clamp-2 transition-colors">
                  {property.title}
                </Link>
                <p className="text-2xl font-bold text-primary mt-1">{formatPrice(property.price, property.priceUnit)}</p>
                <div className="flex items-center gap-1 text-text-sub text-xs mt-2">
                  <FaMapMarkerAlt className="text-primary" />
                  <span>{property.location?.locality}, {property.location?.city}</span>
                </div>
                <div className="flex gap-4 mt-3 pt-3 border-t border-border">
                  {property.bedrooms > 0 && (
                    <span className="flex items-center gap-1.5 text-text-sub text-xs"><FaBed className="text-primary" /> {property.bedrooms}</span>
                  )}
                  {property.bathrooms > 0 && (
                    <span className="flex items-center gap-1.5 text-text-sub text-xs"><FaBath className="text-primary" /> {property.bathrooms}</span>
                  )}
                  {property.area?.total && (
                    <span className="flex items-center gap-1.5 text-text-sub text-xs"><FaRuler className="text-primary" /> {property.area.total} {property.area.unit}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
