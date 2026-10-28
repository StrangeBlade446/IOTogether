'use client';

import React, { useEffect, useState } from 'react';
import {
  Activity,
  Component,
  HomeIcon,
  Mail,
  Package,
  ScrollText,
  SunMoon,
} from 'lucide-react';
import { TextMorph } from '@/components/core/text-morph';
import { TextRoll } from '@/components/core/text-roll';
import { AnimatedNumber } from '@/components/core/animated-number';
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/core/dock';

export function TextMorphButton({
  primaryText = 'Continue',
  alternateText = 'Confirm',
  className,
  onToggle,
}: {
  primaryText?: string;
  alternateText?: string;
  className?: string;
  onToggle?: (active: boolean) => void;
}) {
  const [text, setText] = useState(primaryText);

  const handleClick = () => {
    const next = text === primaryText ? alternateText : primaryText;
    setText(next);
    onToggle?.(next === alternateText);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ||
        'flex h-10 w-[140px] shrink-0 items-center justify-center rounded-full bg-[#C49A55] px-4 text-xs font-bold text-white shadow-md transition-all hover:bg-[#d4aa65]'
      }
    >
      <TextMorph>{text}</TextMorph>
    </button>
  );
}

export function TextRollBasic({
  text = 'motion-primitives',
  className = 'text-4xl text-[#0F172A]',
}: {
  text?: string;
  className?: string;
}) {
  return (
    <TextRoll className={className}>
      {text}
    </TextRoll>
  );
}

export function AnimatedNumberBasic({
  initialValue = 0,
  targetValue = 2082,
  label = 'Active Seekers',
}: {
  initialValue?: number;
  targetValue?: number;
  label?: string;
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(targetValue);
  }, [targetValue]);

  return (
    <div className="flex items-center justify-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        width="16"
        height="16"
        className="h-4 w-4 fill-transparent stroke-[#C49A55] stroke-[1.5]"
      >
        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
      </svg>
      <AnimatedNumber
        className="inline-flex items-center font-mono text-2xl font-light text-[#F1E7D0]"
        springOptions={{
          bounce: 0,
          duration: 2000,
        }}
        value={value}
      />
      {label && <span className="text-xs text-[#F1E7D0]/60 font-mono ml-1">{label}</span>}
    </div>
  );
}

const defaultDockData = [
  {
    title: 'Home',
    icon: <HomeIcon className="h-full w-full text-[#C49A55]" />,
    href: '/',
  },
  {
    title: 'Products',
    icon: <Package className="h-full w-full text-[#67C7D4]" />,
    href: '/receiver/explore',
  },
  {
    title: 'Components',
    icon: <Component className="h-full w-full text-[#F1E7D0]" />,
    href: '/receiver/explore',
  },
  {
    title: 'Activity',
    icon: <Activity className="h-full w-full text-[#C49A55]" />,
    href: '/receiver/bookings',
  },
  {
    title: 'Change Log',
    icon: <ScrollText className="h-full w-full text-[#67C7D4]" />,
    href: '/admin/audit',
  },
  {
    title: 'Email',
    icon: <Mail className="h-full w-full text-[#F1E7D0]" />,
    href: '/notifications',
  },
  {
    title: 'Theme',
    icon: <SunMoon className="h-full w-full text-[#C49A55]" />,
    href: '#',
  },
];

export function AppleStyleDock({
  data = defaultDockData,
}: {
  data?: typeof defaultDockData;
}) {
  return (
    <div className="relative max-w-full">
      <Dock orientation="horizontal" className="items-end pb-2 bg-white/95 border border-slate-200 shadow-lg">
        {data.map((item, idx) => (
          <DockItem
            key={idx}
            className="aspect-square rounded-full bg-slate-100 border border-slate-200 hover:border-[#0891B2]"
          >
            <DockLabel>{item.title}</DockLabel>
            <DockIcon>{item.icon}</DockIcon>
          </DockItem>
        ))}
      </Dock>
    </div>
  );
}
