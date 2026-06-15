import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { propertyService } from '../../services/property/propertyService';
import EnquiryForm from '../../components/forms/EnquiryForm';
import PropertyCard from '../../components/property/PropertyCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatPrice, AMENITIES } from '../../constants';
import {
  FaBed, FaBath, FaRuler, FaMapMarkerAlt, FaCheckCircle,
  FaStar, FaShare, FaHeart, FaRegHeart, FaUser, FaPhone,
  FaCalendarAlt, FaChevronLeft, FaChevronRight, FaEye
} from 'react-icons/fa';
import { userService } from '../../services/user/userService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function PropertyDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLoading(true);
    propertyService.getProperty(id)
      .then(res => {
        setProperty(res.data.property);
        setSaved(res.data.isSaved);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    propertyService.getSimilar(id)
      .then(res => setSimilar(res.data.properties || []))
      .catch(() => {});

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleSave = async () => {
    if (!isAuthenticated) { toast.error('Please login to save properties'); return; }
    try {
      const res = await userService.saveProperty(property._id);
      setSaved(res.data.saved);
      toast.success(res.data.saved ? 'Property saved!' : 'Removed from saved');
    } catch { toast.error('Failed to save property'); }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: property.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!property) return (
    <div className="text-center py-20">
      <p className="text-2xl font-bold text-text-main mb-4">Property not found</p>
      <Link to="/buy" className="btn-primary">Browse Properties</Link>
    </div>
  );

  const images = property.images?.length ? property.images : [{ url: 'https://via.placeholder.com/800x500?text=No+Image' }];
  const amenityList = AMENITIES.filter(a => property.amenities?.includes(a.value));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-text-sub mb-6 flex flex-wrap gap-2 items-center">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link to={`/${property.listingType}`} className="hover:text-primary capitalize">{property.listingType}</Link>
        <span>/</span>
        <Link to={`/${property.listingType}?locality=${property.location.locality}`} className="hover:text-primary">{property.location.locality}</Link>
        <span>/</span>
        <span className="text-text-main truncate max-w-xs">{property.title}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="relative rounded-2xl overflow-hidden bg-border">
            <div className="aspect-[16/9] relative">
              <img
                src={images[imgIdx]?.url}
                alt={property.title}
                className="w-full h-full object-cover"
                onError={e => { e.target.src = 'https://via.placeholder.com/800x500?text=No+Image'; }}
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIdx((imgIdx - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                  ><FaChevronLeft /></button>
                  <button
                    onClick={() => setImgIdx((imgIdx + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                  ><FaChevronRight /></button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setImgIdx(i)} className={`w-2 h-2 rounded-full transition-colors ${i === imgIdx ? 'bg-primary' : 'bg-white/50'}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 p-3 bg-background overflow-x-auto">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${i === imgIdx ? 'border-primary' : 'border-transparent'}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Header */}
          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {property.featured && <span className="badge bg-primary/10 text-primary font-medium"><FaStar className="mr-1 text-xs" /> Featured</span>}
              {property.verified && <span className="badge bg-green-100 text-green-700 font-medium"><FaCheckCircle className="mr-1 text-xs" /> Verified</span>}
              <span className={`badge font-medium ${property.listingType === 'buy' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                {property.listingType === 'buy' ? 'For Sale' : property.listingType === 'rent' ? 'For Rent' : 'Commercial'}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-dark mb-3">{property.title}</h1>

            <div className="flex items-center gap-2 text-text-sub mb-4">
              <FaMapMarkerAlt className="text-primary flex-shrink-0" />
              <span>{property.location.address}, {property.location.locality}, {property.location.city} - {property.location.pincode}</span>
            </div>

            <div className="flex flex-wrap items-center gap-6 mb-5">
              <div className="text-3xl font-bold text-primary">{formatPrice(property.price, property.priceUnit)}</div>
              {property.area?.total && (
                <div className="text-text-sub text-sm">
                  ₹{Math.round(property.price / property.area.total).toLocaleString()} per {property.area.unit}
                </div>
              )}
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-border">
              {property.bedrooms > 0 && (
                <div className="text-center">
                  <FaBed className="text-primary mx-auto mb-1 text-xl" />
                  <p className="font-bold text-text-main">{property.bedrooms}</p>
                  <p className="text-text-sub text-xs">Bedrooms</p>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="text-center">
                  <FaBath className="text-primary mx-auto mb-1 text-xl" />
                  <p className="font-bold text-text-main">{property.bathrooms}</p>
                  <p className="text-text-sub text-xs">Bathrooms</p>
                </div>
              )}
              {property.area?.total && (
                <div className="text-center">
                  <FaRuler className="text-primary mx-auto mb-1 text-xl" />
                  <p className="font-bold text-text-main">{property.area.total}</p>
                  <p className="text-text-sub text-xs">{property.area.unit || 'sqft'}</p>
                </div>
              )}
              {property.floor?.total && (
                <div className="text-center">
                  <FaCalendarAlt className="text-primary mx-auto mb-1 text-xl" />
                  <p className="font-bold text-text-main">{property.floor.current || '-'}/{property.floor.total}</p>
                  <p className="text-text-sub text-xs">Floor</p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-5 pt-5 border-t border-border">
              <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${saved ? 'bg-red-50 border-red-200 text-red-500' : 'border-border text-text-sub hover:border-primary hover:text-primary'}`}>
                {saved ? <FaHeart /> : <FaRegHeart />} {saved ? 'Saved' : 'Save'}
              </button>
              <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-text-sub hover:border-primary hover:text-primary text-sm font-medium transition-colors">
                <FaShare /> Share
              </button>
              <div className="ml-auto flex items-center gap-1 text-text-sub text-sm">
                <FaEye /> {property.views} views
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="text-lg font-bold text-text-main mb-4">Property Description</h2>
            <p className="text-text-sub text-sm leading-relaxed whitespace-pre-line">{property.description}</p>

            {property.highlights?.length > 0 && (
              <div className="mt-5 pt-5 border-t border-border">
                <h3 className="font-semibold text-text-main mb-3">Key Highlights</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {property.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-text-sub">
                      <FaCheckCircle className="text-primary flex-shrink-0" /> {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Amenities */}
          {amenityList.length > 0 && (
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="text-lg font-bold text-text-main mb-4">Amenities & Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenityList.map(a => (
                  <div key={a.value} className="flex items-center gap-2 text-sm text-text-sub bg-background rounded-lg px-3 py-2">
                    <FaCheckCircle className="text-primary flex-shrink-0" /> {a.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nearby Places */}
          {property.nearbyPlaces?.length > 0 && (
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="text-lg font-bold text-text-main mb-4">Nearby Places</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.nearbyPlaces.map((place, i) => (
                  <div key={i} className="flex items-center justify-between bg-background rounded-lg px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-text-main">{place.name}</p>
                      <p className="text-xs text-text-sub capitalize">{place.type}</p>
                    </div>
                    <span className="text-primary text-sm font-medium">{place.distance}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Similar Properties */}
          {similar.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-text-main mb-5">Similar Properties</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {similar.map(p => <PropertyCard key={p._id} property={p} />)}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-5">
          {/* Enquiry Form */}
          <div className="sticky top-24">
            <EnquiryForm propertyId={property._id} agentName={property.agent?.name} />

            {/* Agent Card */}
            {property.agent && (
              <div className="bg-white rounded-xl border border-border p-5 mt-5">
                <h3 className="font-bold text-text-main mb-4">Listed By</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-dark font-bold text-lg">
                    {property.agent.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-text-main">{property.agent.name}</p>
                    <p className="text-text-sub text-xs">Verified Agent</p>
                  </div>
                </div>
                {property.agent.phone && (
                  <a href={`tel:${property.agent.phone}`} className="w-full flex items-center justify-center gap-2 bg-primary text-dark font-semibold py-3 rounded-lg hover:bg-primary-dark transition-colors text-sm">
                    <FaPhone /> {property.agent.phone}
                  </a>
                )}
              </div>
            )}

            {/* Property Details Summary */}
            <div className="bg-white rounded-xl border border-border p-5 mt-5">
              <h3 className="font-bold text-text-main mb-4">Property Details</h3>
              <div className="space-y-3">
                {[
                  { label: 'Property Type', value: property.propertyType?.replace('_', ' ') },
                  { label: 'Listing Type', value: property.listingType },
                  { label: 'Facing', value: property.facing?.replace('_', ' ') },
                  { label: 'Balconies', value: property.balconies },
                  { label: 'Age of Property', value: property.ageOfProperty ? `${property.ageOfProperty} years` : null },
                  { label: 'Carpet Area', value: property.area?.carpet ? `${property.area.carpet} ${property.area.unit}` : null }
                ].filter(i => i.value).map(item => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-text-sub">{item.label}</span>
                    <span className="font-medium text-text-main capitalize">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
