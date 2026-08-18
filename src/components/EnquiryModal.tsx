import { useState } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';

function EnquiryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/70 px-5 py-8 backdrop-blur-sm" onClick={handleClose}>
      <div className="w-full max-w-lg animate-fade-up rounded-3xl bg-white p-6 shadow-glass sm:p-8 border border-ink-100" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Start your journey</p>
            <h2 className="font-display mt-1 text-2xl font-extrabold text-ink-900">How can we help?</h2>
          </div>
          <button onClick={handleClose} className="rounded-xl p-2 text-brand-500 transition hover:bg-ink-100 hover:text-ink-900" aria-label="Close enquiry form">
            <X size={20} />
          </button>
        </div>
        {submitted ? (
          <div className="my-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-600"><Check size={28} /></div>
            <h3 className="mt-4 text-lg font-extrabold text-ink-900">Enquiry received</h3>
            <p className="mt-2 text-sm leading-6 text-brand-500">Thank you. One of our travel experts will be in touch shortly.</p>
            <button onClick={handleClose} className="mt-6 rounded-xl bg-navy-900 px-5 py-3 text-sm font-bold text-white">Done</button>
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-bold text-ink-600">Your name
                <input required className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-3 py-3 text-sm font-normal text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/15" placeholder="Full name" />
              </label>
              <label className="text-xs font-bold text-ink-600">Phone number
                <input required className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-3 py-3 text-sm font-normal text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/15" placeholder="+974 ..." />
              </label>
            </div>
            <label className="block text-xs font-bold text-ink-600">I&apos;d like help with
              <select className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-3 py-3 text-sm font-normal text-ink-900 outline-none focus:border-brand-400">
                <option>Flight booking</option>
                <option>Visa processing</option>
                <option>Holiday package</option>
                <option>Hotel booking</option>
                <option>Umrah &amp; Hajj</option>
              </select>
            </label>
            <label className="block text-xs font-bold text-ink-600">Tell us a little more
              <textarea rows={3} className="mt-1.5 w-full resize-none rounded-xl border border-ink-200 bg-white px-3 py-3 text-sm font-normal text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/15" placeholder="Where are you hoping to go?" />
            </label>
            <button type="submit" className="btn-primary w-full">
              Send enquiry <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default EnquiryModal;
