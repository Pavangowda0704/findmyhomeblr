import { useEffect, useState } from 'react';
import api from '../../services/api/axiosInstance';
import toast from 'react-hot-toast';
import { FaCheck, FaTimes, FaUser, FaPhone, FaEnvelope, FaBuilding, FaIdCard, FaClock } from 'react-icons/fa';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/agent-applications', { params: { status: filter } });
      setApplications(res.data.applications || []);
    } catch { toast.error('Failed to load applications'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchApplications(); }, [filter]);

  const handleApprove = async (id, name) => {
    if (!window.confirm(`Approve application from ${name}? This will create an agent account.`)) return;
    setActionLoading(id);
    try {
      await api.put(`/agent-applications/${id}/approve`);
      toast.success(`Agent account created for ${name}`);
      setApplications(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve');
    } finally { setActionLoading(null); }
  };

  const handleReject = async () => {
    setActionLoading(rejectModal._id);
    try {
      await api.put(`/agent-applications/${rejectModal._id}/reject`, { reason: rejectReason });
      toast.success('Application rejected');
      setApplications(prev => prev.filter(a => a._id !== rejectModal._id));
      setRejectModal(null);
      setRejectReason('');
    } catch {
      toast.error('Failed to reject');
    } finally { setActionLoading(null); }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark">Agent Applications</h1>
        <p className="text-text-sub mt-1">Review and manage agent onboarding requests</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {['pending', 'approved', 'rejected'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors capitalize ${filter === s ? 'bg-primary text-dark border-primary' : 'bg-white text-text-sub border-border hover:border-primary'}`}>
            {s}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : applications.length === 0 ? (
        <div className="text-center py-16 text-text-sub bg-white rounded-xl border border-border">
          <FaUser className="text-4xl mx-auto mb-3 text-border" />
          <p>No {filter} applications</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map(app => (
            <div key={app._id} className="bg-white rounded-xl border border-border p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FaUser className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-dark">{app.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : app.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {app.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-text-sub">
                      <FaEnvelope className="text-primary flex-shrink-0" />{app.email}
                    </div>
                    <div className="flex items-center gap-2 text-text-sub">
                      <FaPhone className="text-primary flex-shrink-0" />{app.phone}
                    </div>
                    <div className="flex items-center gap-2 text-text-sub">
                      <FaBuilding className="text-primary flex-shrink-0" />{app.agencyName}
                    </div>
                    <div className="flex items-center gap-2 text-text-sub">
                      <FaIdCard className="text-primary flex-shrink-0" />{app.reraNumber}
                    </div>
                    <div className="flex items-center gap-2 text-text-sub">
                      <FaClock className="text-primary flex-shrink-0" />{app.experience}
                    </div>
                  </div>

                  {app.localities?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {app.localities.map(l => (
                        <span key={l} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">{l}</span>
                      ))}
                    </div>
                  )}

                  {app.about && (
                    <p className="mt-3 text-sm text-text-sub bg-background rounded-lg p-3">{app.about}</p>
                  )}

                  {app.rejectionReason && (
                    <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg p-3">
                      <strong>Rejection reason:</strong> {app.rejectionReason}
                    </p>
                  )}

                  <p className="text-xs text-text-sub mt-3">
                    Applied: {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                {app.status === 'pending' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleApprove(app._id, app.name)}
                      disabled={actionLoading === app._id}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      <FaCheck /> Approve
                    </button>
                    <button
                      onClick={() => setRejectModal(app)}
                      disabled={actionLoading === app._id}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      <FaTimes /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="font-bold text-dark text-lg mb-2">Reject Application</h3>
            <p className="text-text-sub text-sm mb-4">Provide a reason for rejecting <strong>{rejectModal.name}</strong>'s application.</p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Reason for rejection (optional)..."
              rows={3}
              className="input-field resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => { setRejectModal(null); setRejectReason(''); }}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-text-sub hover:bg-background transition-colors">
                Cancel
              </button>
              <button onClick={handleReject} disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50">
                {actionLoading ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}