import { createContext, useContext, useState, type ReactNode } from "react";

interface SidebarContextProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextProps>({
  isOpen: false,
  toggleSidebar: () => {},
  closeSidebar: () => {},
});

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const closeSidebar = () => setIsOpen(false);

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar, closeSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
