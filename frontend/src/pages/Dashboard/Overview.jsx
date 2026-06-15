import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/user/userService';
import { leadService } from '../../services/lead/leadService';
import StatCard from '../../components/ui/StatCard';
import { FaHeart, FaEnvelope, FaHome, FaUser } from 'react-icons/fa';
import { formatPrice } from '../../constants';

export default function UserDashboard() {
  const { user } = useAuth();
  const [saved, setSaved] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      userService.getSavedProperties(),
      leadService.getMyEnquiries()
    ]).then(([s, e]) => {
      setSaved(s.data.savedProperties || []);
      setEnquiries(e.data.leads || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark">Welcome back, {user?.name}! 👋</h1>
        <p className="text-text-sub mt-1">Here's a summary of your activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard title="Saved Properties" value={saved.length} icon={FaHeart} color="red" />
        <StatCard title="Total Enquiries" value={enquiries.length} icon={FaEnvelope} color="blue" />
        <StatCard title="Active Enquiries" value={enquiries.filter(e => !['closed','lost'].includes(e.status)).length} icon={FaHome} color="green" />
        <StatCard title="Profile Complete" value={user?.phone ? 100 : 70} icon={FaUser} color="purple" suffix="%" />
      </div>

      {/* Recent Saved Properties */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-text-main">Recently Saved</h2>
            <Link to="/dashboard/saved" className="text-primary text-sm hover:underline">View All</Link>
          </div>
          {loading ? <p className="text-text-sub text-sm">Loading...</p> :
            saved.length === 0 ? (
              <div className="text-center py-8">
                <FaHeart className="text-4xl text-border mx-auto mb-3" />
                <p className="text-text-sub text-sm">No saved properties yet</p>
                <Link to="/buy" className="btn-primary text-sm py-2 px-4 mt-3 inline-flex">Browse Properties</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {saved.slice(0, 4).map(({ property }) => property && (
                  <Link key={property._id} to={`/property/${property._id}`} className="flex gap-3 p-3 rounded-lg hover:bg-background transition-colors">
                    <img
                      src={property.images?.[0]?.url || 'https://via.placeholder.com/60x50'}
                      alt={property.title}
                      className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                      onError={e => { e.target.src = 'https://via.placeholder.com/60x50'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-main truncate">{property.title}</p>
                      <p className="text-xs text-text-sub">{property.location?.locality}</p>
                      <p className="text-primary text-sm font-bold">{formatPrice(property.price, property.priceUnit)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )
          }
        </div>

        {/* Recent Enquiries */}
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-text-main">Recent Enquiries</h2>
            <Link to="/dashboard/enquiries" className="text-primary text-sm hover:underline">View All</Link>
          </div>
          {loading ? <p className="text-text-sub text-sm">Loading...</p> :
            enquiries.length === 0 ? (
              <div className="text-center py-8">
                <FaEnvelope className="text-4xl text-border mx-auto mb-3" />
                <p className="text-text-sub text-sm">No enquiries yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {enquiries.slice(0, 4).map(lead => (
                  <div key={lead._id} className="flex gap-3 p-3 rounded-lg bg-background">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-main truncate">{lead.property?.title}</p>
                      <p className="text-xs text-text-sub">{new Date(lead.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`badge text-xs self-start ${
                      lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                      lead.status === 'closed' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
