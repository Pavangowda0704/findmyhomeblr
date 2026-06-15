import { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="section-title">Get In Touch</h1>
        <p className="section-subtitle">Our team is here to help you with your property journey</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Info */}
        <div className="space-y-6">
          {[
            { icon: FaPhone, title: 'Phone', info: '+91 800 123 4567', sub: 'Mon-Sat 9AM to 7PM', href: 'tel:+918001234567' },
            { icon: FaEnvelope, title: 'Email', info: 'hello@findmyhomeblr.com', sub: 'We reply within 24 hours', href: 'mailto:hello@findmyhomeblr.com' },
            { icon: FaMapMarkerAlt, title: 'Office', info: '123 MG Road, Bangalore', sub: 'Karnataka - 560001', href: '#' },
            { icon: FaClock, title: 'Working Hours', info: 'Mon - Saturday', sub: '9:00 AM - 7:00 PM', href: null }
          ].map(item => (
            <div key={item.title} className="bg-white rounded-xl border border-border p-5 flex gap-4 items-start">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <item.icon className="text-primary text-xl" />
              </div>
              <div>
                <p className="font-semibold text-text-main">{item.title}</p>
                {item.href ? (
                  <a href={item.href} className="text-text-sub text-sm hover:text-primary transition-colors">{item.info}</a>
                ) : (
                  <p className="text-text-sub text-sm">{item.info}</p>
                )}
                <p className="text-text-sub text-xs mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-border p-8">
            <h2 className="text-xl font-bold text-text-main mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Your Name *</label>
                  <input
                    type="text" required value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Full name" className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Email *</label>
                  <input
                    type="email" required value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com" className="input-field"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Phone</label>
                  <input
                    type="tel" value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="Mobile number" className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Subject *</label>
                  <select
                    required value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select subject</option>
                    <option>Property Enquiry</option>
                    <option>Agent Registration</option>
                    <option>Technical Support</option>
                    <option>Partnership</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Message *</label>
                <textarea
                  required rows={5} value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us how we can help you..."
                  className="input-field resize-none"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary py-3 px-8">
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
