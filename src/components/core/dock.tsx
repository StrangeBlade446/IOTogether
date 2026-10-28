'use client';

import React, { createContext, useContext, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  type MotionValue,
} from 'framer-motion';
import { cn } from '@/lib/utils';

type DockContextType = {
  mousePos: MotionValue<number>;
  orientation: 'horizontal' | 'vertical';
  magnification: number;
  distance: number;
};

const DockContext = createContext<DockContextType>({
  mousePos: { get: () => Infinity } as any,
  orientation: 'vertical',
  magnification: 56,
  distance: 120,
});

export type DockProps = {
  className?: string;
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  magnification?: number;
  distance?: number;
  direction?: 'top' | 'middle' | 'bottom';
};

export function Dock({
  className,
  children,
  orientation = 'vertical',
  magnification = 56,
  distance = 120,
}: DockProps) {
  const mousePos = useMotionValue(Infinity);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (orientation === 'vertical') {
      mousePos.set(e.clientY - rect.top);
    } else {
      mousePos.set(e.clientX - rect.left);
    }
  };

  const handleMouseLeave = () => {
    mousePos.set(Infinity);
  };

  return (
    <DockContext.Provider
      value={{
        mousePos,
        orientation,
        magnification,
        distance,
      }}
    >
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'flex gap-2.5 p-2 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-xl',
          orientation === 'vertical' ? 'flex-col items-center' : 'flex-row items-end',
          className
        )}
      >
        {children}
      </motion.div>
    </DockContext.Provider>
  );
}

export type DockItemProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

const ItemHoverContext = createContext<{ isHovered: boolean }>({ isHovered: false });

export function DockItem({ className, children, onClick }: DockItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const { mousePos, orientation, magnification, distance } = useContext(DockContext);
  const [isHovered, setIsHovered] = useState(false);

  const baseSize = 42;

  const itemPos = useTransform(mousePos, (val) => {
    if (!itemRef.current || val === Infinity) return Infinity;
    const bounds = itemRef.current.getBoundingClientRect();
    const parentBounds = itemRef.current.parentElement?.getBoundingClientRect() || bounds;
    const center =
      orientation === 'vertical'
        ? bounds.top - parentBounds.top + bounds.height / 2
        : bounds.left - parentBounds.left + bounds.width / 2;
    return val - center;
  });

  const sizeTransform = useTransform(itemPos, [-distance, 0, distance], [baseSize, magnification, baseSize]);
  const size = useSpring(sizeTransform, {
    mass: 0.1,
    stiffness: 170,
    damping: 12,
  });

  return (
    <ItemHoverContext.Provider value={{ isHovered }}>
      <motion.div
        ref={itemRef}
        style={{ width: size, height: size }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        className={cn(
          'relative flex items-center justify-center cursor-pointer select-none transition-colors duration-150',
          className
        )}
      >
        {children}
      </motion.div>
    </ItemHoverContext.Provider>
  );
}

export type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
};

export function DockLabel({ className, children }: DockLabelProps) {
  const { orientation } = useContext(DockContext);
  const { isHovered } = useContext(ItemHoverContext);

  return (
    <AnimatePresence>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, x: orientation === 'vertical' ? 10 : 0, y: orientation === 'vertical' ? 0 : 10, scale: 0.9 }}
          animate={{ opacity: 1, x: orientation === 'vertical' ? 18 : 0, y: orientation === 'vertical' ? 0 : -8, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.1 } }}
          className={cn(
            'absolute z-50 px-2.5 py-1 text-xs font-semibold whitespace-nowrap rounded-lg shadow-xl pointer-events-none',
            'bg-white/95 text-slate-900 border border-slate-200 font-mono shadow-slate-200/50',
            orientation === 'vertical'
              ? 'left-full top-1/2 -translate-y-1/2 ml-1'
              : 'bottom-full left-1/2 -translate-x-1/2 mb-1',
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export type DockIconProps = {
  className?: string;
  children: React.ReactNode;
};

export function DockIcon({ className, children }: DockIconProps) {
  return (
    <div className={cn('flex items-center justify-center w-full h-full p-2', className)}>
      {children}
    </div>
  );
}
