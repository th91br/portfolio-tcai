import React, { useEffect, useRef } from 'react';
import { Renderer, Camera, Transform, Program, Mesh, Plane, Texture, Flowmap } from 'ogl';
import { HERO_DATA } from '../../data/portfolioData';

const vertexShader = `
attribute vec2 uv;
attribute vec3 position;
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;
uniform sampler2D tMap;
uniform sampler2D tFlow;
uniform float uTime;
uniform float uAspect;
varying vec2 vUv;

// Brand color palette tokens
const vec3 COLOR_CYAN       = vec3(0.000, 0.824, 0.965); // #00D2F6
const vec3 COLOR_LIGHT_BLUE = vec3(0.000, 0.588, 0.961); // #0096F5
const vec3 COLOR_BLUE       = vec3(0.004, 0.369, 0.937); // #015EEF
const vec3 COLOR_TEXT       = vec3(0.953, 0.961, 0.969); // #F3F5F7

void main() {
    // Sample fluid velocity from OGL Flowmap
    vec4 flow = texture2D(tFlow, vUv);
    float flowMag = length(flow.xy);
    
    // Smooth fluid displacement
    vec2 flowDir = flow.xy * 0.16;
    vec2 baseUv = vUv - flowDir;
    
    // Multi-sample brand chromatic split in cyan, core, and deep blue
    vec4 sampleLead  = texture2D(tMap, baseUv - flow.xy * 0.045);
    vec4 sampleCore  = texture2D(tMap, baseUv);
    vec4 sampleTrail = texture2D(tMap, baseUv + flow.xy * 0.045);
    
    float coreAlpha = sampleCore.a;
    float maxAlpha = max(coreAlpha, max(sampleLead.a, sampleTrail.a));
    if (maxAlpha < 0.002) {
        discard;
    }
    
    // Core text with subtle brand luminance
    vec3 baseText = mix(COLOR_TEXT, COLOR_CYAN, (1.0 - vUv.y) * 0.18) * sampleCore.rgb;
    
    // Fluid chromatic refractions in pure brand palette
    vec3 chromaticEffect = sampleLead.a * COLOR_CYAN * 0.9
                         + sampleTrail.a * COLOR_BLUE * 0.9;
                         
    // Luminous cyan & electric blue glow along velocity field
    vec3 velocityGlow = COLOR_CYAN * flowMag * 2.4 + COLOR_LIGHT_BLUE * (flowMag * flowMag) * 1.6;
    
    // Blend core text with fluid highlights
    vec3 finalRgb = mix(chromaticEffect, baseText + velocityGlow, coreAlpha);
    finalRgb += velocityGlow * maxAlpha * 0.45;
    
    gl_FragColor = vec4(finalRgb, maxAlpha);
}
`;

export const OglHeroTitle: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Setup OGL Renderer
    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });

    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.className = 'w-full h-full block select-none pointer-events-auto';
    container.appendChild(canvas);

    // 2. Camera & Scene
    const camera = new Camera(gl);
    const scene = new Transform();

    // 3. Flowmap (Fluid velocity simulation)
    const flowmap = new Flowmap(gl, {
      falloff: 0.28,
      dissipation: 0.93,
      alpha: 0.75,
    });

    // 4. Create High-Resolution Text Texture
    const textCanvas = document.createElement('canvas');
    const textCtx = textCanvas.getContext('2d', { willReadFrequently: true });
    const texture = new Texture(gl, {
      generateMipmaps: false,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
    });

    const updateTextTexture = (width: number, height: number) => {
      if (!textCtx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      textCanvas.width = width * dpr;
      textCanvas.height = height * dpr;

      textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
      textCtx.save();
      textCtx.scale(dpr, dpr);

      // Responsive font sizing
      const baseFontSize = Math.max(28, Math.min(width * 0.082, 130));
      textCtx.font = `900 ${baseFontSize}px 'Kanit', sans-serif`;
      textCtx.textAlign = 'center';
      textCtx.textBaseline = 'middle';

      // Crisp typographic fill with subtle vertical metallic gradient
      const gradient = textCtx.createLinearGradient(0, height * 0.15, 0, height * 0.85);
      gradient.addColorStop(0, '#FFFFFF');
      gradient.addColorStop(0.5, '#F3F5F7');
      gradient.addColorStop(1, '#CBE8F9');
      textCtx.fillStyle = gradient;
      textCtx.shadowColor = 'rgba(0, 210, 246, 0.5)';
      textCtx.shadowBlur = 20;
      textCtx.shadowOffsetY = 4;

      textCtx.fillText(HERO_DATA.title, width / 2, height / 2);
      textCtx.restore();

      texture.image = textCanvas;
      texture.needsUpdate = true;
    };

    // 5. Plane Geometry & Shading Program
    const geometry = new Plane(gl, { width: 2, height: 2 });
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        tMap: { value: texture },
        tFlow: flowmap.uniform,
        uTime: { value: 0 },
        uAspect: { value: 1 },
      },
      transparent: true,
      depthTest: false,
    });

    const mesh = new Mesh(gl, { geometry, program });
    mesh.setParent(scene);

    // 6. Resize Handler
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;

      renderer.setSize(w, h);
      flowmap.aspect = w / h;
      program.uniforms.uAspect.value = w / h;
      updateTextTexture(w, h);
    };

    // Ensure fonts are loaded before initial texture render
    document.fonts.ready.then(() => {
      handleResize();
    });
    window.addEventListener('resize', handleResize);

    // 7. Mouse & Touch Interaction
    let lastTime = performance.now();
    const mouse = { x: 0.5, y: 0.5 };
    const lastMouse = { x: 0.5, y: 0.5 };
    const velocity = { x: 0, y: 0 };
    let hasInteracted = false;

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      mouse.x = (clientX - rect.left) / rect.width;
      mouse.y = 1.0 - (clientY - rect.top) / rect.height;

      if (!hasInteracted) {
        lastMouse.x = mouse.x;
        lastMouse.y = mouse.y;
        hasInteracted = true;
      }
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });

    // 8. Animation Render Loop
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.016;

      const now = performance.now();
      const delta = Math.max(1, now - lastTime);
      lastTime = now;

      // Calculate smooth velocity
      velocity.x = (mouse.x - lastMouse.x) / (delta * 0.001);
      velocity.y = (mouse.y - lastMouse.y) / (delta * 0.001);

      lastMouse.x = mouse.x;
      lastMouse.y = mouse.y;

      // Update flowmap with current mouse & velocity
      flowmap.mouse.set(mouse.x, mouse.y);
      flowmap.velocity.set(velocity.x * 0.04, velocity.y * 0.04);
      flowmap.update();

      // Render main scene
      program.uniforms.uTime.value = time;
      renderer.render({ scene, camera });
    };

    animate();

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-24 sm:h-28 md:h-36 lg:h-44 relative flex items-center justify-center select-none"
    >
      <span className="sr-only">{HERO_DATA.title}</span>
    </div>
  );
};
