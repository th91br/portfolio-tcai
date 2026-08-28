import React from 'react';
import { WhatICreateSection } from '../../components/sections/WhatICreateSection';

interface WhatICreateCinematicSceneProps {
  progress: number;
}

export const WhatICreateCinematicScene: React.FC<WhatICreateCinematicSceneProps> = ({
  progress,
}) => {
  return (
    <div className="w-full h-full overflow-y-auto pointer-events-auto py-12">
      <WhatICreateSection />
    </div>
  );
};
