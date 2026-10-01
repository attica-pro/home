import type { ComponentType, ReactNode } from 'react';

/**
 * One line icon per service, drawn on a 24px grid with the same stroke as the brand mark.
 * Each has exactly one clay part (the `fill-clay` shape), which marks the work itself.
 */
export type ServiceIcon = ComponentType<{ className?: string }>;

function icon(children: ReactNode): ServiceIcon {
  function Icon({ className }: { className?: string }) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {children}
      </svg>
    );
  }
  return Icon;
}

export const InsulationIcon = icon(
  <>
    <rect className="fill-clay" x="6.3" y="11.2" width="11.4" height="2.6" rx=".6" stroke="none" />
    <path d="M4 8.5V21M20 8.5V21M4 15h16" />
    <path d="M12 2.8s-2.1 2.5-2.1 3.9a2.1 2.1 0 0 0 4.2 0c0-1.4-2.1-3.9-2.1-3.9z" />
  </>,
);

export const PaintingIcon = icon(
  <>
    <rect className="fill-clay" x="3.5" y="3" width="13.5" height="5.2" rx="1.3" />
    <path d="M17 5.6h2.8v5.2H11.5v3" />
    <rect x="10" y="13.8" width="3" height="7.4" rx="1" />
  </>,
);

export const RenovationsIcon = icon(
  <>
    <rect className="fill-clay" x="4.6" y="12.9" width="14.8" height="2.2" rx=".4" stroke="none" />
    <path d="M3 12h18v2.2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5zM7 19.2 6 21M17 19.2l1 1.8" />
    <path d="M6 12V6a2.6 2.6 0 0 1 5.2 0v.6M9.6 8.3h3.2" />
  </>,
);

export const DemolitionIcon = icon(
  <>
    <path d="M2.5 4h13.5v4M2.5 4v16h13.5v-8M2.5 8h13.5M2.5 12h13.5M2.5 16h13.5M9 4v4M5.8 8v4M12 8v4M9 12v4M5.8 16v4M12.3 16v4" />
    <rect className="fill-clay" x="17" y="7.6" width="5" height="3.4" rx=".5" transform="rotate(24 19.5 9.3)" />
  </>,
);

export const PavingIcon = icon(
  <>
    <path className="fill-clay" d="M10 5.5h4l.95 7.3h-5.9z" stroke="none" />
    <path d="M6 5.5h12L22 20H2zM3.6 12.8h16.8M10 5.5 8 20M14 5.5l2 14.5" />
  </>,
);

export const WoodIcon = icon(
  <>
    <path className="fill-clay" d="M3.8 7.8h5.4v8.4H3.8z" stroke="none" />
    <rect x="3" y="7" width="18" height="10" rx="1.2" />
    <path d="M9.5 10.2c2.4-1 4.6.9 7 0 1.2-.4 2.1-.4 3 0M9.5 13.6c2-.7 3.6.6 5.2.2" />
    <ellipse cx="16.6" cy="13.7" rx="1.4" ry=".9" />
  </>,
);

export const RepairsIcon = icon(
  <>
    <rect className="fill-clay" x="14.3" y="4.4" width="8" height="4.2" rx="1.6" transform="rotate(-45 18.3 6.5)" />
    <path d="M15.4 8.6 6.2 17.8M6.2 17.8l-2.2 2.6.6.6 2.6-2.2" />
    <path d="M8.2 3.6 10.6 5v2.8L8.2 9.2 5.8 7.8V5z" />
  </>,
);
