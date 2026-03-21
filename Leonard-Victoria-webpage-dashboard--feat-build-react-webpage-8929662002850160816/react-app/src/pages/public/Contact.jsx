import React, { useState } from 'react';
import { CheckCircle, Mail, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', interest: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-24 min-h-screen">
      <section className="py-20 px-6 border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-4">Get in Touch</p>
          <h1 className="text-5xl font-black text-white mb-6">Start the Conversation</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Whether you're ready to join, have questions, or want to explore a consultation — we'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-slate-900/60 border border-emerald-500/30 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-white font-black text-2xl mb-3">Message Received</h2>
                <p className="text-slate-400">Thank you for reaching out. A member of our team will be in contact within 1–2 business days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
                    <input
                      required
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 placeholder-slate-500"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email Address *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 placeholder-slate-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Area of Interest</label>
                  <select
                    value={form.interest}
                    onChange={e => setForm({...form, interest: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Select an area...</option>
                    <option>Join Membership</option>
                    <option>Book a Consultation</option>
                    <option>Energy Healing Services</option>
                    <option>Wellness Education</option>
                    <option>Strategic Wealth Consulting</option>
                    <option>Community & Events</option>
                    <option>Partnership Inquiry</option>
                    <option>General Question</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 placeholder-slate-500 resize-none"
                    placeholder="Tell us about your goals, questions, or how we can serve you..."
                  />
                </div>
                <button type="submit" className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/25">
                  Send Message
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            {[
              { icon: Mail, title: 'Email', lines: ['team@iwcommandcenter.com', 'counsel@iwcommandcenter.com'] },
              { icon: Clock, title: 'Response Time', lines: ['Within 1–2 business days', 'Priority for Sovereign members'] },
              { icon: MapPin, title: 'Jurisdiction', lines: ['United States — Nationwide', 'International Inquiries Welcome'] },
            ].map(item => (
              <div key={item.title} className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-white font-bold text-sm">{item.title}</p>
                </div>
                {item.lines.map(l => <p key={l} className="text-slate-400 text-sm">{l}</p>)}
              </div>
            ))}

            <div className="bg-gradient-to-br from-amber-500/10 to-yellow-600/5 border border-amber-500/20 rounded-xl p-6">
              <p className="text-amber-300 font-bold mb-2">Consultation Available</p>
              <p className="text-slate-400 text-sm">Book a complimentary 30-minute alignment call to explore whether our platform is the right fit for your goals.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
