import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Navbar } from './Navbar';
import { SmartSearch } from '../ui/SmartSearch';
import { QuickReferenceDrawer } from '../ui/QuickReferenceDrawer';

// Context to manage Call Mode toggle
interface AppShellContextProps {
  callMode: boolean;
  setCallMode: (v: boolean) => void;
}
const AppShellContext = createContext<AppShellContextProps | undefined>(undefined);
export const useAppShell = () => {
  const ctx = useContext(AppShellContext);
  if (!ctx) throw new Error('useAppShell must be used within AppShell');
  return ctx;
};

interface AppShellProps {
  children: ReactNode;
}
export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [callMode, setCallMode] = useState(false);
  return (
    <AppShellContext.Provider value={{ callMode, setCallMode }}>
      <div className={callMode ? 'call-mode' : ''}>
        <Navbar onOpenSearch={() => {/* placeholder */}} />
        {/* Global drawers */}
        <SmartSearch />
        <QuickReferenceDrawer />
        {children}
      </div>
    </AppShellContext.Provider>
  );
};
