import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../../components/property/PropertyCard';
import PropertyFilters from '../../components/property/PropertyFilters';
import Pagination from '../../components/ui/Pagination';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { propertyService } from '../../services/property/propertyService';
import { FaThLarge, FaList, FaSortAmountDown } from 'react-icons/fa';

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-views', label: 'Most Viewed' }
];

export default function Buy() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [sort, setSort] = useState('-createdAt');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({});

  const fetchProperties = useCallback(async (filterParams = {}, page = 1) => {
    setLoading(true);
    try {
      const params = { listingType: 'buy', ...filterParams, sort, page, limit: 12 };
      // Apply URL search params
      if (searchParams.get('locality')) params.locality = searchParams.get('locality');
      if (searchParams.get('propertyType')) params.propertyType = searchParams.get('propertyType');
      if (searchParams.get('minPrice')) params.minPrice = searchParams.get('minPrice');
      if (searchParams.get('maxPrice')) params.maxPrice = searchParams.get('maxPrice');

      const res = await propertyService.getProperties(params);
      setProperties(res.data.properties);
      setTotalPages(res.data.pages);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [sort, searchParams]);

  useEffect(() => {
    fetchProperties(filters, 1);
    setCurrentPage(1);
  }, [sort, searchParams]);

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    fetchProperties(newFilters, 1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchProperties(filters, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark">Properties for Sale in Bangalore</h1>
        <p className="text-text-sub mt-1">{total} properties found</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <div className="w-72 flex-shrink-0 hidden lg:block">
          <PropertyFilters onFilter={handleFilter} listingType="buy" initialFilters={filters} />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-5 bg-white rounded-xl border border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-primary text-dark' : 'text-text-sub hover:bg-background'}`}
              ><FaThLarge /></button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-primary text-dark' : 'text-text-sub hover:bg-background'}`}
              ><FaList /></button>
            </div>

            <div className="flex items-center gap-2">
              <FaSortAmountDown className="text-text-sub text-sm" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-sm border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : properties.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-border">
              <p className="text-5xl mb-4">🏠</p>
              <h3 className="text-xl font-semibold text-text-main mb-2">No properties found</h3>
              <p className="text-text-sub">Try adjusting your filters or search in a different area.</p>
            </div>
          ) : (
            <>
              <div className={view === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                : 'flex flex-col gap-4'
              }>
                {properties.map(property => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
