'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronsLeftRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { assetPath } from '@/lib/site-config';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  alt: string;
  className?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  alt,
  className,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  // The pointer currently pressed on the slider, if any.
  const gesture = useRef<{ id: number; touch: boolean; startX: number; startPosition: number; moved: boolean } | null>(
    null,
  );

  const toPercent = useCallback((dx: number) => {
    const width = containerRef.current?.getBoundingClientRect().width;
    return width ? (dx / width) * 100 : 0;
  }, []);

  const positionAt = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    return rect ? ((clientX - rect.left) / rect.width) * 100 : 50;
  }, []);

  const clamp = (value: number) => Math.min(100, Math.max(0, value));

  // A mouse jumps the divider to where it's pressed. A finger leaves it alone until it moves
  // sideways, so that a vertical swipe over the photo scrolls the page instead (touch-action
  // pan-y hands vertical swipes to the browser, which then cancels the pointer).
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const touch = e.pointerType !== 'mouse';
    gesture.current = { id: e.pointerId, touch, startX: e.clientX, startPosition: position, moved: false };
    if (!touch) {
      // Keep receiving moves when the mouse leaves the photo mid-drag. (Touch pointers are captured
      // implicitly.) It throws if the pointer is already gone, which doesn't matter here.
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
      setPosition(clamp(positionAt(e.clientX)));
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    if (!g.touch) {
      setPosition(clamp(positionAt(e.clientX)));
      return;
    }
    const dx = e.clientX - g.startX;
    if (!g.moved) {
      if (Math.abs(dx) < 6) return;
      g.moved = true;
    }
    // Drag relative to where the finger started, so grabbing anywhere doesn't make the divider jump.
    setPosition(clamp(g.startPosition + toPercent(dx)));
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    // A tap (no sideways drag) moves the divider to the tapped spot.
    if (g.touch && !g.moved) setPosition(clamp(positionAt(e.clientX)));
    gesture.current = null;
  };

  const onPointerCancel = () => {
    gesture.current = null;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setPosition((p) => Math.max(0, p - 5));
    if (e.key === 'ArrowRight') setPosition((p) => Math.min(100, p + 5));
  };

  return (
    <div
      ref={containerRef}
      // The clip and handle are positioned from the left, so keep this LTR even on Arabic pages.
      dir="ltr"
      className={cn(
        'relative aspect-[4/3] w-full cursor-ew-resize select-none overflow-hidden rounded-lg bg-muted',
        className,
      )}
      style={{ touchAction: 'pan-y pinch-zoom', WebkitTouchCallout: 'none' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      <Image
        src={assetPath(afterImage)}
        alt={`${alt} - ${afterLabel}`}
        fill
        className="pointer-events-none select-none object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      <div
        className="pointer-events-none absolute inset-0"
        // Clip rather than resize, so the before image stays the same size and lines up with the after image.
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={assetPath(beforeImage)}
          alt={`${alt} - ${beforeLabel}`}
          fill
          className="select-none object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded bg-black/60 px-2 py-1 text-xs font-semibold uppercase text-white">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded bg-accent/90 px-2 py-1 text-xs font-semibold uppercase text-white">
        {afterLabel}
      </span>

      <div
        className="absolute inset-y-0 z-10 flex w-0 items-center justify-center"
        style={{ left: `${position}%` }}
      >
        <div className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]" />
        <div
          role="slider"
          tabIndex={0}
          aria-label="Before after comparison slider"
          aria-valuenow={Math.round(position)}
          aria-valuemin={0}
          aria-valuemax={100}
          onKeyDown={onKeyDown}
          className="flex h-9 w-9 -translate-x-1/2 cursor-ew-resize items-center justify-center rounded-full border-2 border-white bg-accent text-white shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronsLeftRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
