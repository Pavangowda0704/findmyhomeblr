import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../../services/property/propertyService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Pagination from '../../components/ui/Pagination';
import { formatPrice } from '../../constants';
import { FaPlus, FaEdit, FaTrash, FaEye, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AgentListings() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetchListings = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      const res = await propertyService.getProperties({ ...params, agent: 'me' });
      // Use agent endpoint instead
      const agentRes = await import('../../services/api/axiosInstance').then(m => m.default.get('/agent/properties', { params }));
      setProperties(agentRes.data.properties || []);
      setTotalPages(agentRes.data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(1); setCurrentPage(1); }, [statusFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    setDeleting(id);
    try {
      await propertyService.deleteProperty(id);
      setProperties(prev => prev.filter(p => p._id !== id));
      toast.success('Listing deleted successfully');
    } catch {
      toast.error('Failed to delete listing');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dark">My Listings</h1>
          <p className="text-text-sub mt-1">Manage your property listings</p>
        </div>
        <Link to="/agent/listings/create" className="btn-primary text-sm">
          <FaPlus /> Add Listing
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {['', 'active', 'inactive', 'sold', 'rented'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              statusFilter === s ? 'bg-primary text-dark border-primary' : 'bg-white text-text-sub border-border hover:border-primary'
            }`}
          >
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : properties.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-border">
          <p className="text-5xl mb-4">🏠</p>
          <h3 className="text-xl font-semibold text-text-main mb-2">No listings yet</h3>
          <p className="text-text-sub mb-6">Start adding properties to your portfolio</p>
          <Link to="/agent/listings/create" className="btn-primary">Add First Listing</Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background border-b border-border">
                  <tr>
                    <th className="text-left text-xs font-medium text-text-sub px-5 py-4">Property</th>
                    <th className="text-left text-xs font-medium text-text-sub px-5 py-4">Price</th>
                    <th className="text-left text-xs font-medium text-text-sub px-5 py-4">Type</th>
                    <th className="text-left text-xs font-medium text-text-sub px-5 py-4">Status</th>
                    <th className="text-left text-xs font-medium text-text-sub px-5 py-4">Views</th>
                    <th className="text-left text-xs font-medium text-text-sub px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {properties.map(p => (
                    <tr key={p._id} className="hover:bg-background/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0]?.url || 'https://via.placeholder.com/48x36'}
                            alt={p.title}
                            className="w-12 h-9 rounded-lg object-cover flex-shrink-0"
                            onError={e => { e.target.src = 'https://via.placeholder.com/48x36'; }}
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-text-main truncate max-w-[200px]">{p.title}</p>
                            <p className="text-xs text-text-sub">{p.location?.locality}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-primary font-bold text-sm whitespace-nowrap">{formatPrice(p.price, p.priceUnit)}</td>
                      <td className="px-5 py-4">
                        <span className={`badge text-xs font-medium ${
                          p.listingType === 'buy' ? 'bg-blue-100 text-blue-700' :
                          p.listingType === 'rent' ? 'bg-purple-100 text-purple-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>{p.listingType}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge text-xs font-medium ${
                          p.status === 'active' ? 'bg-green-100 text-green-700' :
                          p.status === 'sold' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>{p.status}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-text-sub">{p.views || 0}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link to={`/property/${p._id}`} className="p-2 text-text-sub hover:text-primary rounded-lg hover:bg-primary/10 transition-colors" title="View">
                            <FaEye className="text-sm" />
                          </Link>
                          <Link to={`/agent/listings/edit/${p._id}`} className="p-2 text-text-sub hover:text-primary rounded-lg hover:bg-primary/10 transition-colors" title="Edit">
                            <FaEdit className="text-sm" />
                          </Link>
                          <button
                            onClick={() => handleDelete(p._id)}
                            disabled={deleting === p._id}
                            className="p-2 text-text-sub hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => { setCurrentPage(p); fetchListings(p); }} />
        </>
      )}
    </div>
  );
}
