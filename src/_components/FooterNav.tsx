'use client';

import { Search, TrainFront } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const TABS = [
  { key: 'search', label: '검색', href: '/', Icon: Search },
  { key: 'region', label: '권역 추천', href: '/region', Icon: TrainFront },
] as const;

export function FooterNav() {
  const pathname = usePathname();

  return (
    <nav className="shrink-0 h-14 flex border-t border-border bg-place-surface">
      {TABS.map(({ key, label, href, Icon }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return (
        <Link
          key={key}
          type="button"
          className={cn(
            'flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors hover:bg-muted/50',
            active
              ? 'text-place-primary border-t-2 border-place-primary'
              : 'text-place-icon-muted',
          )}
          href={href}
        >
          <Icon className="w-5 h-5" />
          {label}
        </Link>
        );
      })}
    </nav>
  );
}
