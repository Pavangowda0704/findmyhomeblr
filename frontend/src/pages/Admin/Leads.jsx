import { useEffect, useState } from 'react';
import { leadService } from '../../services/lead/leadService';
import { adminService } from '../../services/user/adminService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import LeadStatusBadge from '../../components/ui/LeadStatusBadge';
import Pagination from '../../components/ui/Pagination';
import { LEAD_STATUSES } from '../../constants';
import { FaPhone, FaEnvelope, FaUserCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../services/api/axiosInstance';

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchLeads = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      const res = await leadService.getLeads(params);
      setLeads(res.data.leads || []);
      setTotalPages(res.data.pages || 1);
      setTotal(res.data.total || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchLeads(1);
    // Fetch agents list
    adminService.getUsers({ role: 'agent', limit: 100 })
      .then(res => setAgents(res.data.users || []))
      .catch(console.error);
  }, [statusFilter]);

  const handleAssign = async (leadId, agentId) => {
    try {
      await leadService.assignLead(leadId, agentId);
      setLeads(prev => prev.map(l => {
        if (l._id === leadId) {
          const agent = agents.find(a => a._id === agentId);
          return { ...l, agent };
        }
        return l;
      }));
      toast.success('Lead assigned');
    } catch { toast.error('Failed to assign lead'); }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark">Lead Management</h1>
        <p className="text-text-sub mt-1">{total} total leads</p>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        <button onClick={() => setStatusFilter('')} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${!statusFilter ? 'bg-primary text-dark border-primary' : 'bg-white text-text-sub border-border hover:border-primary'}`}>All</button>
        {LEAD_STATUSES.map(s => (
          <button key={s.value} onClick={() => setStatusFilter(s.value)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${statusFilter === s.value ? 'bg-primary text-dark border-primary' : 'bg-white text-text-sub border-border hover:border-primary'}`}>{s.label}</button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : (
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
                    <th className="text-left text-xs font-medium text-text-sub px-5 py-4">Assigned Agent</th>
                    <th className="text-left text-xs font-medium text-text-sub px-5 py-4">Date</th>
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
                        <p className="text-sm text-text-main truncate max-w-[140px]">{lead.property?.title || '—'}</p>
                      </td>
                      <td className="px-5 py-4">
                        <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 text-xs text-text-sub hover:text-primary mb-1 transition-colors"><FaPhone className="text-primary" /> {lead.phone}</a>
                        <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 text-xs text-text-sub hover:text-primary transition-colors"><FaEnvelope className="text-primary" /> {lead.email}</a>
                      </td>
                      <td className="px-5 py-4"><LeadStatusBadge status={lead.status} /></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            defaultValue={lead.agent?._id || ''}
                            onChange={e => e.target.value && handleAssign(lead._id, e.target.value)}
                            className="text-xs border border-border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary max-w-[140px]"
                          >
                            <option value="">Unassigned</option>
                            {agents.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                          </select>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-text-sub whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={p => { setCurrentPage(p); fetchLeads(p); }} />
        </>
      )}
    </div>
  );
}
