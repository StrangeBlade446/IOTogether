'use client';

import React from 'react';
import { motion, type Transition } from 'framer-motion';
import { cn } from '@/lib/utils';

export type TextRollProps = {
  children: string;
  className?: string;
  duration?: number;
  getEnterDelay?: (index: number) => number;
  getExitDelay?: (index: number) => number;
  transition?: Transition;
};

export function TextRoll({
  children,
  className,
  duration = 0.5,
  getEnterDelay = (i) => i * 0.035,
  transition = { ease: [0.16, 1, 0.3, 1] },
}: TextRollProps) {
  const letters = children.split('');

  return (
    <motion.span
      className={cn('inline-flex overflow-hidden cursor-default group', className)}
      initial="initial"
      whileHover="hover"
      animate="animate"
    >
      <span className="sr-only">{children}</span>
      <span aria-hidden className="inline-flex">
        {letters.map((letter, i) => (
          <span
            key={i}
            className="relative inline-block overflow-hidden [perspective:1000px]"
          >
            <motion.span
              className="inline-block"
              transition={{
                duration,
                delay: getEnterDelay(i),
                ...transition,
              }}
              variants={{
                initial: { y: 0, opacity: 1 },
                hover: { y: '-100%', opacity: 0 },
                animate: { y: 0, opacity: 1 },
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
            <motion.span
              className="absolute left-0 top-0 inline-block"
              transition={{
                duration,
                delay: getEnterDelay(i),
                ...transition,
              }}
              variants={{
                initial: { y: '100%', opacity: 0 },
                hover: { y: 0, opacity: 1 },
                animate: { y: '100%', opacity: 0 },
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          </span>
        ))}
      </span>
    </motion.span>
  );
}
