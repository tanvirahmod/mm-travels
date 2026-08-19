import { useEffect, useState, useCallback } from 'react';
import { ZoomIn, X, ChevronLeft, ChevronRight, MapPin, Images } from 'lucide-react';
import { galleryImages, galleryCategories, type GalleryItem } from '@/data/galleryData';

export default function Gallery() {
  const [active, setActive] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered: GalleryItem[] =
    active === 'all' ? galleryImages : galleryImages.filter((img) => img.category === active);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? prev : (prev - 1 + filtered.length) % filtered.length));
  }, [filtered.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? prev : (prev + 1) % filtered.length));
  }, [filtered.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, goPrev, goNext]);

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxIndex]);

  const activeItem = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <>
      {/* Hero Header */}
      <section className="relative isolate overflow-hidden bg-[#0B2545] py-16 sm:py-20">
        <div className="absolute inset-0 -z-10 bg-cover bg-center opacity-40" style={{ backgroundImage: 'linear-gradient(120deg, rgba(11,37,69,.95), rgba(37,211,102,.45)), url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1800&q=80)' }} />
        <div className="absolute inset-0 -z-10 bg-mesh-pop opacity-50" />
        <div className="container-x max-w-7xl">
          <span className="eyebrow"><Images size={14} /> Photo Gallery</span>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Our Journey &amp; Memories
          </h1>
          <p className="lede mt-4 max-w-2xl text-white/70">
            Explore moments from our successful tours, happy clients, and foreign destinations.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-[72px] z-20 border-b border-ink-100 bg-white/95 backdrop-blur-xl">
        <div className="container-x max-w-7xl py-4">
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
            {galleryCategories.map((cat) => {
              const isActive = active === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActive(cat.id)}
                  className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition ${
                    isActive
                      ? 'bg-[#25D366] text-white shadow-glow-sm'
                      : 'bg-[#F1F5F9] text-[#0B2545] hover:bg-[#25D366]/10'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container-x max-w-7xl py-10 sm:py-14">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, index) => (
            <button
              key={item.id}
              onClick={() => openLightbox(index)}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-ink-100 bg-ink-100 shadow-soft transition-all duration-300 hover:shadow-card-hover"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545]/85 via-[#0B2545]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute left-4 right-4 bottom-4 text-left opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#25D366]">
                  {item.location && (
                    <>
                      <MapPin size={12} /> {item.location}
                    </>
                  )}
                </div>
                <h3 className="mt-1 font-display text-base font-extrabold text-white">{item.title}</h3>
              </div>
              <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#0B2545] opacity-0 transition-all duration-300 group-hover:opacity-100">
                <ZoomIn size={18} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeItem && lightboxIndex !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0B2545]/95 px-4 py-8 backdrop-blur-sm animate-fade-up" onClick={closeLightbox}>
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close"
          >
            <X size={22} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
            aria-label="Previous"
          >
            <ChevronLeft size={26} />
          </button>

          <figure
            className="flex max-h-full w-full max-w-4xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeItem.imageUrl}
              alt={activeItem.title}
              className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-glass"
            />
            <figcaption className="mt-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#25D366]">
                {activeItem.location && (
                  <>
                    <MapPin size={13} /> {activeItem.location}
                  </>
                )}
              </div>
              <p className="mt-1 font-display text-lg font-extrabold text-white">{activeItem.title}</p>
              <p className="mt-1 text-xs text-white/50">
                {lightboxIndex + 1} / {filtered.length}
              </p>
            </figcaption>
          </figure>

          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
            aria-label="Next"
          >
            <ChevronRight size={26} />
          </button>
        </div>
      )}
    </>
  );
}
