import React from 'react';
import RobotOperationTimeline from '../src/components/trading/RobotOperationTimeline';

interface RobotDemoLandingProps {
  currentLanguage?: 'pt' | 'en';
}

const RobotDemoLanding: React.FC<RobotDemoLandingProps> = ({ currentLanguage = 'pt' }) => {
  return (
    <div className="w-full max-w-5xl mx-auto py-2">
      <RobotOperationTimeline 
        isActive={true}
        speed="normal"
        compact={false}
      />
    </div>
  );
};

export default RobotDemoLanding;
