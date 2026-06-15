import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaFilter, FaTimes, FaSearch } from 'react-icons/fa';
import { PROPERTY_TYPES, BANGALORE_LOCALITIES, BHK_OPTIONS, AMENITIES } from '../../constants';

const PropertyFilters = ({ onFilter, listingType, initialFilters = {} }) => {
  const [expanded, setExpanded] = useState(false);
  const { register, handleSubmit, reset, watch } = useForm({ defaultValues: initialFilters });

  const onSubmit = (data) => {
    const cleaned = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== '' && v !== undefined));
    if (listingType) cleaned.listingType = listingType;
    onFilter(cleaned);
  };

  const handleReset = () => {
    reset();
    onFilter(listingType ? { listingType } : {});
  };

  return (
    <div className="bg-white rounded-xl border border-border p-5 sticky top-24">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-text-main flex items-center gap-2">
          <FaFilter className="text-primary" /> Filters
        </h3>
        <button onClick={handleReset} className="text-text-sub hover:text-red-500 text-xs flex items-center gap-1 transition-colors">
          <FaTimes /> Clear
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Search */}
        <div>
          <label className="block text-xs font-medium text-text-sub mb-1.5">Search</label>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub text-xs" />
            <input
              {...register('search')}
              type="text"
              placeholder="Search properties..."
              className="input-field pl-8 text-sm py-2.5"
            />
          </div>
        </div>

        {/* Locality */}
        <div>
          <label className="block text-xs font-medium text-text-sub mb-1.5">Locality</label>
          <select {...register('locality')} className="input-field text-sm py-2.5">
            <option value="">All Localities</option>
            {BANGALORE_LOCALITIES.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-xs font-medium text-text-sub mb-1.5">Property Type</label>
          <select {...register('propertyType')} className="input-field text-sm py-2.5">
            <option value="">All Types</option>
            {PROPERTY_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* BHK */}
        <div>
          <label className="block text-xs font-medium text-text-sub mb-2">BHK</label>
          <div className="flex flex-wrap gap-2">
            {BHK_OPTIONS.map(opt => (
              <label key={opt.value} className="cursor-pointer">
                <input type="radio" {...register('bedrooms')} value={opt.value} className="sr-only" />
                <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  watch('bedrooms') == opt.value
                    ? 'bg-primary text-dark border-primary'
                    : 'bg-background text-text-sub border-border hover:border-primary'
                }`}>
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-xs font-medium text-text-sub mb-1.5">Min Price (₹)</label>
          <input {...register('minPrice')} type="number" placeholder="Min Price" className="input-field text-sm py-2.5" />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-sub mb-1.5">Max Price (₹)</label>
          <input {...register('maxPrice')} type="number" placeholder="Max Price" className="input-field text-sm py-2.5" />
        </div>

        {/* More filters toggle */}
        <button type="button" onClick={() => setExpanded(!expanded)} className="text-primary text-xs font-medium">
          {expanded ? '- Less filters' : '+ More filters'}
        </button>

        {expanded && (
          <>
            <div>
              <label className="block text-xs font-medium text-text-sub mb-1.5">Min Area (sqft)</label>
              <input {...register('minArea')} type="number" placeholder="Min Area" className="input-field text-sm py-2.5" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-sub mb-1.5">Bathrooms</label>
              <select {...register('bathrooms')} className="input-field text-sm py-2.5">
                <option value="">Any</option>
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}+</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-sub mb-2">Amenities</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {AMENITIES.slice(0, 8).map(a => (
                  <label key={a.value} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" value={a.value} {...register('amenities')} className="accent-primary" />
                    <span className="text-xs text-text-sub">{a.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        <button type="submit" className="w-full btn-primary justify-center py-3 text-sm">
          Apply Filters
        </button>
      </form>
    </div>
  );
};

export default PropertyFilters;
