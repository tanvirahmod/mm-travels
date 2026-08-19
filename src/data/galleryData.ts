export interface GalleryItem {
  id: string;
  title: string;
  category: 'travel' | 'group-tour' | 'destination' | 'office';
  imageUrl: string;
  location?: string;
}

export const galleryCategories = [
  { id: 'all', label: 'All Photos' },
  { id: 'travel', label: 'Travel Photos' },
  { id: 'group-tour', label: 'Group Tour Photos' },
  { id: 'destination', label: 'Destination Photos' },
  { id: 'office', label: 'Office Photos' },
] as const;

export const galleryImages: GalleryItem[] = [
  // Travel Photos
  { id: 't1', title: 'Flight & Window Views', category: 'travel', location: 'In-Flight', imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80' },
  { id: 't2', title: 'Airport Transit Moments', category: 'travel', location: 'Dhaka Airport', imageUrl: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=800&q=80' },

  // Group Tour Photos
  { id: 'g1', title: 'Corporate Group Tour to Sajek Valley', category: 'group-tour', location: 'Sajek, Bangladesh', imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80' },
  { id: 'g2', title: "Family Vacation Group in Cox's Bazar", category: 'group-tour', location: "Cox's Bazar", imageUrl: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=800&q=80' },
  { id: 'g3', title: 'Umrah Pilgrim Group Journey', category: 'group-tour', location: 'Makkah', imageUrl: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=800&q=80' },

  // Destination Photos
  { id: 'd1', title: 'Maldives Crystal Lagoons', category: 'destination', location: 'Maldives', imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80' },
  { id: 'd2', title: 'Dubai Skyline & Desert Safari', category: 'destination', location: 'UAE', imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80' },
  { id: 'd3', title: 'Kuala Lumpur Twin Towers', category: 'destination', location: 'Malaysia', imageUrl: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80' },

  // Office Photos
  { id: 'o1', title: 'MM Travels Head Office Front Desk', category: 'office', location: 'Main Office', imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80' },
  { id: 'o2', title: 'Client Consultation Lounge', category: 'office', location: 'Visa & Air Ticket Desk', imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80' },
];
