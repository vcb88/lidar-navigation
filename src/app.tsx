import React from 'react';
import RobotNavigation from './components/RobotNavigation';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Robot Navigation Simulator
        </h1>
        <RobotNavigation />
      </div>
    </div>
  );
};

export default App;