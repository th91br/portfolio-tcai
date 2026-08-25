import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { HERO_PORTRAIT_URL, HERO_DATA } from '../../data/portfolioData';
import { ContactButton } from '../common/ContactButton';
import { Magnet } from '../common/Magnet';
import { ThreeHeroCanvas } from '../common/ThreeHeroCanvas';

gsap.registerPlugin(useGSAP);

interface HeroSectionProps {
  onContactClick: () => void;
  onNavigate?: (sectionId: string) => void;
}

const GLYPHS = '01#$<>[]*+~=/_!?;:';

function scrambleText(el: HTMLElement, targetText: string, delay: number = 0) {
  if (targetText === ' ' || !targetText) return;
  let frame = 0;
  const maxFrames = 7;
  const interval = 40;

  setTimeout(() => {
    const timer = setInterval(() => {
      if (frame >= maxFrames) {
        el.textContent = targetText;
        clearInterval(timer);
      } else {
        el.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        frame++;
      }
    }, interval);
  }, delay * 1000);
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onContactClick,
  onNavigate,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: 'SOBRE', href: '#about' },
    { label: 'SERVIÇOS', href: '#services' },
    { label: 'PROJETOS', href: '#projects' },
    { label: 'CONTATO', href: '#contact', isAction: true },
  ];

  const words = HERO_DATA.title.split(' ');

  useGSAP(
    () => {
      const chars = titleContainerRef.current?.querySelectorAll<HTMLElement>('.gsap-char');
      if (!chars || chars.length === 0) return;

      // 1. Initial 3D Stagger Entrance with Scramble Decoder
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.fromTo(
        chars,
        {
          yPercent: 120,
          rotateX: -85,
          opacity: 0,
          filter: 'blur(8px)',
        },
        {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.1,
          stagger: 0.035,
          delay: 0.2,
          onStart: () => {
            chars.forEach((charEl, idx) => {
              const originalChar = charEl.getAttribute('data-char') || charEl.textContent || '';
              scrambleText(charEl, originalChar, idx * 0.025);
            });
          },
        }
      );

      // 2. Interactive 3D Mouse & Touch Proximity Wave
      const processCharProximity = (clientX: number, clientY: number) => {
        chars.forEach((charEl) => {
          const rect = charEl.getBoundingClientRect();
          const charCenterX = rect.left + rect.width / 2;
          const charCenterY = rect.top + rect.height / 2;

          const distX = clientX - charCenterX;
          const distY = clientY - charCenterY;
          const dist = Math.sqrt(distX * distX + distY * distY);
          const maxDist = 220;

          if (dist < maxDist) {
            const power = 1 - dist / maxDist;
            const lift = power * -14;
            const rotY = (distX / maxDist) * 18;
            const rotX = -(distY / maxDist) * 18;

            gsap.to(charEl, {
              y: lift,
              rotateX: rotX,
              rotateY: rotY,
              color: '#00D2F6',
              textShadow: '0 0 20px rgba(0, 210, 246, 0.8), 0 0 40px rgba(0, 150, 245, 0.5)',
              duration: 0.25,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          } else {
            gsap.to(charEl, {
              y: 0,
              rotateX: 0,
              rotateY: 0,
              color: '#F3F5F7',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
              duration: 0.6,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          }
        });
      };

      const handleMouseMove = (e: MouseEvent) => {
        processCharProximity(e.clientX, e.clientY);
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches && e.touches[0]) {
          processCharProximity(e.touches[0].clientX, e.touches[0].clientY);
        }
      };

      const handleTouchStart = (e: TouchEvent) => {
        if (e.touches && e.touches[0]) {
          processCharProximity(e.touches[0].clientX, e.touches[0].clientY);
        }
      };

      const handleTouchEnd = () => {
        chars.forEach((charEl) => {
          gsap.to(charEl, {
            y: 0,
            rotateX: 0,
            rotateY: 0,
            color: '#F3F5F7',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
            duration: 0.6,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        });
      };

      const sectionEl = sectionRef.current;
      if (sectionEl) {
        sectionEl.addEventListener('mousemove', handleMouseMove, { passive: true });
        sectionEl.addEventListener('touchmove', handleTouchMove, { passive: true });
        sectionEl.addEventListener('touchstart', handleTouchStart, { passive: true });
        sectionEl.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
          sectionEl.removeEventListener('mousemove', handleMouseMove);
          sectionEl.removeEventListener('touchmove', handleTouchMove);
          sectionEl.removeEventListener('touchstart', handleTouchStart);
          sectionEl.removeEventListener('touchend', handleTouchEnd);
        };
      }
    },
    { scope: sectionRef }
  );

  const handleTitleHover = () => {
    const chars = titleContainerRef.current?.querySelectorAll<HTMLElement>('.gsap-char');
    if (!chars) return;
    chars.forEach((charEl, idx) => {
      const originalChar = charEl.getAttribute('data-char') || charEl.textContent || '';
      scrambleText(charEl, originalChar, idx * 0.02);
      gsap.fromTo(
        charEl,
        { scale: 1.1, color: '#00D2F6' },
        { scale: 1, color: '#F3F5F7', duration: 0.45, ease: 'power2.out' }
      );
    });
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: { label: string; href: string; isAction?: boolean }
  ) => {
    e.preventDefault();
    if (item.isAction) {
      onContactClick();
    } else {
      const target = document.querySelector(item.href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      if (onNavigate) {
        onNavigate(item.href.replace('#', ''));
      }
    }
  };

  return (
    <section ref={sectionRef} className="relative h-screen w-full flex flex-col justify-between overflow-x-clip bg-[#050914]">
      {/* 0. Three.js Interactive 3D Cyber Atmosphere Canvas (z-0) */}
      <ThreeHeroCanvas />

      {/* 1. Navbar (z-40 so links are always clickable at the top) */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full flex items-center justify-between px-4 sm:px-8 md:px-10 pt-5 sm:pt-7 md:pt-8 z-40 relative max-w-7xl mx-auto"
      >
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={(e) => handleNavClick(e, link)}
            className="text-[#F3F5F7] font-medium uppercase tracking-wider text-xs sm:text-sm md:text-lg lg:text-[1.35rem] hover:text-[#00D2F6] transition-colors duration-200 cursor-pointer py-1.5 px-1 sm:px-2 rounded-lg"
          >
            {link.label}
          </a>
        ))}
      </motion.nav>

      {/* 2. Hero Heading with Interactive GSAP 3D Typography (z-10, behind avatar) */}
      <div
        ref={titleContainerRef}
        onMouseEnter={handleTitleHover}
        onTouchStart={handleTitleHover}
        className="absolute top-0 inset-x-0 pt-16 sm:pt-20 md:pt-24 px-4 w-full overflow-hidden text-center z-10 select-none pointer-events-auto cursor-pointer"
        style={{ perspective: '1000px' }}
      >
        <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[5.2vw] sm:text-[6.2vw] md:text-[7.2vw] lg:text-[8.2vw] select-none inline-flex items-center justify-center gap-x-[0.25em]">
          {words.map((word, wordIdx) => (
            <span key={wordIdx} className="inline-block whitespace-nowrap overflow-hidden py-2">
              {word.split('').map((char, charIdx) => (
                <span
                  key={charIdx}
                  data-char={char}
                  className="gsap-char inline-block will-change-transform origin-bottom text-[#F3F5F7] font-black cursor-pointer transition-colors duration-150"
                  style={{
                    textShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
                  }}
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </h1>
      </div>

      {/* 3. Hero Portrait (z-20, in front of the heading z-10) */}
      <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center pt-28 sm:pt-32 md:pt-36 lg:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="pointer-events-auto"
        >
          <Magnet
            padding={150}
            strength={3}
            activeTransition="transform 0.3s ease-out"
            inactiveTransition="transform 0.6s ease-in-out"
            className="flex justify-center items-center relative"
          >
            {/* Subtle ambient back glow */}
            <div className="absolute inset-0 bg-[#00D2F6]/15 blur-3xl rounded-full scale-90 -z-10 pointer-events-none" />
            <img
              src={HERO_PORTRAIT_URL}
              alt="Thiago Cassol Antunes"
              className="w-[280px] sm:w-[360px] md:w-[440px] lg:w-[510px] xl:w-[550px] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.95)] pointer-events-auto select-none"
              loading="eager"
              draggable={false}
            />
          </Magnet>
        </motion.div>
      </div>

      {/* 4. Bottom Bar (z-30) */}
      <div className="w-full flex justify-between items-end pb-7 sm:pb-8 md:pb-10 px-6 md:px-10 z-30 relative">
        {/* Left Strategic Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-[#AEB7C4] font-light uppercase tracking-wide leading-snug max-w-[190px] sm:max-w-[260px] md:max-w-[320px]"
          style={{ fontSize: 'clamp(0.75rem, 1.2vw, 1.25rem)' }}
        >
          {HERO_DATA.tagline}
        </motion.p>

        {/* Right Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <ContactButton
            label={HERO_DATA.ctaButton}
            onClick={onContactClick}
          />
        </motion.div>
      </div>
    </section>
  );
};
