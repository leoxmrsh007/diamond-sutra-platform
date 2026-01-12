/**
 * Layout Wrapper - Client component for interactive features
 */

'use client';

import { useShortcuts } from "@/components/ui/shortcuts";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { ShortcutHint, ShortcutsHelp } from "@/components/ui/shortcuts";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  useShortcuts();

  return (
    <>
      {children}
      <MobileBottomNav />
      <ShortcutHint />
      <ShortcutsHelp
        open={false}
        onClose={() => {
          document.dispatchEvent(new CustomEvent('close-shortcuts'));
        }}
      />
    </>
  );
}
