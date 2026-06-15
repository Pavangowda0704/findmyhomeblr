import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { leadService } from '../../services/lead/leadService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import LeadStatusBadge from '../../components/ui/LeadStatusBadge';
import { FaEnvelope, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { formatPrice } from '../../constants';

export default function MyEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leadService.getMyEnquiries()
      .then(res => setEnquiries(res.data.leads || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark">My Enquiries</h1>
        <p className="text-text-sub mt-1">{enquiries.length} enquiries submitted</p>
      </div>

      {enquiries.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-border">
          <FaEnvelope className="text-5xl text-border mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-text-main mb-2">No Enquiries Yet</h3>
          <p className="text-text-sub mb-6">Browse properties and send enquiries to agents</p>
          <Link to="/buy" className="btn-primary">Browse Properties</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map(lead => (
            <div key={lead._id} className="bg-white rounded-xl border border-border p-5">
              <div className="flex gap-4 items-start">
                {lead.property?.images?.[0] && (
                  <img
                    src={lead.property.images[0].url}
                    alt={lead.property.title}
                    className="w-24 h-18 rounded-lg object-cover flex-shrink-0 hidden sm:block"
                    style={{ height: '72px' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link to={`/property/${lead.property?._id}`} className="font-semibold text-text-main hover:text-primary transition-colors line-clamp-1">
                        {lead.property?.title || 'Property'}
                      </Link>
                      {lead.property?.location && (
                        <div className="flex items-center gap-1 text-text-sub text-xs mt-1">
                          <FaMapMarkerAlt className="text-primary" />
                          {lead.property.location.locality}, {lead.property.location.city}
                        </div>
                      )}
                    </div>
                    <LeadStatusBadge status={lead.status} />
                  </div>

                  {lead.message && (
                    <p className="text-text-sub text-sm mt-2 bg-background rounded-lg p-3 line-clamp-2">
                      "{lead.message}"
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-text-sub">
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt className="text-primary" />
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    {lead.property?.price && (
                      <span className="font-semibold text-primary">{formatPrice(lead.property.price)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
