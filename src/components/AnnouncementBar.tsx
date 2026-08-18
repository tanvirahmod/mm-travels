import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { supabase, type Announcement, type Tour, type VisaRequirement } from '@/lib/supabase';

function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [visas, setVisas] = useState<VisaRequirement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [announcementsRes, toursRes, visasRes] = await Promise.all([
        supabase.from('announcements').select('*').eq('is_active', true).order('display_order', { ascending: true }),
        supabase.from('tours').select('*'),
        supabase.from('visa_requirements').select('*'),
      ]);
      if (announcementsRes.data) setAnnouncements(announcementsRes.data as Announcement[]);
      if (toursRes.data) setTours(toursRes.data as Tour[]);
      if (visasRes.data) setVisas(visasRes.data as VisaRequirement[]);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading || announcements.length === 0) return null;

  const getBadgeColor = (badgeColor: string) => {
    const colorMap: Record<string, string> = {
      'bg-red-500': 'bg-white/20 text-white',
      'bg-green-500': 'bg-green-400 text-white',
      'bg-blue-500': 'bg-white/20 text-white',
      'bg-yellow-500': 'bg-white text-brand-600',
      'bg-purple-500': 'bg-purple-400 text-white',
    };
    return colorMap[badgeColor] || 'bg-white/20 text-white';
  };

  const getTitle = (announcement: Announcement) => {
    if (announcement.custom_title.trim()) return announcement.custom_title;
    if (announcement.link_type === 'tour' && announcement.link_id) {
      const tour = tours.find((t) => t.id === announcement.link_id);
      return tour?.title || announcement.custom_title;
    }
    if (announcement.link_type === 'visa' && announcement.link_id) {
      const visa = visas.find((v) => v.id === announcement.link_id);
      return visa ? `${visa.country} - ${visa.visa_type}` : announcement.custom_title;
    }
    return announcement.custom_title;
  };

  const renderItem = (announcement: Announcement) => {
    const title = getTitle(announcement);
    const content = (
      <span className="flex items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${getBadgeColor(announcement.badge_color)}`}
        >
          {announcement.badge}
        </span>
        <span className="text-sm text-white">{title}</span>
      </span>
    );

    if (announcement.link_type === 'tour' && announcement.link_id) {
      return (
        <Link key={announcement.id} to={`/tours/${announcement.link_id}`} className="inline-block hover:opacity-80 transition">
          {content}
        </Link>
      );
    }
    if (announcement.link_type === 'visa' && announcement.link_id) {
      return (
        <Link key={announcement.id} to={`/visa/${announcement.link_id}`} className="inline-block hover:opacity-80 transition">
          {content}
        </Link>
      );
    }
    if (announcement.custom_url) {
      return (
        <a key={announcement.id} href={announcement.custom_url} target="_blank" rel="noopener noreferrer" className="inline-block hover:opacity-80 transition">
          {content}
        </a>
      );
    }
    return <span key={announcement.id}>{content}</span>;
  };

  return (
    <div className="relative w-full overflow-hidden bg-brand-500 text-white shadow-md">
      <div className="flex items-center">
        <div className="shrink-0 bg-white/10 px-5 py-3 text-xs font-bold uppercase tracking-wider border-r border-white/20 flex items-center gap-2">
          <Bell size={14} /> Special Offers
        </div>
        <div
          className="flex-1 overflow-hidden whitespace-nowrap"
          onMouseEnter={(e) => {
            const inner = e.currentTarget.querySelector('.marquee-inner') as HTMLElement;
            if (inner) inner.style.animationPlayState = 'paused';
          }}
          onMouseLeave={(e) => {
            const inner = e.currentTarget.querySelector('.marquee-inner') as HTMLElement;
            if (inner) inner.style.animationPlayState = 'running';
          }}
        >
          <div className="marquee-inner inline-flex animate-marquee">
            {[...announcements, ...announcements].map((announcement, index) => (
              <span key={index} className="inline-flex items-center px-5 py-3">
                {renderItem(announcement)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnnouncementBar;
