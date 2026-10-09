import { useEffect, useRef } from 'react';

/**
 * VOID MINER — Live Purple Space Background Animation System
 *
 * Visual hierarchy:
 * 1. Deep black cosmic base (#030108) with subtle radial vignetting
 * 2. Multi-layered drifting volumetric purple nebula clouds (#10051F, #8B2BFF, #B026FF)
 * 3. Flowing cosmic energy waves & rotating distant spiral galaxies
 * 4. Canvas 2D particle simulation:
 *    - Thousands of twinkling stars (multi-spectral white & soft lavender, varied depth & pulsation)
 *    - Floating cosmic dust / energy particles with smooth drift and glowing halos
 *    - Cinematic shooting stars with purple-to-white glowing tails and head sparks
 *    - Interactive 3D parallax depth responsive to pointer / device orientation
 *
 * Performance considerations:
 * - 60 FPS target with high-DPI scaling capped on mobile / low-power hardware
 * - Auto-pausing on document hidden (tab switch)
 * - Strict prefers-reduced-motion fallback
 * - Memory leak free: clean RAF loop and event listener destruction
 * - pointer-events: none across all layers
 */

// Tunable Configuration Constants
export const SPACE_CONFIG = {
  // Speed multiplier for star twinkles, particle drift, and celestial motion
  animationSpeed: 1.0,
  // Particle density factor: adjust to increase or decrease total counts
  particleDensity: 1.0,
  // Purple aesthetic intensity (0.0 to 1.5): affects nebula and particle vibrancy
  purpleIntensity: 1.0,
  // Shooting star interval bounds in milliseconds
  shootingStarIntervalMin: 3200,
  shootingStarIntervalMax: 7800,
};

interface Star {
  x: number;
  y: number;
  baseRadius: number;
  alpha: number;
  phase: number;
  twinkleSpeed: number;
  driftX: number;
  driftY: number;
  depth: number;
  colorType: 'white' | 'lavender' | 'electric' | 'gold';
}

interface CosmicDust {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  phase: number;
  pulseSpeed: number;
  driftX: number;
  driftY: number;
  depth: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  lifetime: number;
  tailLength: number;
  thickness: number;
}

