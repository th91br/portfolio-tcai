import React from 'react';
import { SERVICES_DATA } from '../../data/portfolioData';
import { FadeIn } from '../common/FadeIn';

export const ServicesSection: React.FC = () => {
  return (
    <section
      id="services"
      className="relative w-full bg-[#FFFFFF] text-[#050914] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 z-10 shadow-2xl"
    >
      <div className="max-w-5xl mx-auto w-full">
        {/* Heading */}
        <FadeIn delay={0} y={30} className="w-full text-center mb-16 sm:mb-20 md:mb-28">
          <h2
            className="text-[#050914] font-black uppercase tracking-tight leading-none text-center select-none"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            SERVIÇOS
          </h2>
        </FadeIn>

        {/* Service Items List */}
        <div className="flex flex-col border-t border-[rgba(5,9,20,0.12)]">
          {SERVICES_DATA.map((service, index) => (
            <FadeIn
              key={service.id}
              delay={index * 0.08}
              y={25}
              className="border-b border-[rgba(5,9,20,0.12)] py-8 sm:py-10 md:py-12 px-3 sm:px-6 rounded-2xl transition-all duration-300 hover:bg-[#0096F5]/[0.04] group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-12">
                {/* Huge Number with subtle blue hover matching TCA logo */}
                <div
                  className="font-black text-[#050914] group-hover:text-[#0096F5] leading-none select-none tracking-tight flex-shrink-0 transition-colors duration-300"
                  style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
                >
                  {service.number}
                </div>

                {/* Title & Description Stack */}
                <div className="flex flex-col gap-2 md:gap-3 flex-grow md:pl-4">
                  <h3
                    className="text-[#050914] group-hover:text-[#015EEF] font-bold uppercase tracking-tight transition-colors duration-200"
                    style={{ fontSize: 'clamp(1.15rem, 2.3vw, 2.1rem)' }}
                  >
                    {service.name}
                  </h3>
                  <p
                    className="text-[#1E293B] font-light leading-relaxed max-w-2xl text-sm sm:text-base md:text-lg"
                    style={{
                      opacity: 0.85,
                    }}
                  >
                    {service.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
