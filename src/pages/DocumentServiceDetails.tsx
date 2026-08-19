import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  Clock,
  ChevronDown,
  ArrowRight,
  Send,
  MessageCircle,
  CheckCircle2,
  X,
} from 'lucide-react';
import { getAttestationService, attestationServices } from '@/data/documentServices';
import { supabase } from '@/lib/supabase';

const WHATSAPP_URL = 'https://wa.me/97466486076';

export default function DocumentServiceDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const service = slug ? getAttestationService(slug) : undefined;

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    country: '',
    message: '',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!service) {
    return (
      <section className="container-x max-w-3xl py-24 text-center">
        <h1 className="font-display text-3xl font-extrabold text-ink-900">Service not found</h1>
        <p className="mt-3 text-ink-500">The attestation service you are looking for does not exist.</p>
        <button onClick={() => navigate('/services/documents')} className="btn-primary mt-6">
          Back to all services
        </button>
      </section>
    );
  }

  const Icon = service.icon;

  return (
    <>
      {/* Header */}
      <section className="relative isolate overflow-hidden bg-navy-900 py-12 sm:py-16">
        <div className="absolute inset-0 -z-10 bg-mesh-pop opacity-60" />
        <div className="container-x max-w-7xl">
          <button
            onClick={() => navigate('/services/documents')}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white"
          >
            <ArrowLeft size={16} /> All Document Attestation Services
          </button>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#25D366]/20 text-[#25D366]">
              <Icon size={28} />
            </div>
            <div>
              <span className="eyebrow">Document Attestation</span>
              <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {service.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x max-w-7xl py-12">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          {/* Left Column */}
          <div className="space-y-10">
            {/* Overview */}
            <div>
              <h2 className="section-title text-2xl">Service Overview</h2>
              <p className="mt-4 text-sm leading-7 text-ink-600 sm:text-base">{service.overview}</p>
            </div>

            {/* Workflow Timeline */}
            <div>
              <h2 className="section-title text-2xl">Attestation Workflow</h2>
              <p className="mt-2 text-sm text-ink-500">
                Track how your documents move through each stage of legalization.
              </p>
              <div className="mt-6 space-y-0">
                {service.workflow.map((step, idx) => (
                  <div key={step} className="relative flex gap-4 pb-8 last:pb-0">
                    {idx !== service.workflow.length - 1 && (
                      <span className="absolute left-[15px] top-9 h-full w-0.5 bg-gradient-to-b from-[#25D366] to-[#25D366]/30" />
                    )}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-sm font-bold text-white shadow-glow-sm">
                      {idx + 1}
                    </div>
                    <div className="pt-0.5">
                      <p className="font-display text-base font-extrabold text-ink-900">{step}</p>
                      {idx !== service.workflow.length - 1 && (
                        <p className="mt-0.5 text-xs text-ink-400">Then forwarded to the next authority</p>
                      )}
                      {idx === service.workflow.length - 1 && (
                        <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-[#25D366]">
                          <CheckCircle2 size={13} /> Final legalization stage
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-ink-50 px-3 py-2 text-xs font-bold text-ink-700">
                <Clock size={14} className="text-[#25D366]" />
                Estimated Processing Time: {service.processingTime}
              </div>
            </div>

            {/* Required Documents Checklist */}
            <div>
              <h2 className="section-title text-2xl">Required Documents</h2>
              <p className="mt-2 text-sm text-ink-500">Keep these ready before we begin your application.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {service.requiredDocuments.map((doc) => (
                  <label
                    key={doc}
                    className="group flex cursor-pointer items-start gap-3 rounded-2xl border border-ink-100 bg-white p-4 shadow-soft transition hover:border-[#25D366]/40"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-[#25D366] bg-white text-[#25D366] transition group-hover:bg-[#25D366]/10">
                      <Check size={13} strokeWidth={3} />
                    </span>
                    <span className="text-sm font-medium text-ink-800">{doc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* FAQ Accordion */}
            <div>
              <h2 className="section-title text-2xl">Frequently Asked Questions</h2>
              <div className="mt-5 space-y-3">
                {service.faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={faq.question} className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                      >
                        <span className="font-display text-sm font-bold text-ink-900 sm:text-base">{faq.question}</span>
                        <ChevronDown
                          size={20}
                          className={`shrink-0 text-[#25D366] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {isOpen && (
                        <div className="border-t border-ink-100 px-5 py-4 text-sm leading-7 text-ink-600 animate-fade-up">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Sticky Application Form */}
          <aside className="lg:relative">
            <div className="lg:sticky lg:top-24">
              <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-glass">
                <h3 className="font-display text-xl font-extrabold text-ink-900">Quick Application</h3>
                <p className="mt-1 text-sm text-ink-500">Send us your details and we’ll get back to you shortly.</p>

                <form
                  className="mt-5 space-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setSubmitting(true);
                    setError(null);
                    try {
                      const { error: insertError } = await supabase.from('attestation_orders').insert({
                        full_name: form.name,
                        phone_number: form.phone,
                        service: service.title,
                        service_slug: service.slug,
                        target_country: form.country,
                        message: form.message,
                      });
                      if (insertError) {
                        setError(insertError.message);
                      } else {
                        setModalOpen(true);
                        setForm({ name: '', phone: '', country: '', message: '' });
                      }
                    } catch (err) {
                      setError('Something went wrong submitting your inquiry. Please try again or reach us on WhatsApp.');
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  <label className="block text-xs font-bold text-ink-600">
                    Full Name
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-3 py-3 text-sm font-normal text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/15"
                      placeholder="Your full name"
                    />
                  </label>
                  <label className="block text-xs font-bold text-ink-600">
                    Phone Number
                    <input
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-3 py-3 text-sm font-normal text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/15"
                      placeholder="+974 ..."
                    />
                  </label>
                  <label className="block text-xs font-bold text-ink-600">
                    Selected Service
                    <input
                      value={service.title}
                      readOnly
                      className="mt-1.5 w-full cursor-not-allowed rounded-xl border border-ink-200 bg-ink-50 px-3 py-3 text-sm font-semibold text-ink-700 outline-none"
                    />
                  </label>
                  <label className="block text-xs font-bold text-ink-600">
                    Target Country
                    <input
                      required
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-3 py-3 text-sm font-normal text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/15"
                      placeholder="e.g. UAE, Qatar, KSA"
                    />
                  </label>
                  <label className="block text-xs font-bold text-ink-600">
                    Message
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="mt-1.5 w-full resize-none rounded-xl border border-ink-200 bg-white px-3 py-3 text-sm font-normal text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/15"
                      placeholder="Anything we should know?"
                    />
                  </label>

                  {error && (
                    <p className="rounded-xl border border-brand-500/20 bg-brand-500/10 px-4 py-3 text-sm font-semibold text-brand-600">{error}</p>
                  )}

                  <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed">
                    <Send size={16} /> {submitting ? 'Submitting...' : 'Submit Inquiry'}
                  </button>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost w-full"
                  >
                    <MessageCircle size={16} /> Direct WhatsApp Inquiry
                  </a>
                </form>
              </div>
            </div>
          </aside>
        </div>

        {/* Related services */}
        <div className="mt-16">
          <h2 className="section-title text-2xl">Other Attestation Services</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {attestationServices
              .filter((s) => s.slug !== service.slug)
              .slice(0, 3)
              .map((s) => {
                const RelatedIcon = s.icon;
                return (
                  <Link
                    key={s.slug}
                    to={`/services/documents/${s.slug}`}
                    className="group flex items-center gap-3 rounded-2xl border border-ink-100 bg-white p-4 shadow-soft transition hover:border-[#25D366]/40"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#25D366]">
                      <RelatedIcon size={20} />
                    </span>
                    <span className="text-sm font-bold text-ink-900 transition group-hover:text-[#25D366]">{s.title}</span>
                    <ArrowRight size={16} className="ml-auto text-ink-300 transition group-hover:text-[#25D366]" />
                  </Link>
                );
              })}
          </div>
        </div>
      </section>

      {/* Success Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/70 px-5 py-8 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
          <div
            className="w-full max-w-md animate-fade-up rounded-3xl border border-ink-100 bg-white p-8 text-center shadow-glass"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="mt-4 font-display text-xl font-extrabold text-ink-900">Inquiry Submitted</h3>
            <p className="mt-2 text-sm leading-6 text-ink-500">
              Thank you, {form.name || 'valued client'}. Our attestation team will contact you shortly regarding your {service.title} request.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button onClick={() => setModalOpen(false)} className="btn-primary w-full">
                Done
              </button>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost w-full">
                <MessageCircle size={16} /> Continue on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
