import React from 'react';
import { ContactSection } from '../../components/sections/ContactSection';

interface ContactCinematicSceneProps {
  progress: number;
  onDirectContactClick?: () => void;
  onTermsClick?: () => void;
  onPrivacyClick?: () => void;
}

export const ContactCinematicScene: React.FC<ContactCinematicSceneProps> = ({
  progress,
  onDirectContactClick,
  onTermsClick,
  onPrivacyClick,
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-between overflow-y-auto pointer-events-auto py-8">
      <ContactSection onDirectContactClick={onDirectContactClick} />
    </div>
  );
};
