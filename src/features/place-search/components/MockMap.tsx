import { cn } from '@/lib/utils';
import type { MapCluster, MapMarker } from '../types';

interface Props {
  markers?: MapMarker[];
  clusters?: MapCluster[];
  className?: string;
}

export function MockMap({ className }: Props) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="400" height="300" fill="#f0ebe3" />

        {/* Roads */}
        <rect x="0" y="55" width="400" height="12" fill="#e2d9ce" />
        <rect x="0" y="120" width="400" height="10" fill="#e2d9ce" />
        <rect x="0" y="190" width="400" height="12" fill="#e2d9ce" />
        <rect x="0" y="255" width="400" height="10" fill="#e2d9ce" />
        <rect x="75" y="0" width="10" height="300" fill="#e2d9ce" />
        <rect x="155" y="0" width="12" height="300" fill="#e2d9ce" />
        <rect x="245" y="0" width="10" height="300" fill="#e2d9ce" />
        <rect x="325" y="0" width="12" height="300" fill="#e2d9ce" />

        {/* River */}
        <path
          d="M -20 70 C 60 100 90 140 150 175 C 210 210 260 240 420 265"
          stroke="#9bbfd0"
          strokeWidth="22"
          fill="none"
          strokeLinecap="round"
        />

        {/* Parks */}
        <rect x="8" y="67" width="58" height="44" fill="#c5d9a8" rx="2" />
        <rect x="88" y="132" width="57" height="47" fill="#c5d9a8" rx="2" />
        <rect x="265" y="67" width="50" height="44" fill="#c5d9a8" rx="2" />
        <rect x="265" y="203" width="50" height="43" fill="#c5d9a8" rx="2" />

        {/* Buildings */}
        <rect x="8" y="130" width="58" height="50" fill="#d8d0c6" rx="2" />
        <rect x="88" y="67" width="57" height="44" fill="#d8d0c6" rx="2" />
        <rect x="167" y="8" width="68" height="102" fill="#d8d0c6" rx="2" />
        <rect x="167" y="130" width="68" height="50" fill="#d8d0c6" rx="2" />
        <rect x="167" y="202" width="68" height="68" fill="#d8d0c6" rx="2" />
        <rect x="88" y="202" width="57" height="44" fill="#d8d0c6" rx="2" />
        <rect x="337" y="8" width="53" height="38" fill="#d8d0c6" rx="2" />
        <rect x="337" y="130" width="53" height="50" fill="#d8d0c6" rx="2" />
        <rect x="337" y="202" width="53" height="68" fill="#d8d0c6" rx="2" />

        {/* Pin markers */}
        {[
          { cx: 92, cy: 38 },
          { cx: 345, cy: 22 },
          { cx: 230, cy: 148 },
          { cx: 65, cy: 238 },
        ].map(({ cx, cy }, i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="13" fill="#b5451e" />
            <circle cx={cx} cy={cy} r="5" fill="white" />
            <polygon
              points={`${cx},${cy + 18} ${cx - 8},${cy + 4} ${cx + 8},${cy + 4}`}
              fill="#b5451e"
            />
          </g>
        ))}

        {/* Clusters */}
        <circle cx="200" cy="82" r="12" fill="#b5451e" />
        <text x="200" y="86" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
          3
        </text>
        <circle cx="295" cy="218" r="12" fill="#b5451e" />
        <text x="295" y="222" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
          5
        </text>
      </svg>
    </div>
  );
}
