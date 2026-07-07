'use client';

import { parseAsStringLiteral, useQueryState } from 'nuqs';

const VIEW_TABS = ['list', 'map'] as const;

export function useViewTab() {
  return useQueryState('tab', parseAsStringLiteral(VIEW_TABS).withDefault('map'));
}
