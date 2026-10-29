import React from 'react';
import type { Metadata } from 'next';
import { UnavailableClient } from './UnavailableClient';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Feature Unavailable — Proceed with Demo Account',
  description:
    'External custom login is currently disabled for academic consortium evaluation. Please select a verified Seeker or Keeper demo profile.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthUnavailablePage() {
  return <UnavailableClient />;
}
