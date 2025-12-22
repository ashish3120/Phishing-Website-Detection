
import React, { useEffect, useRef } from 'react';

const LiquidBackground: React.FC = () => {
  // We use the existing canvas element in the DOM as per the template
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const initAnimation = async () => {
      try {
        const { default: LiquidBackgroundLib } = await import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.27/build/backgrounds/liquid1.min.js' as any);

        // STRICT IMPLEMENTATION OF USER TEMPLATE
        const app = LiquidBackgroundLib(canvas);
        app.loadImage('/liquid.png');
        app.liquidPlane.material.metalness = 0.75;
        app.liquidPlane.material.roughness = 0.25;
        app.liquidPlane.uniforms.displacementScale.value = 5;
        app.setRain(false);

        initialized.current = true;

        const handleResize = () => {
          if (app.renderer) {
            app.renderer.setSize(window.innerWidth, window.innerHeight);
          }
        };
        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
        };
      } catch (err) {
        console.error("Failed to load liquid animation:", err);
      }
    };

    initAnimation();
  }, []);

  return null; // The canvas is already in index.html
};

export default LiquidBackground;
