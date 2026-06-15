import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../../services/property/propertyService';
import { adminService } from '../../services/user/adminService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Pagination from '../../components/ui/Pagination';
import { formatPrice } from '../../constants';
import { FaSearch, FaCheckCircle, FaStar, FaTrash, FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [listingType, setListingType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchProperties = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 15, status: '' };
      if (search) params.search = search;
      if (listingType) params.listingType = listingType;
      const res = await propertyService.getProperties(params);
      setProperties(res.data.properties || []);
      setTotalPages(res.data.pages || 1);
      setTotal(res.data.total || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProperties(1); setCurrentPage(1); }, [search, listingType]);

  const handleVerify = async (id, verified) => {
    try {
      await adminService.verifyProperty(id, !verified);
      setProperties(prev => prev.map(p => p._id === id ? { ...p, verified: !verified } : p));
      toast.success(verified ? 'Verification removed' : 'Property verified');
    } catch { toast.error('Failed to update'); }
  };

  const handleFeature = async (id, featured) => {
    try {
      await adminService.featureProperty(id, !featured);
      setProperties(prev => prev.map(p => p._id === id ? { ...p, featured: !featured } : p));
      toast.success(featured ? 'Removed from featured' : 'Added to featured');
    } catch { toast.error('Failed to update'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    try {
      await propertyService.deleteProperty(id);
      setProperties(prev => prev.filter(p => p._id !== id));
      toast.success('Property deleted');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark">Property Management</h1>
        <p className="text-text-sub mt-1">{total} total properties</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub text-sm" />
          <input
            type="text" placeholder="Search properties..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 text-sm"
          />
        </div>
        <div className="flex gap-2">
          {['', 'buy', 'rent', 'commercial'].map(t => (
            <button key={t} onClick={() => setListingType(t)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${listingType === t ? 'bg-primary text-dark border-primary' : 'bg-white text-text-sub border-border hover:border-primary'}`}>
              {t ? t.charAt(0).toUpperCase() + t.slice(1) : 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background border-b border-border">
                  <tr>
                    <th className="text-left text-xs font-medium text-text-sub px-5 py-4">Property</th>
                    <th className="text-left text-xs font-medium text-text-sub px-5 py-4">Agent</th>
                    <th className="text-left text-xs font-medium text-text-sub px-5 py-4">Price</th>
                    <th className="text-left text-xs font-medium text-text-sub px-5 py-4">Type</th>
                    <th className="text-left text-xs font-medium text-text-sub px-5 py-4">Status</th>
                    <th className="text-left text-xs font-medium text-text-sub px-5 py-4">Flags</th>
                    <th className="text-left text-xs font-medium text-text-sub px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {properties.map(p => (
                    <tr key={p._id} className="hover:bg-background/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0]?.url || 'https://via.placeholder.com/40x30'}
                            alt="" className="w-12 h-9 rounded-lg object-cover flex-shrink-0"
                            onError={e => { e.target.src = 'https://via.placeholder.com/40x30'; }}
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-text-main truncate max-w-[150px]">{p.title}</p>
                            <p className="text-xs text-text-sub">{p.location?.locality}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-text-sub">{p.agent?.name || '—'}</td>
                      <td className="px-5 py-4 text-primary font-bold text-sm whitespace-nowrap">{formatPrice(p.price, p.priceUnit)}</td>
                      <td className="px-5 py-4">
                        <span className={`badge text-xs ${p.listingType === 'buy' ? 'bg-blue-100 text-blue-700' : p.listingType === 'rent' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>{p.listingType}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge text-xs ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{p.status}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleVerify(p._id, p.verified)}
                            title={p.verified ? 'Remove Verification' : 'Verify'}
                            className={`p-1.5 rounded-lg transition-colors ${p.verified ? 'bg-green-100 text-green-600' : 'text-text-sub hover:bg-green-50 hover:text-green-600'}`}
                          ><FaCheckCircle className="text-sm" /></button>
                          <button
                            onClick={() => handleFeature(p._id, p.featured)}
                            title={p.featured ? 'Remove Featured' : 'Feature'}
                            className={`p-1.5 rounded-lg transition-colors ${p.featured ? 'bg-yellow-100 text-yellow-600' : 'text-text-sub hover:bg-yellow-50 hover:text-yellow-600'}`}
                          ><FaStar className="text-sm" /></button>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <Link to={`/property/${p._id}`} className="p-2 text-text-sub hover:text-primary rounded-lg hover:bg-primary/10 transition-colors"><FaEye className="text-sm" /></Link>
                          <button onClick={() => handleDelete(p._id)} className="p-2 text-text-sub hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"><FaTrash className="text-sm" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={p => { setCurrentPage(p); fetchProperties(p); }} />
        </>
      )}
    </div>
  );
}
