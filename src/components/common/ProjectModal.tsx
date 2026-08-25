import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Sparkles, Layers, Check } from 'lucide-react';
import { ProjectItem } from '../../types';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!project) return null;

  const images = [project.col1TopImage, project.col1BottomImage, project.col2Image];
  const currentPreview = activeImage || project.col2Image;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative w-full max-w-4xl bg-[#080D18] border border-[#151F38] rounded-3xl overflow-hidden shadow-2xl z-10 text-[#F3F5F7] flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#151F38] bg-[#050914]/80">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#00D2F6]/15 border border-[#00D2F6]/40 text-[#00D2F6] uppercase tracking-wider">
                {project.category}
              </span>
              <h2 className="text-xl font-bold uppercase tracking-tight text-white">
                {project.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Fechar modal de projeto"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Main Stage Image with Browser Frame */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-[#151F38] bg-[#050914] flex flex-col shadow-2xl group">
              {/* Browser Bar */}
              <div className="w-full bg-[#080D18] px-4 py-2 border-b border-[#151F38] flex items-center justify-between select-none">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80" />
                </div>
                <span className="text-xs font-mono text-[#00D2F6] truncate">
                  {project.liveUrl}
                </span>
                <span className="text-[11px] font-mono text-[#AEB7C4] uppercase">
                  1440 × 900 HD
                </span>
              </div>

              <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#050914]">
                <img
                  src={currentPreview}
                  alt={project.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </div>

            {/* Thumbnail Selectors */}
            <div className="grid grid-cols-3 gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    currentPreview === img
                      ? 'border-[#00D2F6] ring-2 ring-[#00D2F6]/30 scale-[1.02]'
                      : 'border-[#151F38] hover:border-[#0096F5] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Prévia ${idx + 1}`}
                    className="w-full h-full object-cover object-top"
                  />
                </button>
              ))}
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="md:col-span-2 space-y-3">
                <h3 className="text-sm uppercase tracking-widest font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00D2F6]" />
                  Visão Geral do Projeto
                </h3>
                <p className="text-[#AEB7C4] text-sm leading-relaxed font-light">
                  {project.description ||
                    'Solução digital estratégica desenvolvida para aliar robustez tecnológica, experiência do usuário e foco em resultados de negócio.'}
                </p>

                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-mono px-2.5 py-1 rounded-md bg-[#00D2F6]/10 border border-[#00D2F6]/20 text-[#00D2F6]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-[#050914] p-4 rounded-2xl border border-[#151F38] space-y-3 flex flex-col justify-between">
                <div>
                  <div className="text-xs uppercase text-slate-500 tracking-wider">Identificador</div>
                  <div className="text-lg font-bold text-white font-mono">{project.number} // {project.category}</div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs uppercase font-medium tracking-wider flex items-center justify-center gap-1.5 transition-colors text-[#AEB7C4] cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Layers className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado' : 'Link'}</span>
                  </button>

                  <a
                    href={project.liveUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-[#00D2F6] hover:bg-[#0096F5] text-[#050914] text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Abrir</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
