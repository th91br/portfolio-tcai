import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { DiagnosticOption } from '../../services/diagnostic/diagnosticConfig';

interface DiagnosticStepCardProps {
  options: DiagnosticOption[];
  selectedId?: string;
  onSelect: (option: DiagnosticOption) => void;
}

export const DiagnosticStepCard: React.FC<DiagnosticStepCardProps> = ({
  options,
  selectedId,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
      {options.map((option, idx) => {
        const isSelected = selectedId === option.id;

        return (
          <motion.button
            key={option.id}
            type="button"
            onClick={() => onSelect(option)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.04 }}
            className={`group relative text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D2F6] ${
              isSelected
                ? 'bg-gradient-to-br from-[#00D2F6]/15 via-[#0A1D33] to-[#07111F] border-[#00D2F6] shadow-[0_0_24px_rgba(0,210,246,0.22)]'
                : 'bg-[#091524]/75 hover:bg-[#0E2036] border-white/[0.08] hover:border-[#00D2F6]/40 shadow-sm'
            }`}
          >
            {/* Header com indicador customizado */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <span
                className={`font-kanit font-semibold text-sm sm:text-base transition-colors leading-snug ${
                  isSelected ? 'text-white' : 'text-[#F1F5F9] group-hover:text-white'
                }`}
              >
                {option.label}
              </span>

              <div
                className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center transition-all duration-300 mt-0.5 border ${
                  isSelected
                    ? 'bg-[#00D2F6] border-[#00D2F6] text-[#07111F]'
                    : 'border-white/20 group-hover:border-[#00D2F6]/60 bg-white/[0.03]'
                }`}
              >
                {isSelected ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <ArrowRight className="w-2.5 h-2.5 text-white/30 group-hover:text-[#00D2F6] opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            </div>

            {/* Descrição detalhada */}
            {option.description && (
              <p
                className={`text-xs sm:text-[13px] font-light leading-relaxed mt-1 transition-colors ${
                  isSelected ? 'text-[#93C5FD]' : 'text-[#94A3B8] group-hover:text-[#CBD5E1]'
                }`}
              >
                {option.description}
              </p>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};
