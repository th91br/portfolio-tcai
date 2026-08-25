import React from 'react';
import { ABOUT_DECORATIVE_ASSETS, ABOUT_DATA } from '../../data/portfolioData';
import { FadeIn } from '../common/FadeIn';
import { AnimatedText } from '../common/AnimatedText';
import { ContactButton } from '../common/ContactButton';

interface AboutSectionProps {
  onContactClick: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onContactClick }) => {
  return (
    <section
      id="about"
      className="relative min-h-screen w-full bg-[#050914] flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-24 sm:py-32 overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00D2F6]/5 blur-[160px] pointer-events-none rounded-full" />
      {/* 4 Floating 3D Decorative Corner Elements */}
      {ABOUT_DECORATIVE_ASSETS.map((asset) => (
        <FadeIn
          key={asset.id}
          delay={asset.delay}
          duration={asset.duration}
          x={asset.x}
          y={asset.y}
          className={`absolute ${asset.positionClasses} ${asset.widthClasses} pointer-events-none z-10 select-none`}
        >
          <img
            src={asset.src}
            alt={asset.alt}
            className="w-full h-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
            loading="lazy"
            draggable={false}
          />
        </FadeIn>
      ))}

      {/* Main Content Column */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-4xl mx-auto w-full">
        {/* Heading */}
        <FadeIn delay={0} y={40} className="w-full">
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight text-center select-none"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            {ABOUT_DATA.heading}
          </h2>
        </FadeIn>

        {/* Vertical gap between heading & text */}
        <div className="h-10 sm:h-14 md:h-16" />

        {/* Scrubbed character-by-character animated paragraph */}
        <AnimatedText
          text={ABOUT_DATA.text}
          className="px-4 max-w-[680px]"
        />

        {/* Vertical gap between text block & button */}
        <div className="h-14 sm:h-18 md:h-20" />

        {/* Contact Button */}
        <FadeIn delay={0.2} y={20}>
          <ContactButton
            label={ABOUT_DATA.ctaButton}
            onClick={onContactClick}
          />
        </FadeIn>
      </div>
    </section>
  );
};
