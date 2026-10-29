import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'IOTogether — Academic Electronics Resource Sharing Platform';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '80px',
          background: 'linear-gradient(135deg, #141821 0%, #1e2634 50%, #263447 100%)',
          fontFamily: 'sans-serif',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              backgroundColor: '#ba4d2b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              color: '#ffffff',
            }}
          >
            ⚡
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '20px',
                fontFamily: 'monospace',
                textTransform: 'uppercase',
                letterSpacing: '4px',
                color: '#C49A55',
                fontWeight: 700,
              }}
            >
              Academic Consortium
            </span>
            <span
              style={{
                fontSize: '44px',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-1px',
              }}
            >
              IO<span style={{ color: '#ba4d2b' }}>Together</span>.
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '960px' }}>
          <span
            style={{
              fontSize: '52px',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#F1E7D0',
            }}
          >
            Share Hardware. Build Possibilities.
          </span>
          <span
            style={{
              fontSize: '24px',
              color: '#a0aec0',
              lineHeight: 1.4,
            }}
          >
            Connecting colleges and schools with underused electronics equipment to verified student makers.
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            fontSize: '18px',
            fontFamily: 'monospace',
            color: '#67C7D4',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: '24px',
            width: '100%',
          }}
        >
          <span>Apex Institute of Technology</span>
          <span>•</span>
          <span>Vanguard Engineering College</span>
          <span>•</span>
          <span>Horizon STEM Academy</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
