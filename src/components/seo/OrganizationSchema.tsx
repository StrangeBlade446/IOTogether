import React from 'react';

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'IOTogether Electronics Academic Consortium',
    alternateName: 'IOTogether',
    url: 'https://iotogether.edu',
    logo: 'https://iotogether.edu/logo.png',
    description:
      'Inter-collegiate academic consortium connecting universities and STEM schools to share microcontrollers, sensors, robotics kits, and laboratory instruments with verified student builders.',
    sameAs: [
      'https://github.com/IOTogether',
    ],
    member: [
      {
        '@type': 'CollegeOrUniversity',
        name: 'Apex Institute of Technology',
      },
      {
        '@type': 'CollegeOrUniversity',
        name: 'Vanguard Engineering College',
      },
      {
        '@type': 'HighSchool',
        name: 'Horizon STEM Academy',
      },
    ],
    knowsAbout: [
      'Electronics Engineering',
      'Embedded Systems',
      'Microcontrollers',
      'Internet of Things',
      'Laboratory Equipment Sharing',
      'Oscilloscopes & Test Instruments',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
