import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { leadService } from '../../services/lead/leadService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import LeadStatusBadge from '../../components/ui/LeadStatusBadge';
import Pagination from '../../components/ui/Pagination';
import { LEAD_STATUSES } from '../../constants';
import { FaPhone, FaEnvelope, FaCalendarAlt, FaEye } from 'react-icons/fa';

export default function AgentLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchLeads = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (statusFilter) params.status = statusFilter;
      const res = await leadService.getAgentLeads(params);
      setLeads(res.data.leads || []);
      setTotalPages(res.data.pages || 1);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(1); setCurrentPage(1); }, [statusFilter]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark">My Leads</h1>
        <p className="text-text-sub mt-1">{total} total leads</p>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <button
          onClick={() => setStatusFilter('')}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${!statusFilter ? 'bg-primary text-dark border-primary' : 'bg-white text-text-sub border-border hover:border-primary'}`}
        >All</button>
        {LEAD_STATUSES.map(s => (
          <button
            key={s.value}
            onClick={() => setStatusFilter(s.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${statusFilter === s.value ? 'bg-primary text-dark border-primary' : 'bg-white text-text-sub border-border hover:border-primary'}`}
          >{s.label}</button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : leads.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-border">
          <p className="text-5xl mb-4">📋</p>
          <h3 className="text-xl font-semibold text-text-main mb-2">No leads found</h3>
          <p className="text-text-sub">Leads will appear here when users enquire about your properties</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background border-b border-border">
                  <tr>
                    <th className="text-left text-xs font-medium text-text-sub px-5 py-4">Lead</th>
                    <th className="text-left text-xs font-medium text-text-sub px-5 py-4">Property</th>
                    <th className="text-left text-xs font-medium text-text-sub px-5 py-4">Contact</th>
                    <th className="text-left text-xs font-medium text-text-sub px-5 py-4">Status</th>
                    <th className="text-left text-xs font-medium text-text-sub px-5 py-4">Date</th>
                    <th className="text-left text-xs font-medium text-text-sub px-5 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {leads.map(lead => (
                    <tr key={lead._id} className="hover:bg-background/50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-text-main">{lead.name}</p>
                        <p className="text-xs text-text-sub">#{lead._id.slice(-6)}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-text-main truncate max-w-[180px]">{lead.property?.title || 'N/A'}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 text-xs text-text-sub hover:text-primary transition-colors">
                            <FaPhone className="text-primary" /> {lead.phone}
                          </a>
                          <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 text-xs text-text-sub hover:text-primary transition-colors">
                            <FaEnvelope className="text-primary" /> {lead.email}
                          </a>
                        </div>
                      </td>
                      <td className="px-5 py-4"><LeadStatusBadge status={lead.status} /></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 text-xs text-text-sub">
                          <FaCalendarAlt className="text-primary" />
                          {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Link to={`/agent/leads/${lead._id}`} className="flex items-center gap-1.5 text-primary text-sm font-medium hover:underline">
                          <FaEye /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => { setCurrentPage(p); fetchLeads(p); }} />
        </>
      )}
    </div>
  );
}
