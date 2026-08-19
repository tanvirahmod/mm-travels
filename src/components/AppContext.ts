import { createContext, useContext } from 'react';

export type PageId =
  | 'home'
  | 'about-us'
  | 'services'
  | 'visa'
  | 'visa-details'
  | 'packages'
  | 'destinations'
  | 'contact-us'
  | 'documents'
  | 'gallery'
  | 'admin'
  | 'admin-destinations'
  | 'admin-tours'
  | 'admin-visas'
  | 'admin-agents'
  | 'admin-visa-applications'
  | 'admin-tour-applications'
  | 'admin-announcements'
  | 'tours'
  | 'tour-details';

type AppContextValue = {
  currentPage: PageId;
  navigate: (page: PageId) => void;
  openEnquiry: () => void;
  openAdmin: () => void;
  closeAdmin: () => void;
  adminOpen: boolean;
  adminLoggedIn: boolean;
  setAdminLoggedIn: (value: boolean) => void;
};

export const AppContext = createContext<AppContextValue>({
  currentPage: 'home',
  navigate: () => {},
  openEnquiry: () => {},
  openAdmin: () => {},
  closeAdmin: () => {},
  adminOpen: false,
  adminLoggedIn: false,
  setAdminLoggedIn: () => {},
});

export function useApp() {
  return useContext(AppContext);
}
