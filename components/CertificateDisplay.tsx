'use client';

import { forwardRef } from 'react';
import { AIThinkingProfile } from '@/types';
import { getProfileDescription } from '@/data/profiles';

interface CertificateDisplayProps {
  name: string;
  profile: AIThinkingProfile;
  certificateId: string;
}

export const CertificateDisplay = forwardRef<HTMLDivElement, CertificateDisplayProps>(
  ({ name, profile, certificateId }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: '1000px',
          height: '630px',
          backgroundColor: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: "'Inter', -apple-system, sans-serif",
          display: 'flex',
          flexDirection: 'column',
          border: '1.5px solid #c8d6e0',
        }}
      >
        {/* Corner accent — top-left */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: '220px', height: '220px',
          background: 'radial-gradient(circle at top left, #8FAFC8 0%, #b0c8da 35%, transparent 70%)',
          opacity: 0.55,
        }} />

        {/* Corner accent — bottom-right */}
        <div style={{
          position: 'absolute', bottom: 0, right: 0,
          width: '220px', height: '220px',
          background: 'radial-gradient(circle at bottom right, #8FAFC8 0%, #b0c8da 35%, transparent 70%)',
          opacity: 0.55,
        }} />

        {/* Inner border inset */}
        <div style={{
          position: 'absolute', inset: '14px',
          border: '1px solid #d4e2ec',
          pointerEvents: 'none',
        }} />

        {/* Content */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'space-between',
          height: '100%',
          padding: '48px 80px 40px',
        }}>

          {/* Top: eyebrow */}
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: '11px', letterSpacing: '3px',
              textTransform: 'uppercase', color: '#7a9ab2',
              marginBottom: '18px', fontWeight: 500,
            }}>
              AI Sense Check Certification
            </p>

            {/* Main title */}
            <h1 style={{
              fontSize: '46px', color: '#1a3050',
              margin: 0, fontWeight: 400,
              fontFamily: "'Playfair Display', Georgia, serif",
              lineHeight: 1.1,
            }}>
              Certificate{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 400 }}>of</em>
              {' '}AI Thinking
            </h1>

            {/* Divider */}
            <div style={{ width: '360px', height: '1px', background: '#c8d8e4', margin: '22px auto 0' }} />
          </div>

          {/* Middle: name + body */}
          <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
            <p style={{ fontSize: '14px', color: '#7a9ab2', fontStyle: 'italic', margin: 0 }}>
              This certifies that
            </p>

            <p style={{
              fontSize: '38px', fontWeight: 700,
              fontFamily: "'Playfair Display', Georgia, serif",
              color: '#1a3050', margin: '4px 0 8px',
              lineHeight: 1.1,
            }}>
              {name}
            </p>

            <p style={{ fontSize: '13px', color: '#4a6070', margin: 0, lineHeight: 1.6, maxWidth: '500px' }}>
              has completed the AI Sense Check and demonstrated a strong<br />
              perspective on how AI works in real environments.
            </p>

            {/* Divider */}
            <div style={{ width: '260px', height: '1px', background: '#dde8ef', margin: '10px auto' }} />

            {/* Profile badge */}
            <div style={{
              display: 'inline-block',
              border: '1.5px solid #5a8aaa',
              borderRadius: '40px',
              padding: '8px 28px',
              alignSelf: 'center',
            }}>
              <p style={{ fontSize: '13px', color: '#2a5a7a', fontWeight: 600, margin: 0 }}>
                AI Thinking Profile: {profile}
              </p>
            </div>

            {/* Profile description — personalized with name */}
            <p style={{ fontSize: '13px', color: '#4a6070', margin: '6px 0 0', lineHeight: 1.5, maxWidth: '420px', alignSelf: 'center' }}>
              {name} {getProfileDescription(profile).charAt(0).toLowerCase() + getProfileDescription(profile).slice(1)}
            </p>
          </div>

          {/* Footer */}
          <div style={{
            width: '100%',
            borderTop: '1px solid #dde8ef',
            paddingTop: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <p style={{ fontSize: '9px', color: '#9ab0c0', margin: 0, letterSpacing: '0.3px' }}>
              © Vinesh Thota
            </p>
            <p style={{ fontSize: '9px', color: '#9ab0c0', margin: 0, letterSpacing: '0.3px' }}>
              Certificate ID: {certificateId}
            </p>
          </div>

        </div>
      </div>
    );
  }
);

CertificateDisplay.displayName = 'CertificateDisplay';
