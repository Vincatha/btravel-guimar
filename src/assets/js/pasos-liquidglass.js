import React from 'react';
import { createRoot } from 'react-dom/client';
import { LiquidGlassCard } from '@ogtirth/liquid-glass-oss';

// React owns only the decorative surface; Eleventy retains accessible content.
for (const host of document.querySelectorAll('[data-glass-pasos]')) {
  const transparency = matchMedia('(prefers-reduced-transparency: reduce)');
  let root;
  let visible = false;
  const sync = () => {
    const enabled = visible && !document.hidden && !transparency.matches;
    if (enabled && !root) {
      root = createRoot(host);
      root.render(React.createElement(LiquidGlassCard, {
        backgroundImage: '/assets/img/home/avion-panoramico.png',
        variant: 'dark',
        className: 'pasos-lente',
        draggable: false,
        settings: {
          radius: 24, blur: .22, refraction: .32, depth: 24,
          chromaticAberration: .012, distortion: .004,
          edgeHighlight: .3, specular: .42, fresnel: .85,
          darkTint: .18, tintStrength: .1, tintColor: [.75, .86, 1],
          opacity: .94, shadow: .12, bevel: 0
        }
      }));
    } else if (!enabled && root) {
      root.unmount();
      root = undefined;
    }
  };
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }, { rootMargin: '80px' }).observe(host);
  document.addEventListener('visibilitychange', sync);
  transparency.addEventListener('change', sync);
}
