import React from 'react';
import { motion } from 'framer-motion';
import { METRICS_DATA } from '../../data/portfolioData';

export const MetricsBar: React.FC = () => {
  return (
    <section className="relative w-full bg-[#080D18] border-y border-[#151F38] py-8 sm:py-10 px-4 sm:px-6 md:px-10 z-20">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 lg:divide-x divide-[#151F38]">
          {METRICS_DATA.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center px-4 pt-4 sm:pt-0"
            >
              <div className="font-kanit font-black text-2xl sm:text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#00D2F6] via-[#0096F5] to-white mb-1 tracking-tight">
                {item.value}
              </div>
              <div className="text-xs sm:text-sm text-[#AEB7C4] font-light max-w-[200px]">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
