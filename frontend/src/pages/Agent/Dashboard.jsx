import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api/axiosInstance';
import StatCard from '../../components/ui/StatCard';
import LeadStatusBadge from '../../components/ui/LeadStatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaBuilding, FaUsers, FaPlus, FaEye, FaEdit } from 'react-icons/fa';
import { formatPrice } from '../../constants';

export default function AgentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/agent/dashboard')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const chartData = data?.leadStatusStats?.map(s => ({
    name: s._id?.replace('_', ' '),
    count: s.count
  })) || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dark">Agent Dashboard</h1>
          <p className="text-text-sub mt-1">Welcome back, {user?.name}</p>
        </div>
        <Link to="/agent/listings/create" className="btn-primary text-sm">
          <FaPlus /> Add Listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard title="Total Listings" value={data?.stats?.totalListings || 0} icon={FaBuilding} color="blue" />
        <StatCard title="Active Listings" value={data?.stats?.activeListings || 0} icon={FaBuilding} color="green" />
        <StatCard title="Total Leads" value={data?.stats?.totalLeads || 0} icon={FaUsers} color="purple" />
        <StatCard title="Open Leads" value={data?.stats?.openLeads || 0} icon={FaUsers} color="orange" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Lead Status Chart */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="font-bold text-text-main mb-5">Lead Status Breakdown</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#8ED600" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-text-sub text-sm">No lead data yet</div>
          )}
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-text-main">Recent Leads</h2>
            <Link to="/agent/leads" className="text-primary text-sm hover:underline">View All</Link>
          </div>
          {data?.recentLeads?.length === 0 ? (
            <div className="text-center py-10 text-text-sub text-sm">No leads yet</div>
          ) : (
            <div className="space-y-3">
              {data?.recentLeads?.map(lead => (
                <Link key={lead._id} to={`/agent/leads/${lead._id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-background transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-main">{lead.name}</p>
                    <p className="text-xs text-text-sub truncate">{lead.property?.title}</p>
                  </div>
                  <LeadStatusBadge status={lead.status} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Properties */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-text-main">My Listings</h2>
          <Link to="/agent/listings" className="text-primary text-sm hover:underline">View All</Link>
        </div>
        {data?.recentProperties?.length === 0 ? (
          <div className="text-center py-10">
            <FaBuilding className="text-4xl text-border mx-auto mb-3" />
            <p className="text-text-sub text-sm mb-4">No listings yet</p>
            <Link to="/agent/listings/create" className="btn-primary text-sm">Add First Listing</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-background">
                  <th className="text-left text-xs font-medium text-text-sub px-4 py-3 rounded-l-lg">Property</th>
                  <th className="text-left text-xs font-medium text-text-sub px-4 py-3">Price</th>
                  <th className="text-left text-xs font-medium text-text-sub px-4 py-3">Type</th>
                  <th className="text-left text-xs font-medium text-text-sub px-4 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-text-sub px-4 py-3 rounded-r-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data?.recentProperties?.map(p => (
                  <tr key={p._id} className="hover:bg-background/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-text-main truncate max-w-[200px]">{p.title}</p>
                      <p className="text-xs text-text-sub">{p.location?.locality}</p>
                    </td>
                    <td className="px-4 py-3 text-primary font-bold text-sm">{formatPrice(p.price, p.priceUnit)}</td>
                    <td className="px-4 py-3 text-sm text-text-sub capitalize">{p.listingType}</td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs font-medium ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link to={`/property/${p._id}`} className="text-text-sub hover:text-primary transition-colors"><FaEye /></Link>
                        <Link to={`/agent/listings/edit/${p._id}`} className="text-text-sub hover:text-primary transition-colors"><FaEdit /></Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
