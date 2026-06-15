import { useEffect, useState } from 'react';
import { adminService } from '../../services/user/adminService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

const COLORS = ['#8ED600', '#1A2229', '#24303A', '#64748B', '#4ade80', '#f97316', '#a78bfa'];

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getAnalytics()
      .then(res => setAnalytics(res.data.analytics))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const cityData = analytics?.cityStats?.map(s => ({
    name: s._id,
    count: s.count,
    avgPrice: Math.round(s.avgPrice / 100000)
  })) || [];

  const listingTypeData = analytics?.listingTypeStats?.map(s => ({
    name: s._id,
    value: s.count
  })) || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark">Analytics</h1>
        <p className="text-text-sub mt-1">Deep dive into platform performance</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Properties by City */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="font-bold text-text-main mb-5">Properties by City</h2>
          {cityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip formatter={(val, name) => [val, name === 'count' ? 'Properties' : 'Avg Price (L)']} />
                <Bar dataKey="count" fill="#8ED600" radius={[4, 4, 0, 0]} name="count" />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-[300px] flex items-center justify-center text-text-sub text-sm">No data</div>}
        </div>

        {/* Listing Type Distribution */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="font-bold text-text-main mb-5">Listing Type Distribution</h2>
          {listingTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={listingTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {listingTypeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="h-[300px] flex items-center justify-center text-text-sub text-sm">No data</div>}
        </div>
      </div>

      {/* Top Agents */}
      {analytics?.topAgents?.length > 0 && (
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="font-bold text-text-main mb-5">Top Performing Agents</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background">
                <tr>
                  <th className="text-left text-xs font-medium text-text-sub px-4 py-3 rounded-l-lg">Rank</th>
                  <th className="text-left text-xs font-medium text-text-sub px-4 py-3">Agent</th>
                  <th className="text-left text-xs font-medium text-text-sub px-4 py-3">Email</th>
                  <th className="text-left text-xs font-medium text-text-sub px-4 py-3 rounded-r-lg">Total Leads</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {analytics.topAgents.map((agent, i) => (
                  <tr key={i} className="hover:bg-background/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        i === 0 ? 'bg-yellow-100 text-yellow-700' :
                        i === 1 ? 'bg-gray-100 text-gray-600' :
                        i === 2 ? 'bg-orange-100 text-orange-600' :
                        'bg-background text-text-sub'
                      }`}>{i + 1}</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-text-main">{agent.agentInfo?.name}</td>
                    <td className="px-4 py-3 text-sm text-text-sub">{agent.agentInfo?.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-background rounded-full h-2 max-w-[100px]">
                          <div
                            className="h-2 bg-primary rounded-full"
                            style={{ width: `${Math.min(100, (agent.leadCount / analytics.topAgents[0].leadCount) * 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-primary">{agent.leadCount}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Avg Price by City Table */}
      {cityData.length > 0 && (
        <div className="bg-white rounded-xl border border-border p-6 mt-6">
          <h2 className="font-bold text-text-main mb-5">Average Price by City (in Lakhs)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {cityData.map(city => (
              <div key={city.name} className="bg-background rounded-xl p-4 text-center">
                <p className="font-semibold text-text-main text-sm">{city.name}</p>
                <p className="text-2xl font-bold text-primary mt-1">₹{city.avgPrice}L</p>
                <p className="text-xs text-text-sub mt-1">{city.count} properties</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
