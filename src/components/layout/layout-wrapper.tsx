/**
 * Layout Wrapper - Client component for interactive features
 */

'use client';

import { useState, useEffect } from 'react';
import { useShortcuts } from "@/components/ui/shortcuts";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { ShortcutHint, ShortcutsHelp } from "@/components/ui/shortcuts";
import { SearchDialog } from "@/components/search/search-dialog";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  useShortcuts();

  useEffect(() => {
    const handleOpenSearch = () => setSearchOpen(true);
    const handleToggleShortcuts = () => setShortcutsOpen((prev) => !prev);
    const handleCloseDialog = () => {
      setSearchOpen(false);
      setShortcutsOpen(false);
    };

    document.addEventListener('open-search', handleOpenSearch);
    document.addEventListener('toggle-shortcuts', handleToggleShortcuts);
    document.addEventListener('close-dialog', handleCloseDialog);

    return () => {
      document.removeEventListener('open-search', handleOpenSearch);
      document.removeEventListener('toggle-shortcuts', handleToggleShortcuts);
      document.removeEventListener('close-dialog', handleCloseDialog);
    };
  }, []);

  return (
    <>
      {children}
      <MobileBottomNav />
      <ShortcutHint />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
      <ShortcutsHelp open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </>
  );
}
