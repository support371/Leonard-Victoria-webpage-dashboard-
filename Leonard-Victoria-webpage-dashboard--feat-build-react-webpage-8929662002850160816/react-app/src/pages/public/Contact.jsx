import React, { useState } from 'react';
import { CheckCircle, Mail, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', interest: '', message: '' });

  return (
    <div className="pt-14">
      <section className="bg-slate-950 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-4">Get in Touch</p>
          <h1 className="text-5xl font-black text-white mb-6">Start the Conversation</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Whether you're ready to join, have questions, or want to explore a consultation — we'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-white border border-emerald-200 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-slate-900 font-black text-2xl mb-3">Message Received</h2>
                <p className="text-slate-500">Thank you for reaching out. A member of our team will be in contact within 1–2 business days.</p>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="bg-white border border-gray-200 rounded-2xl p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Full Name *</label>
                    <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 text-slate-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-400 placeholder-slate-400"
                      placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Email Address *</label>
                    <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 text-slate-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-400 placeholder-slate-400"
                      placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Area of Interest</label>
                  <select value={form.interest} onChange={e => setForm({...form, interest: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 text-slate-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-400">
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
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Message *</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 text-slate-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-400 placeholder-slate-400 resize-none"
                    placeholder="Tell us about your goals, questions, or how we can serve you..." />
                </div>
                <button type="submit" className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20">
                  Send Message
                </button>
              </form>
            )}
          </div>

          <div className="space-y-5">
            {[
              { icon: Mail, title: 'Email', lines: ['team@iwcommandcenter.com', 'counsel@iwcommandcenter.com'] },
              { icon: Clock, title: 'Response Time', lines: ['Within 1–2 business days', 'Priority for Sovereign members'] },
              { icon: MapPin, title: 'Jurisdiction', lines: ['United States — Nationwide', 'International Inquiries Welcome'] },
            ].map(item => (
              <div key={item.title} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-slate-900 font-bold text-sm">{item.title}</p>
                </div>
                {item.lines.map(l => <p key={l} className="text-slate-500 text-sm">{l}</p>)}
              </div>
            ))}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <p className="text-amber-800 font-bold mb-2 text-sm">Consultation Available</p>
              <p className="text-amber-700 text-sm">Book a complimentary 30-minute alignment call to explore whether our platform is the right fit.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
