'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useId } from 'react';
import { cn } from '@/lib/utils';

export type TextMorphProps = {
  children: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
};

export function TextMorph({
  children,
  as: Component = 'span',
  className,
  style,
}: TextMorphProps) {
  const uniqueId = useId();
  const characters = children.split('').map((char, index) => ({
    id: `${uniqueId}-${index}-${char}`,
    label: char === ' ' ? '\u00A0' : char,
  }));

  return (
    <Component
      className={cn('relative inline-flex items-center overflow-hidden', className)}
      style={style}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {characters.map((character) => (
          <motion.span
            key={character.id}
            layoutId={character.id}
            initial={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 6, filter: 'blur(3px)' }}
            transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
            className="inline-block"
          >
            {character.label}
          </motion.span>
        ))}
      </AnimatePresence>
    </Component>
  );
}
