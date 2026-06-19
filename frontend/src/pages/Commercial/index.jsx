import { useState, useEffect, useCallback } from 'react';
import PropertyCard from '../../components/property/PropertyCard';
import PropertyFilters from '../../components/property/PropertyFilters';
import Pagination from '../../components/ui/Pagination';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { propertyService } from '../../services/property/propertyService';
import { userService } from '../../services/user/userService';
import toast from 'react-hot-toast';
import { FaBalanceScale } from 'react-icons/fa';
import { FaThLarge, FaList, FaSortAmountDown } from 'react-icons/fa';

export default function Commercial() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [sort, setSort] = useState('-createdAt');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({});
  const [compareList, setCompareList] = useState([]);

  const fetchProperties = useCallback(async (filterParams = {}, page = 1) => {
    setLoading(true);
    try {
      const res = await propertyService.getProperties({ listingType: 'commercial', ...filterParams, sort, page, limit: 12 });
      setProperties(res.data.properties);
      setTotalPages(res.data.pages);
      setTotal(res.data.total);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [sort]);

  useEffect(() => { fetchProperties(filters, 1); setCurrentPage(1); }, [sort]);

  const handleFilter = (f) => { setFilters(f); setCurrentPage(1); fetchProperties(f, 1); };
  const handlePageChange = (p) => { setCurrentPage(p); fetchProperties(filters, p); window.scrollTo({ top: 0 }); };

  const handleCompare = async (property) => {
    if (compareList.length >= 4 && !compareList.includes(property._id)) {
      toast.error('You can compare up to 4 properties only');
      return;
    }
    try {
      await userService.toggleCompare(property._id);
      setCompareList(prev =>
        prev.includes(property._id)
          ? prev.filter(id => id !== property._id)
          : [...prev, property._id]
      );
      toast.success(compareList.includes(property._id) ? 'Removed from compare' : 'Added to compare');
    } catch {
      toast.error('Please login to compare properties');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark">Commercial Properties in Bangalore</h1>
        <p className="text-text-sub mt-1">{total} commercial spaces available</p>
      </div>
      <div className="flex gap-8">
        <div className="w-72 flex-shrink-0 hidden lg:block">
          <PropertyFilters onFilter={handleFilter} listingType="commercial" initialFilters={filters} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5 bg-white rounded-xl border border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <button onClick={() => setView('grid')} className={`p-2 rounded-lg ${view === 'grid' ? 'bg-primary text-dark' : 'text-text-sub hover:bg-background'}`}><FaThLarge /></button>
              <button onClick={() => setView('list')} className={`p-2 rounded-lg ${view === 'list' ? 'bg-primary text-dark' : 'text-text-sub hover:bg-background'}`}><FaList /></button>
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)} className="text-sm border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="-createdAt">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
            </select>
          </div>
          {loading ? <LoadingSpinner /> : properties.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-border">
              <p className="text-5xl mb-4">🏢</p>
              <h3 className="text-xl font-semibold mb-2">No commercial properties found</h3>
              <p className="text-text-sub">Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5' : 'flex flex-col gap-4'}>
                {properties.map(p => <PropertyCard key={p._id} property={p} />)}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
          )}
        </div>
      </div>
      {/* Compare floating bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-dark text-white rounded-2xl shadow-2xl px-6 py-3 flex items-center gap-4">
          <FaBalanceScale className="text-primary text-lg" />
          <span className="text-sm font-medium">{compareList.length} {compareList.length === 1 ? 'property' : 'properties'} selected</span>
          <a href="/compare" className="bg-primary text-dark text-sm font-bold px-4 py-1.5 rounded-lg hover:bg-primary-dark transition-colors">Compare Now</a>
          <button onClick={() => setCompareList([])} className="text-white/60 hover:text-white text-sm transition-colors">Clear</button>
        </div>
      )}
    </div>
  );
}