interface DistantGalaxy {
  xRatio: number;
  yRatio: number;
  radius: number;
  angle: number;
  rotationSpeed: number;
  armCount: number;
  coreColor: string;
  armColor: string;
  alpha: number;
}

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const lowPowerQuery = window.matchMedia('(max-width: 768px), (pointer: coarse)');
    const finePointerQuery = window.matchMedia('(pointer: fine)');

    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let frameId = 0;
    let lastFrameTime = 0;
    let nextShootingStarTime = 0;

    // Smooth Parallax state
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    // Simulation collections
    let stars: Star[] = [];
    let cosmicDust: CosmicDust[] = [];
    const shootingStars: ShootingStar[] = [];
    let galaxies: DistantGalaxy[] = [];

    const initGalaxies = () => {
      // 2 subtle distant rotating spiral galaxies placed at atmospheric corners
      galaxies = [
        {
          xRatio: 0.18,
          yRatio: 0.22,
          radius: 95,
          angle: 0.4,
          rotationSpeed: 0.00035 * SPACE_CONFIG.animationSpeed,
          armCount: 2,
          coreColor: 'rgba(213, 179, 255, 0.45)',
          armColor: 'rgba(139, 43, 255, 0.22)',
          alpha: 0.38 * SPACE_CONFIG.purpleIntensity,
        },
        {
          xRatio: 0.84,
          yRatio: 0.68,
          radius: 125,
          angle: 2.1,
          rotationSpeed: -0.00028 * SPACE_CONFIG.animationSpeed,
          armCount: 3,
          coreColor: 'rgba(255, 255, 255, 0.35)',
          armColor: 'rgba(176, 38, 255, 0.18)',
          alpha: 0.32 * SPACE_CONFIG.purpleIntensity,
        },
      ];
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const isLowPower = lowPowerQuery.matches || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
      pixelRatio = Math.min(window.devicePixelRatio || 1, isLowPower ? 1.2 : 1.5);

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      // Star count scaling
      const baseArea = width * height;
      const starDensityDivisor = isLowPower ? 2000 : 750;
      const totalStars = Math.min(
        isLowPower ? 600 : 2600,
        Math.max(160, Math.floor((baseArea / starDensityDivisor) * SPACE_CONFIG.particleDensity))
      );

      // Dust count scaling
      const dustDensityDivisor = isLowPower ? 9000 : 6500;
      const totalDust = Math.min(
        isLowPower ? 45 : 170,
        Math.max(25, Math.floor((baseArea / dustDensityDivisor) * SPACE_CONFIG.particleDensity))
      );

      // Populate stars
      stars = Array.from({ length: totalStars }, () => {
        const depth = randomBetween(0.15, 1);
        const randType = Math.random();
        let colorType: Star['colorType'] = 'white';
        if (randType < 0.28) colorType = 'lavender';
        else if (randType < 0.38) colorType = 'electric';
        else if (randType < 0.42) colorType = 'gold';

        // Deep background stars are smaller; foreground stars can have slight glare
        const baseRadius = (depth < 0.4 ? randomBetween(0.35, 0.8) : randomBetween(0.65, 1.45)) *
          (Math.random() < 0.04 ? 1.55 : 1);

        return {
          x: Math.random() * width,
          y: Math.random() * height,
          baseRadius,
          alpha: randomBetween(0.2, 0.95),
          phase: randomBetween(0, Math.PI * 2),
          twinkleSpeed: randomBetween(0.4, 2.2) * SPACE_CONFIG.animationSpeed,
          driftX: randomBetween(-1.2, 1.2) * depth * SPACE_CONFIG.animationSpeed,
          driftY: randomBetween(-0.8, 0.8) * depth * SPACE_CONFIG.animationSpeed,
          depth,
          colorType,
        };
      });

      // Populate cosmic dust
      const dustColors = [
        '#8B2BFF', // Neon purple
        '#B026FF', // Electric violet
        '#D5B3FF', // Soft lavender
        '#7B19FF', // Deep ultraviolet
      ];

      cosmicDust = Array.from({ length: totalDust }, () => {
        const depth = randomBetween(0.3, 1.2);
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          radius: randomBetween(0.8, 2.4),
          alpha: randomBetween(0.12, 0.38) * SPACE_CONFIG.purpleIntensity,
          phase: randomBetween(0, Math.PI * 2),
          pulseSpeed: randomBetween(0.3, 1.1) * SPACE_CONFIG.animationSpeed,
          driftX: randomBetween(-2.8, 2.8) * SPACE_CONFIG.animationSpeed,
          driftY: randomBetween(-3.2, 1.8) * SPACE_CONFIG.animationSpeed,
          depth,
          color: dustColors[Math.floor(Math.random() * dustColors.length)],
        };
      });

      shootingStars.length = 0;
      nextShootingStarTime = performance.now() + randomBetween(
        SPACE_CONFIG.shootingStarIntervalMin,
        SPACE_CONFIG.shootingStarIntervalMax
      );

      initGalaxies();
      renderFrame(0, 0, false);
    };

    // Draw rotating distant spiral galaxy onto the Canvas
    const drawGalaxy = (galaxy: DistantGalaxy, deltaSeconds: number, animate: boolean) => {
      if (animate) {
        galaxy.angle += galaxy.rotationSpeed;
      }

      const gx = galaxy.xRatio * width + currentParallaxX * 0.15;
      const gy = galaxy.yRatio * height + currentParallaxY * 0.15;

      ctx.save();
      ctx.translate(gx, gy);
      ctx.rotate(galaxy.angle);

      // Core glow
      const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, galaxy.radius * 0.65);
      coreGrad.addColorStop(0, galaxy.coreColor);
      coreGrad.addColorStop(0.3, galaxy.armColor);
      coreGrad.addColorStop(1, 'rgba(16, 5, 31, 0)');

      ctx.globalAlpha = galaxy.alpha;
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, galaxy.radius, galaxy.radius * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();

      // Spiral arms made of soft micro-particles
      const armSteps = 28;
      for (let arm = 0; arm < galaxy.armCount; arm++) {
        const armOffset = (arm * Math.PI * 2) / galaxy.armCount;
        for (let i = 0; i < armSteps; i++) {
          const t = i / armSteps;
          const r = t * galaxy.radius;
          const theta = armOffset + t * 2.8;
          const px = Math.cos(theta) * r;
          const py = Math.sin(theta) * (r * 0.45);
          const pAlpha = (1 - t) * 0.28 * galaxy.alpha;

          ctx.fillStyle = i % 2 === 0 ? '#D5B3FF' : '#B026FF';
          ctx.globalAlpha = pAlpha;
          ctx.beginPath();
          ctx.arc(px, py, 0.75 + (1 - t) * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    };

    const renderFrame = (time: number, deltaSeconds: number, animate: boolean) => {
      ctx.clearRect(0, 0, width, height);

      if (animate) {
        // Smooth lerping of parallax
        currentParallaxX += (targetParallaxX - currentParallaxX) * 0.04;
        currentParallaxY += (targetParallaxY - currentParallaxY) * 0.04;
      }

      // 1. Draw Distant Spiral Galaxies
      for (const galaxy of galaxies) {
        drawGalaxy(galaxy, deltaSeconds, animate);
      }

      // 2. Draw Twinkling Stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        if (animate) {
          star.x += star.driftX * deltaSeconds;
          star.y += star.driftY * deltaSeconds;

          // Wrap edges
          if (star.x < 0) star.x = width;
          else if (star.x > width) star.x = 0;
          if (star.y < 0) star.y = height;
          else if (star.y > height) star.y = 0;

          star.phase += star.twinkleSpeed * deltaSeconds;
        }

        const twinkle = animate ? 0.65 + Math.sin(star.phase) * 0.35 : 0.85;
        const finalAlpha = Math.max(0.08, Math.min(1, star.alpha * twinkle));
        const px = star.x + currentParallaxX * star.depth;
        const py = star.y + currentParallaxY * star.depth;

        let fillStyle = '#FFFFFF';
        if (star.colorType === 'lavender') fillStyle = '#D5B3FF';
        else if (star.colorType === 'electric') fillStyle = '#B026FF';
        else if (star.colorType === 'gold') fillStyle = '#FFF2D6';

        ctx.globalAlpha = finalAlpha;
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.arc(px, py, star.baseRadius, 0, Math.PI * 2);
        ctx.fill();

        // Foreground bright stars get a delicate cross diffraction spike / soft corona
        if (star.baseRadius > 1.3 && finalAlpha > 0.6) {
          ctx.globalAlpha = finalAlpha * 0.28;
          ctx.fillStyle = '#D5B3FF';
          ctx.beginPath();
          ctx.arc(px, py, star.baseRadius * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. Draw Floating Cosmic Dust Particles
      for (let i = 0; i < cosmicDust.length; i++) {
        const dust = cosmicDust[i];

        if (animate) {
          dust.x += dust.driftX * deltaSeconds;
          dust.y += dust.driftY * deltaSeconds;

          if (dust.x < -8) dust.x = width + 8;
          else if (dust.x > width + 8) dust.x = -8;
          if (dust.y < -8) dust.y = height + 8;
          else if (dust.y > height + 8) dust.y = -8;

          dust.phase += dust.pulseSpeed * deltaSeconds;
        }

        const pulse = 0.55 + Math.sin(dust.phase) * 0.45;
        const px = dust.x + currentParallaxX * dust.depth;
        const py = dust.y + currentParallaxY * dust.depth;
        const currentAlpha = dust.alpha * pulse;

        // Soft particle halo
        const haloGrad = ctx.createRadialGradient(px, py, 0, px, py, dust.radius * 2.8);
        haloGrad.addColorStop(0, dust.color);
        haloGrad.addColorStop(1, 'transparent');

        ctx.globalAlpha = currentAlpha;
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(px, py, dust.radius * 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Particle core
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = Math.min(1, currentAlpha * 1.6);
        ctx.beginPath();
        ctx.arc(px, py, dust.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Draw Shooting Stars with glowing trails
      if (animate) {
        if (time >= nextShootingStarTime && shootingStars.length < 2) {
          // Launch trajectory across the upper / middle space quadrant
          const startX = randomBetween(-width * 0.08, width * 0.7);
          const startY = randomBetween(0, height * 0.45);
          const speed = randomBetween(780, 1180) * SPACE_CONFIG.animationSpeed;
          const angle = randomBetween(0.28, 0.48); // ~16 to ~27 degrees downwards slant
          const vx = Math.cos(angle) * speed;
          const vy = Math.sin(angle) * speed;

          shootingStars.push({
            x: startX,
            y: startY,
            vx,
            vy,
            age: 0,
            lifetime: randomBetween(650, 950),
            tailLength: randomBetween(210, 320),
            thickness: randomBetween(1.6, 2.4),
          });

          nextShootingStarTime = time + randomBetween(
            SPACE_CONFIG.shootingStarIntervalMin,
            SPACE_CONFIG.shootingStarIntervalMax
          );
        }

        for (let i = shootingStars.length - 1; i >= 0; i--) {
          const s = shootingStars[i];
          s.age += deltaSeconds * 1000;
          s.x += s.vx * deltaSeconds;
          s.y += s.vy * deltaSeconds;

          const progress = s.age / s.lifetime;
          if (progress >= 1) {
            shootingStars.splice(i, 1);
            continue;
          }

          // Bell curve opacity
          const opacity = Math.sin(Math.PI * progress);
          const speed = Math.hypot(s.vx, s.vy);
          const dirX = s.vx / speed;
          const dirY = s.vy / speed;

          const tailX = s.x - dirX * s.tailLength;
          const tailY = s.y - dirY * s.tailLength;

          // Trail gradient: transparent -> electric violet -> bright neon purple -> white hot head
          const trailGrad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
          trailGrad.addColorStop(0, 'rgba(139, 43, 255, 0)');
          trailGrad.addColorStop(0.4, `rgba(139, 43, 255, ${0.28 * opacity})`);
          trailGrad.addColorStop(0.8, `rgba(176, 38, 255, ${0.75 * opacity})`);
          trailGrad.addColorStop(1, `rgba(255, 255, 255, ${0.98 * opacity})`);

          ctx.save();
          ctx.globalAlpha = 1;
          ctx.strokeStyle = trailGrad;
          ctx.lineWidth = s.thickness;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(s.x, s.y);
          ctx.stroke();

          // Shooting star head spark & subtle halo
          const headGlow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 7);
          headGlow.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
          headGlow.addColorStop(0.4, `rgba(176, 38, 255, ${0.8 * opacity})`);
          headGlow.addColorStop(1, 'transparent');

          ctx.fillStyle = headGlow;
          ctx.beginPath();
          ctx.arc(s.x, s.y, 7, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      }

      ctx.globalAlpha = 1;
    };

    const animate = (time: number) => {
      frameId = 0;
      const deltaSeconds = lastFrameTime ? Math.min((time - lastFrameTime) / 1000, 0.05) : 0;
      lastFrameTime = time;

      renderFrame(time, deltaSeconds, true);

      if (!document.hidden && !reducedMotionQuery.matches) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    const startLoop = () => {
      if (frameId || document.hidden || reducedMotionQuery.matches) return;
      lastFrameTime = 0;
      frameId = window.requestAnimationFrame(animate);
    };

    const stopLoop = () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = 0;
      lastFrameTime = 0;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      } else if (reducedMotionQuery.matches) {
        renderFrame(0, 0, false);
      } else {
        startLoop();
      }
    };

    const handleMotionChange = () => {
      stopLoop();
      if (reducedMotionQuery.matches) {
        renderFrame(0, 0, false);
      } else {
        startLoop();
      }
    };

    // Parallax pointer tracking
    const handlePointerMove = (e: PointerEvent) => {
      const normX = (e.clientX / width) * 2 - 1;
      const normY = (e.clientY / height) * 2 - 1;
      targetParallaxX = normX * 14;
      targetParallaxY = normY * 10;
    };

    const handlePointerLeave = () => {
      targetParallaxX = 0;
      targetParallaxY = 0;
    };

    // Device orientation for mobile parallax
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        const tiltX = Math.max(-30, Math.min(30, e.gamma)) / 30;
        const tiltY = Math.max(-30, Math.min(30, e.beta - 40)) / 30;
        targetParallaxX = tiltX * 12;
        targetParallaxY = tiltY * 8;
      }
    };

    resize();
    if (!reducedMotionQuery.matches) {
      startLoop();
    }

    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    reducedMotionQuery.addEventListener('change', handleMotionChange);

    if (finePointerQuery.matches) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('blur', handlePointerLeave);
      document.body.addEventListener('pointerleave', handlePointerLeave);
    } else {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    }

    return () => {
      stopLoop();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reducedMotionQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('blur', handlePointerLeave);
      document.body.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return (
    <div className="void-miner-background" aria-hidden="true">
      {/* Layer 1: Deep cosmic base & vignette gradient */}
      <div className="space-cosmic-base" />

      {/* Layer 2: Volumetric purple nebula clouds */}
      <div className="space-nebula nebula-cloud-1" />
      <div className="space-nebula nebula-cloud-2" />
      <div className="space-nebula nebula-cloud-3" />
      <div className="space-nebula nebula-cloud-4" />

      {/* Layer 3: Cosmic energy waves & ethereal galactic rays */}
      <div className="space-energy-waves waves-primary" />
      <div className="space-energy-waves waves-secondary" />

      {/* Layer 4: Central atmospheric purple glow (behind hero logo section) */}
      <div className="space-hero-atmosphere" />

      {/* Layer 5: Canvas 2D Particle Engine (Stars, Dust, Shooting Stars, Distant Galaxies) */}
      <canvas ref={canvasRef} className="space-canvas" />

      {/* Layer 6: Subtle depth vignette overlay */}
      <div className="space-vignette" />
    </div>
  );
}

export default SpaceBackground;
