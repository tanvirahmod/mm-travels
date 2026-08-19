import { PlaneMark } from '@/components/TravelDecor';

const airlineLogos = [
  {
    name: "Emirates",
    url: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg"
  },
  {
    name: "Qatar Airways",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/75/Qatar_Airways_logo.svg"
  },
  {
    name: "Singapore Airlines",
    url: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Singapore_Airlines_Logo.svg"
  },
  {
    name: "Turkish Airlines",
    url: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Turkish_Airlines_logo_2019.svg"
  },
  {
    name: "Etihad Airways",
    url: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Etihad-airways-logo.svg"
  },
  {
    name: "Flydubai",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/79/Fly_Dubai_logo_2010_03.svg"
  },
  {
    name: "Air Arabia",
    url: "https://upload.wikimedia.org/wikipedia/commons/8/84/Air_Arabia_logo_2018.svg"
  },
  {
    name: "Biman Bangladesh Airlines",
    url: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Biman_Airlines_logo.svg"
  }
];

export default function AirlineTicker() {
  const loop = [...airlineLogos, ...airlineLogos];

  return (
    <section className="bg-[#F8FAFC] py-10">
      <p className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold text-slate-400 mb-6 text-center">
        <PlaneMark className="h-4 w-4 text-brand-500" />
        Trusted Airline &amp; Travel Partners
      </p>

      <div className="relative overflow-hidden">
        {/* Left gradient mask */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white to-transparent" />
        {/* Right gradient mask */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white to-transparent" />

        <div className="flex w-max animate-marquee items-center hover:[animation-play-state:paused]">
          {loop.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="group flex h-16 w-44 shrink-0 items-center justify-center rounded-xl border border-transparent px-6 py-4 transition-colors duration-300 hover:border-[#25D366]/30"
            >
              <img
                src={logo.url}
                alt={logo.name}
                title={logo.name}
                loading="lazy"
                className="max-h-10 w-auto max-w-full object-contain opacity-80 transition-all duration-300 hover:opacity-100"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.nextElementSibling) {
                    (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                  }
                }}
              />
              <span className="hidden font-semibold text-slate-600 text-sm whitespace-nowrap">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
