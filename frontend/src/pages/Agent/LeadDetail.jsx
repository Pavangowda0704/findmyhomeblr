import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { leadService } from '../../services/lead/leadService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import LeadStatusBadge from '../../components/ui/LeadStatusBadge';
import { LEAD_STATUSES, formatPrice } from '../../constants';
import { FaPhone, FaEnvelope, FaBuilding, FaCalendarAlt, FaPlus, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function LeadDetail() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    leadService.getLead(id)
      .then(res => setLead(res.data.lead))
      .catch(() => toast.error('Failed to load lead'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (status) => {
    setUpdatingStatus(true);
    try {
      const res = await leadService.updateLead(id, { status });
      setLead(prev => ({ ...prev, status: res.data.lead.status }));
      toast.success('Status updated');
    } catch { toast.error('Failed to update status'); }
    finally { setUpdatingStatus(false); }
  };

  const handleAddNote = async () => {
    if (!note.trim()) return;
    setAddingNote(true);
    try {
      const res = await leadService.addNote(id, note);
      setLead(prev => ({ ...prev, notes: res.data.notes }));
      setNote('');
      toast.success('Note added');
    } catch { toast.error('Failed to add note'); }
    finally { setAddingNote(false); }
  };

  if (loading) return <LoadingSpinner />;
  if (!lead) return <div className="text-center py-20 text-text-sub">Lead not found</div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link to="/agent/leads" className="p-2 rounded-lg border border-border hover:bg-background transition-colors">
          <FaArrowLeft className="text-text-sub" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-dark">Lead: {lead.name}</h1>
          <p className="text-text-sub text-sm">#{lead._id}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Card */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="font-bold text-text-main mb-5">Contact Information</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <p className="text-xs text-text-sub mb-1">Full Name</p>
                <p className="font-semibold text-text-main">{lead.name}</p>
              </div>
              <div>
                <p className="text-xs text-text-sub mb-1">Phone</p>
                <a href={`tel:${lead.phone}`} className="font-semibold text-primary flex items-center gap-2 hover:underline">
                  <FaPhone className="text-sm" /> {lead.phone}
                </a>
              </div>
              <div>
                <p className="text-xs text-text-sub mb-1">Email</p>
                <a href={`mailto:${lead.email}`} className="font-semibold text-primary flex items-center gap-2 hover:underline">
                  <FaEnvelope className="text-sm" /> {lead.email}
                </a>
              </div>
              <div>
                <p className="text-xs text-text-sub mb-1">Enquiry Date</p>
                <p className="font-semibold text-text-main flex items-center gap-2">
                  <FaCalendarAlt className="text-primary text-sm" />
                  {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            {lead.message && (
              <div className="mt-5 pt-5 border-t border-border">
                <p className="text-xs text-text-sub mb-2">Message</p>
                <p className="text-text-main text-sm bg-background rounded-lg p-4 leading-relaxed">"{lead.message}"</p>
              </div>
            )}
          </div>

          {/* Property Info */}
          {lead.property && (
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="font-bold text-text-main mb-4">Property Enquired</h2>
              <div className="flex gap-4 items-start">
                <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-background">
                  {lead.property.images?.[0] && (
                    <img src={lead.property.images[0].url} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div>
                  <Link to={`/property/${lead.property._id}`} className="font-semibold text-text-main hover:text-primary transition-colors">
                    {lead.property.title}
                  </Link>
                  {lead.property.price && (
                    <p className="text-primary font-bold mt-1">{formatPrice(lead.property.price)}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="font-bold text-text-main mb-5">Notes & Updates</h2>
            <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
              {lead.notes?.length === 0 ? (
                <p className="text-text-sub text-sm text-center py-6">No notes yet. Add your first note below.</p>
              ) : lead.notes?.map((n, i) => (
                <div key={i} className="bg-background rounded-lg p-4">
                  <p className="text-sm text-text-main">{n.note}</p>
                  <p className="text-xs text-text-sub mt-2">
                    {n.addedBy?.name || 'You'} · {new Date(n.addedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={note}
                onChange={e => setNote(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddNote()}
                placeholder="Add a note..."
                className="input-field flex-1 text-sm"
              />
              <button onClick={handleAddNote} disabled={addingNote || !note.trim()} className="btn-primary text-sm py-2 px-4">
                <FaPlus /> {addingNote ? '...' : 'Add'}
              </button>
            </div>
          </div>
        </div>

        {/* Status Sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="font-bold text-text-main mb-4">Lead Status</h2>
            <div className="mb-4">
              <LeadStatusBadge status={lead.status} />
            </div>
            <div className="space-y-2">
              {LEAD_STATUSES.map(s => (
                <button
                  key={s.value}
                  onClick={() => handleStatusChange(s.value)}
                  disabled={updatingStatus || lead.status === s.value}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all border ${
                    lead.status === s.value
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'border-border text-text-sub hover:border-primary hover:bg-background'
                  } disabled:opacity-50`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="font-bold text-text-main mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a href={`tel:${lead.phone}`} className="w-full btn-primary justify-center py-2.5 text-sm">
                <FaPhone /> Call Now
              </a>
              <a href={`mailto:${lead.email}`} className="w-full btn-outline justify-center py-2.5 text-sm">
                <FaEnvelope /> Send Email
              </a>
              <a href={`https://wa.me/91${lead.phone}`} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
