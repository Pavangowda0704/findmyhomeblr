import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/user/adminService';
import StatCard from '../../components/ui/StatCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import LeadStatusBadge from '../../components/ui/LeadStatusBadge';
import { formatPrice } from '../../constants';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend,
  LineChart, Line
} from 'recharts';
import { FaUsers, FaBuilding, FaEnvelope, FaCheckCircle } from 'react-icons/fa';

const COLORS = ['#8ED600', '#1A2229', '#24303A', '#64748B', '#E2E8F0', '#111827', '#4ade80'];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard()
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const pieData = data?.charts?.propertyTypeStats?.map(s => ({
    name: s._id?.replace('_', ' '),
    value: s.count
  })) || [];

  const leadStatusData = data?.charts?.leadStatusStats?.map(s => ({
    name: s._id?.replace('_', ' '),
    value: s.count
  })) || [];

  const monthlyData = data?.charts?.monthlyLeads?.map(s => ({
    name: `${s._id.month}/${s._id.year}`,
    leads: s.count
  })) || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark">Admin Dashboard</h1>
        <p className="text-text-sub mt-1">Platform overview and analytics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard title="Total Users" value={data?.stats?.totalUsers || 0} icon={FaUsers} color="blue" />
        <StatCard title="Total Agents" value={data?.stats?.totalAgents || 0} icon={FaUsers} color="purple" />
        <StatCard title="Properties" value={data?.stats?.totalProperties || 0} icon={FaBuilding} color="green" />
        <StatCard title="Total Leads" value={data?.stats?.totalLeads || 0} icon={FaEnvelope} color="orange" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard title="Active Listings" value={data?.stats?.activeProperties || 0} icon={FaCheckCircle} color="green" />
        <StatCard title="Leads This Month" value={data?.stats?.newLeadsThisMonth || 0} icon={FaEnvelope} color="blue" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Leads */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="font-bold text-text-main mb-5">Monthly Leads (Last 6 months)</h2>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="leads" stroke="#8ED600" strokeWidth={2} dot={{ fill: '#8ED600' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <div className="h-[250px] flex items-center justify-center text-text-sub text-sm">No data available</div>}
        </div>

        {/* Property Types */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="font-bold text-text-main mb-5">Property Types Distribution</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="h-[250px] flex items-center justify-center text-text-sub text-sm">No data available</div>}
        </div>
      </div>

      {/* Lead Status Bar Chart */}
      <div className="bg-white rounded-xl border border-border p-6 mb-6">
        <h2 className="font-bold text-text-main mb-5">Lead Status Overview</h2>
        {leadStatusData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={leadStatusData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
              <Tooltip />
              <Bar dataKey="value" fill="#8ED600" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <div className="h-[200px] flex items-center justify-center text-text-sub text-sm">No data available</div>}
      </div>

      {/* Recent Data */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-text-main">Recent Properties</h2>
            <Link to="/admin/properties" className="text-primary text-sm hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {data?.recent?.properties?.map(p => (
              <div key={p._id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-main truncate">{p.title}</p>
                  <p className="text-xs text-text-sub">{p.agent?.name}</p>
                </div>
                <span className={`badge text-xs ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-text-main">Recent Leads</h2>
            <Link to="/admin/leads" className="text-primary text-sm hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {data?.recent?.leads?.map(lead => (
              <div key={lead._id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-main">{lead.name}</p>
                  <p className="text-xs text-text-sub truncate">{lead.property?.title}</p>
                </div>
                <LeadStatusBadge status={lead.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
