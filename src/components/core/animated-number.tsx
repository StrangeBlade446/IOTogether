'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, type SpringOptions } from 'framer-motion';
import { cn } from '@/lib/utils';

export type AnimatedNumberProps = {
  value: number;
  className?: string;
  springOptions?: SpringOptions;
  as?: React.ElementType;
  format?: (value: number) => string;
};

export function AnimatedNumber({
  value,
  className,
  springOptions = { bounce: 0, duration: 2000 },
  as: Component = 'span',
  format = (val) => Math.round(val).toLocaleString(),
}: AnimatedNumberProps) {
  const spring = useSpring(0, springOptions);
  const display = useTransform(spring, (current) => format(current));
  const [renderedValue, setRenderedValue] = useState(format(0));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    const unsubscribe = display.on('change', (latest) => {
      setRenderedValue(latest);
    });
    return () => unsubscribe();
  }, [display]);

  return (
    <Component className={cn('tabular-nums inline-block', className)}>
      <span>{renderedValue}</span>
    </Component>
  );
}
