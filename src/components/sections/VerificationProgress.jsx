import React from 'react';
import { Tooltip } from 'react-tooltip';

const VerificationProgress = ({ stagesStatus }) => {
  const stages = [
    {
      name: 'Planting Stage',
      status: stagesStatus?.planting || 'pending',
      description: 'Initial planting and crop establishment',
    },
    {
      name: 'Mid-Growth Stage',
      status: stagesStatus?.midGrowth || 'pending',
      description: 'Crop development and monitoring',
    },
    {
      name: 'Harvest Stage',
      status: stagesStatus?.harvest || 'pending',
      description: 'Crop harvesting and quality inspection',
    },
    {
      name: 'Processing',
      status: stagesStatus?.processing || 'pending',
      description: 'Post-harvest processing and packaging',
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-gradient-to-br from-green-400 to-green-600 text-white border-green-500 shadow-green-200';
      case 'rejected':
        return 'bg-gradient-to-br from-red-400 to-red-600 text-white border-red-500 shadow-red-200';
      default:
        return 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 border-gray-300 shadow-gray-100';
    }
  };

  const getIcon = (status) => {
    switch (status) {
      case 'approved':
        return '✅';
      case 'rejected':
        return '❌';
      default:
        return '⏳';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      {/* Progress bar with rounded connectors */}
      <div className="flex items-center justify-between relative mb-16">
        {stages.map((stage, idx) => (
          <React.Fragment key={stage.name}>
            <div className="flex flex-col items-center z-10">
              <Tooltip
                id={`tooltip-stage-${idx}`}
                place="top"
                effect="solid"
                className="bg-gray-800 text-white px-3 py-2 rounded"
              >
                <span>{stage.description}</span>
              </Tooltip>
              <button
                data-tooltip-id={`tooltip-stage-${idx}`}
                className={`transition-transform duration-200 transform hover:scale-110 rounded-full border-4 ${getStatusStyle(stage.status)} w-20 h-20 flex items-center justify-center shadow-lg mb-2`}
              >
                <span className="text-3xl">{getIcon(stage.status)}</span>
              </button>
              <span className="mt-2 text-base font-semibold text-gray-700 text-center w-24">{stage.name}</span>
            </div>
            {/* Connector */}
            {idx < stages.length - 1 && (
              <div className="flex-1 flex items-center justify-center">
                <div className={`h-3 w-full rounded-full relative z-0 ${
                  stages[idx].status === 'approved' && stages[idx + 1].status !== 'rejected'
                    ? 'bg-gradient-to-r from-green-400 to-green-600'
                    : stages[idx].status === 'rejected'
                    ? 'bg-gradient-to-r from-red-400 to-red-600'
                    : 'bg-gradient-to-r from-gray-200 to-gray-400'
                }`}></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Detailed Stage Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {stages.map((stage, idx) => (
          <div
            key={stage.name}
            className={`rounded-2xl border-2 p-5 flex items-center shadow-md transition-shadow duration-200 hover:shadow-xl ${getStatusStyle(stage.status)}`}
          >
            <Tooltip
              id={`tooltip-card-${idx}`}
              place="top"
              effect="solid"
              className="bg-gray-800 text-white px-3 py-2 rounded"
            >
              <span>{stage.description}</span>
            </Tooltip>
            <button
              data-tooltip-id={`tooltip-card-${idx}`}
              className="w-14 h-14 rounded-full flex items-center justify-center mr-5 border-2 border-white bg-white shadow"
            >
              <span className={`text-2xl ${
                stage.status === 'approved'
                  ? 'text-green-500'
                  : stage.status === 'rejected'
                  ? 'text-red-500'
                  : 'text-gray-400'
              }`}>{getIcon(stage.status)}</span>
            </button>
            <div className="flex-1">
              <div className="text-lg font-semibold mb-1">{stage.name}</div>
              <div className="text-sm text-gray-700 mb-1">{stage.description}</div>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${
                stage.status === 'approved'
                  ? 'bg-green-100 text-green-700'
                  : stage.status === 'rejected'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {stage.status.charAt(0).toUpperCase() + stage.status.slice(1)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerificationProgress;