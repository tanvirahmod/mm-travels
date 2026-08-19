import { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AppContext, type PageId } from '@/components/AppContext';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Packages from '@/pages/Packages';
import Destinations from '@/pages/Destinations';
import Contact from '@/pages/Contact';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminHeroSlider from '@/pages/admin/AdminHeroSlider';
import AdminCards from '@/pages/admin/AdminCards';
import AdminDestinations from '@/pages/admin/AdminDestinations';
import AdminTours from '@/pages/admin/AdminTours';
import AdminVisas from '@/pages/admin/AdminVisas';
import AdminAgents from '@/pages/admin/AdminAgents';
import AdminVisaApplications from '@/pages/admin/AdminVisaApplications';
import AdminTourApplications from '@/pages/admin/AdminTourApplications';
import AdminAnnouncements from '@/pages/admin/AdminAnnouncements';
import AdminAttestationOrders from '@/pages/admin/AdminAttestationOrders';
import AdminDrawer from '@/components/AdminDrawer';
import Tours from '@/pages/Tours';
import TourDetails from '@/pages/TourDetails';
import VisaSearch from '@/pages/VisaSearch';
import VisaDetails from '@/pages/VisaDetails';
import DocumentServices from '@/pages/DocumentServices';
import DocumentServiceDetails from '@/pages/DocumentServiceDetails';
import Gallery from '@/pages/Gallery';
import Services from '@/pages/Services';
import NotFound from '@/pages/NotFound';

const pageIdToPath: Record<PageId, string> = {
  home: '/',
  'about-us': '/about-us',
  services: '/services',
  visa: '/visa',
  'visa-details': '/visa',
  packages: '/packages',
  destinations: '/destinations',
  'contact-us': '/contact-us',
  documents: '/services/documents',
  gallery: '/gallery',
  admin: '/admin',
  'admin-destinations': '/admin/destinations',
  'admin-tours': '/admin/tours',
  'admin-visas': '/admin/visas',
  'admin-agents': '/admin/agents',
  'admin-visa-applications': '/admin/visa-applications',
  'admin-tour-applications': '/admin/tour-applications',
  'admin-announcements': '/admin/announcements',
  tours: '/tours',
  'tour-details': '/tours',
};

const pathToPageId = (path: string): PageId => {
  if (path.startsWith('/visa/')) return 'visa-details';
  if (path === '/visa') return 'visa';
  if (path.startsWith('/tours/')) return 'tour-details';
  if (path === '/tours') return 'tours';
  if (path === '/admin/destinations') return 'admin-destinations';
  if (path === '/admin/tours') return 'admin-tours';
  if (path === '/admin/visas') return 'admin-visas';
  if (path === '/admin/agents') return 'admin-agents';
  if (path === '/admin/visa-applications') return 'admin-visa-applications';
  if (path === '/admin/tour-applications') return 'admin-tour-applications';
  if (path === '/admin/announcements') return 'admin-announcements';
  if (path === '/admin') return 'admin';
  if (path === '/packages') return 'packages';
  if (path === '/destinations') return 'destinations';
  if (path === '/contact-us') return 'contact-us';
  if (path.startsWith('/services/documents')) return 'documents';
  if (path === '/gallery') return 'gallery';
  if (path === '/about-us') return 'home';
  if (path === '/services') return 'services';
  return 'home';
};

function AppInner() {
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentPage = pathToPageId(location.pathname);
  const openEnquiry = () => {
    const text = encodeURIComponent('Hello MM Travels, I would like to make an enquiry about your travel services.');
    window.open(`https://wa.me/97466486076?text=${text}`, '_blank', 'noopener,noreferrer');
  };
  const openAdmin = () => setAdminOpen(true);
  const closeAdmin = () => setAdminOpen(false);

  const handleNavigate = (page: PageId) => {
    navigate(pageIdToPath[page] || '/');
  };

  return (
    <AppContext.Provider value={{ currentPage, navigate: handleNavigate, openEnquiry, openAdmin, closeAdmin, adminOpen, adminLoggedIn, setAdminLoggedIn }}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/visa" element={<VisaSearch />} />
          <Route path="/visa/:id" element={<VisaDetails />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/tours/:id" element={<TourDetails />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/services/documents" element={<DocumentServices />} />
          <Route path="/services/documents/:slug" element={<DocumentServiceDetails />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
              <Route path="hero-slider" element={<AdminHeroSlider />} />
            <Route path="cards" element={<AdminCards />} />
            <Route path="destinations" element={<AdminDestinations />} />
            <Route path="tours" element={<AdminTours />} />
            <Route path="visas" element={<AdminVisas />} />
              <Route path="agents" element={<AdminAgents />} />
              <Route path="visa-applications" element={<AdminVisaApplications />} />
              <Route path="tour-applications" element={<AdminTourApplications />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
              <Route path="attestation-orders" element={<AdminAttestationOrders />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <AdminDrawer open={adminOpen} onClose={closeAdmin} />
    </AppContext.Provider>
  );
}

function App() {
  return <AppInner />;
}

export default App;
