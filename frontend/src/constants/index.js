export const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'independent_house', label: 'Independent House' },
  { value: 'plot', label: 'Plot' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'pg', label: 'PG / Co-living' },
  { value: 'studio', label: 'Studio' }
];

export const LISTING_TYPES = [
  { value: 'buy', label: 'Buy' },
  { value: 'rent', label: 'Rent' },
  { value: 'commercial', label: 'Commercial' }
];

export const BHK_OPTIONS = [
  { value: 1, label: '1 BHK' },
  { value: 2, label: '2 BHK' },
  { value: 3, label: '3 BHK' },
  { value: 4, label: '4 BHK' },
  { value: 5, label: '5+ BHK' }
];

export const BANGALORE_LOCALITIES = [
  'Whitefield', 'Koramangala', 'Indiranagar', 'HSR Layout', 'Electronic City',
  'Marathahalli', 'Jayanagar', 'JP Nagar', 'Bannerghatta Road', 'Sarjapur Road',
  'Hebbal', 'Yelahanka', 'Banashankari', 'Rajajinagar', 'Malleshwaram',
  'Vijayanagar', 'KR Puram', 'Mahadevapura', 'Bellandur', 'Kadugodi',
  'Domlur', 'BTM Layout', 'Bommanahalli', 'CV Raman Nagar', 'RT Nagar'
];

export const AMENITIES = [
  { value: 'parking', label: 'Parking', icon: 'FaCar' },
  { value: 'gym', label: 'Gym', icon: 'FaDumbbell' },
  { value: 'swimming_pool', label: 'Swimming Pool', icon: 'FaSwimmingPool' },
  { value: 'security', label: '24/7 Security', icon: 'FaShieldAlt' },
  { value: 'lift', label: 'Lift', icon: 'FaArrowUp' },
  { value: 'power_backup', label: 'Power Backup', icon: 'FaBolt' },
  { value: 'clubhouse', label: 'Clubhouse', icon: 'FaBuilding' },
  { value: 'garden', label: 'Garden', icon: 'FaLeaf' },
  { value: 'wifi', label: 'Wi-Fi', icon: 'FaWifi' },
  { value: 'ac', label: 'Air Conditioning', icon: 'FaSnowflake' },
  { value: 'furnished', label: 'Fully Furnished', icon: 'FaCouch' },
  { value: 'semi_furnished', label: 'Semi Furnished', icon: 'FaCouch' },
  { value: 'cctv', label: 'CCTV', icon: 'FaCamera' },
  { value: 'water_supply', label: '24/7 Water', icon: 'FaTint' },
  { value: 'gas_pipeline', label: 'Gas Pipeline', icon: 'FaFire' },
  { value: 'visitor_parking', label: 'Visitor Parking', icon: 'FaParking' },
  { value: 'fire_safety', label: 'Fire Safety', icon: 'FaFireExtinguisher' },
  { value: 'rainwater_harvesting', label: 'Rainwater Harvesting', icon: 'FaCloudRain' }
];

export const LEAD_STATUSES = [
  { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-800' },
  { value: 'contacted', label: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'interested', label: 'Interested', color: 'bg-purple-100 text-purple-800' },
  { value: 'site_visit', label: 'Site Visit', color: 'bg-orange-100 text-orange-800' },
  { value: 'negotiation', label: 'Negotiation', color: 'bg-pink-100 text-pink-800' },
  { value: 'closed', label: 'Closed', color: 'bg-green-100 text-green-800' },
  { value: 'lost', label: 'Lost', color: 'bg-red-100 text-red-800' }
];

export const BUDGET_RANGES_BUY = [
  { label: 'Under 30 Lakh', min: 0, max: 3000000 },
  { label: '30L - 50L', min: 3000000, max: 5000000 },
  { label: '50L - 80L', min: 5000000, max: 8000000 },
  { label: '80L - 1 Cr', min: 8000000, max: 10000000 },
  { label: '1Cr - 1.5Cr', min: 10000000, max: 15000000 },
  { label: '1.5Cr - 2Cr', min: 15000000, max: 20000000 },
  { label: 'Above 2 Cr', min: 20000000, max: 999999999 }
];

export const BUDGET_RANGES_RENT = [
  { label: 'Under ₹10,000', min: 0, max: 10000 },
  { label: '10k - 20k', min: 10000, max: 20000 },
  { label: '20k - 35k', min: 20000, max: 35000 },
  { label: '35k - 50k', min: 35000, max: 50000 },
  { label: '50k - 75k', min: 50000, max: 75000 },
  { label: 'Above 75k', min: 75000, max: 999999 }
];

export const formatPrice = (price, unit = 'total') => {
  if (!price) return 'Price on Request';
  if (unit === 'per_month') return `₹${formatNumber(price)}/mo`;
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${formatNumber(price)}`;
};

export const formatNumber = (num) => {
  if (!num) return '0';
  return num.toLocaleString('en-IN');
};
