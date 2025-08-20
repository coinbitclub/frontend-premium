import React from 'react';
import { RobotOperationTimeline } from '../src/components/trading/RobotOperationTimeline';

interface RobotDemoLandingProps {
  currentLanguage?: 'pt' | 'en';
}

const RobotDemoLanding: React.FC<RobotDemoLandingProps> = ({ currentLanguage = 'pt' }) => {
  return (
    <div className="w-full max-w-6xl mx-auto py-4">
      <div className="text-center mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {currentLanguage === 'pt' ? '🤖 Robô em Ação - Operação ao Vivo' : '🤖 Robot in Action - Live Operation'}
        </h2>
        
        <p className="text-gray-300 text-base md:text-lg max-w-3xl mx-auto">
          {currentLanguage === 'pt' 
            ? 'Acompanhe em tempo real como nosso robô de trading automatizado executa operações lucrativas no mercado de criptomoedas. Cada etapa do processo é monitorada e otimizada para maximizar seus resultados.' 
            : 'Watch in real-time how our automated trading robot executes profitable operations in the cryptocurrency market. Every step of the process is monitored and optimized to maximize your results.'
          }
        </p>
      </div>

      <RobotOperationTimeline 
        isActive={true}
        speed="normal"
        compact={false}
      />
      
      <div className="mt-4 text-center">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/30">
          <div className="text-blue-400 text-sm font-medium mb-2">
            {currentLanguage === 'pt' ? '💡 IMPORTANTE' : '💡 IMPORTANT'}
          </div>
          <div className="text-gray-300 text-sm">
            {currentLanguage === 'pt' 
              ? 'Esta é uma simulação baseada em operações reais do nosso sistema. Os resultados mostrados são exemplos dos lucros que nossos usuários obtêm diariamente.' 
              : 'This is a simulation based on real operations from our system. The results shown are examples of the profits our users achieve daily.'
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default RobotDemoLanding;
