import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaRuler, FaHeart, FaRegHeart, FaMapMarkerAlt, FaBalanceScale, FaCheckCircle, FaStar } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/user/userService';
import { formatPrice } from '../../constants';
import toast from 'react-hot-toast';

const PropertyCard = ({ property, onCompare, compareList = [] }) => {
  const { isAuthenticated } = useAuth();
  const [saved, setSaved] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [savingLoading, setSavingLoading] = useState(false);

  const isInCompare = compareList.includes(property._id);
  const images = property.images?.length ? property.images : [{ url: '/placeholder-property.jpg' }];

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { toast.error('Please login to save properties'); return; }
    setSavingLoading(true);
    try {
      const res = await userService.saveProperty(property._id);
      setSaved(res.data.saved);
      toast.success(res.data.saved ? 'Property saved!' : 'Removed from saved');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSavingLoading(false);
    }
  };

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onCompare && onCompare(property);
  };

  return (
    <Link to={`/property/${property._id}`} className="card group hover:shadow-md transition-all duration-300 block">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={images[imgIdx]?.url}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null; // prevent infinite error loop
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect width='400' height='250' fill='%232D3142'/%3E%3Ctext x='200' y='118' text-anchor='middle' fill='%237DC221' font-family='sans-serif' font-size='14' font-weight='bold'%3ENo Image%3C/text%3E%3Ctext x='200' y='140' text-anchor='middle' fill='%237DC221' font-family='sans-serif' font-size='11' opacity='0.7'%3EAvailable%3C/text%3E%3C/svg%3E";
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.featured && (
            <span className="badge bg-primary text-dark font-semibold">
              <FaStar className="mr-1 text-xs" /> Featured
            </span>
          )}
          {property.verified && (
            <span className="badge bg-green-500 text-white">
              <FaCheckCircle className="mr-1 text-xs" /> Verified
            </span>
          )}
        </div>

        {/* Listing type badge */}
        <div className="absolute top-3 right-3">
          <span className={`badge font-semibold ${
            property.listingType === 'buy' ? 'bg-blue-600 text-white' :
            property.listingType === 'rent' ? 'bg-purple-600 text-white' :
            'bg-orange-600 text-white'
          }`}>
            {property.listingType === 'buy' ? 'For Sale' : property.listingType === 'rent' ? 'For Rent' : 'Commercial'}
          </span>
        </div>

        {/* Actions overlay */}
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleSave}
            disabled={savingLoading}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-primary transition-colors"
            title="Save property"
          >
            {saved ? <FaHeart className="text-red-500 text-sm" /> : <FaRegHeart className="text-text-sub text-sm" />}
          </button>
          {onCompare && (
            <button
              onClick={handleCompare}
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors ${
                isInCompare ? 'bg-primary' : 'bg-white hover:bg-primary'
              }`}
              title="Compare"
            >
              <FaBalanceScale className="text-sm text-text-sub" />
            </button>
          )}
        </div>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
            {imgIdx + 1}/{images.length}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-text-main text-sm leading-tight line-clamp-2 flex-1">{property.title}</h3>
        </div>

        <p className="text-2xl font-bold text-primary mb-2">
          {formatPrice(property.price, property.priceUnit)}
        </p>

        <div className="flex items-center gap-1 text-text-sub text-xs mb-3">
          <FaMapMarkerAlt className="text-primary flex-shrink-0" />
          <span className="truncate">{property.location?.locality}, {property.location?.city}</span>
        </div>

        {/* Stats */}
        {(property.bedrooms || property.bathrooms || property.area?.total) && (
          <div className="flex items-center gap-4 pt-3 border-t border-border">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1.5 text-text-sub text-xs">
                <FaBed className="text-primary" />
                <span>{property.bedrooms} Bed</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1.5 text-text-sub text-xs">
                <FaBath className="text-primary" />
                <span>{property.bathrooms} Bath</span>
              </div>
            )}
            {property.area?.total && (
              <div className="flex items-center gap-1.5 text-text-sub text-xs">
                <FaRuler className="text-primary" />
                <span>{property.area.total} {property.area.unit || 'sqft'}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default PropertyCard;