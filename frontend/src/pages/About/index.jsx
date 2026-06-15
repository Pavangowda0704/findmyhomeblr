import { FaUsers, FaHome, FaHandshake, FaMapMarkerAlt, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const TEAM = [
  { name: 'Arjun Mehta', role: 'Founder & CEO', initials: 'AM', bio: '15+ years in Bangalore real estate.' },
  { name: 'Shreya Rao', role: 'Head of Operations', initials: 'SR', bio: 'Ex-property consultant with 200+ deals closed.' },
  { name: 'Kiran Patel', role: 'Technology Lead', initials: 'KP', bio: 'Built platforms serving millions of users.' },
  { name: 'Meena Nair', role: 'Customer Success', initials: 'MN', bio: 'Dedicated to making every client happy.' }
];

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-dark py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-4">About <span className="text-primary">Find My Home BLR</span></h1>
          <p className="text-white/70 text-lg leading-relaxed">
            We are Bangalore's most trusted real estate platform, connecting home seekers with verified listings and expert agents since 2018.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-dark mb-5">Our Mission</h2>
              <p className="text-text-sub leading-relaxed mb-4">
                At Find My Home BLR, we believe finding your dream home should be exciting, not stressful. We've built a platform that combines technology with human expertise to make property discovery seamless.
              </p>
              <p className="text-text-sub leading-relaxed mb-6">
                Every listing on our platform is verified. Every agent is certified. Every transaction is supported end-to-end.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: FaHome, label: '5,000+ Properties' },
                  { icon: FaUsers, label: '12,000+ Customers' },
                  { icon: FaHandshake, label: '350+ Agents' },
                  { icon: FaMapMarkerAlt, label: '25+ Localities' }
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-xl p-4 border border-border flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <s.icon className="text-primary" />
                    </div>
                    <span className="font-semibold text-text-main text-sm">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-border">
              <h3 className="font-bold text-text-main text-xl mb-6">Our Values</h3>
              {[
                { title: 'Transparency', desc: 'No hidden costs, no fake listings. What you see is what you get.' },
                { title: 'Trust', desc: 'Every property and agent is verified before going live.' },
                { title: 'Technology', desc: 'Cutting-edge tools to power your property search.' },
                { title: 'Service', desc: 'Dedicated support at every step of your journey.' }
              ].map(v => (
                <div key={v.title} className="flex gap-4 mb-5 last:mb-0">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-dark font-bold text-sm flex-shrink-0">✓</div>
                  <div>
                    <p className="font-semibold text-text-main">{v.title}</p>
                    <p className="text-text-sub text-sm">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Meet Our Team</h2>
            <p className="section-subtitle">The people making your property search easier</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map(member => (
              <div key={member.name} className="bg-background rounded-xl p-6 text-center border border-border hover:shadow-md transition-all">
                <div className="w-16 h-16 rounded-full bg-dark flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {member.initials}
                </div>
                <h3 className="font-bold text-text-main">{member.name}</h3>
                <p className="text-primary text-sm font-medium mb-2">{member.role}</p>
                <p className="text-text-sub text-xs">{member.bio}</p>
                <div className="flex justify-center gap-3 mt-4">
                  <a href="#" className="text-text-sub hover:text-primary transition-colors"><FaLinkedin /></a>
                  <a href="#" className="text-text-sub hover:text-primary transition-colors"><FaEnvelope /></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
