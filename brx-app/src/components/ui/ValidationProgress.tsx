import { ValidationResult } from '@/utils/validation';

interface ValidationProgressProps {
  validationResult: ValidationResult;
  totalFields: number;
}

export function ValidationProgress({ validationResult, totalFields }: ValidationProgressProps) {
  // Calculate progress percentage
  const validFields = totalFields - validationResult.errors.length;
  const progressPercentage = Math.floor((validFields / totalFields) * 100);
  
  // Generate progress bar color based on completion percentage
  const getProgressColor = () => {
    if (progressPercentage < 33) return 'bg-red-500';
    if (progressPercentage < 67) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-2 mt-4">
      <div className="flex justify-between items-center text-sm">
        <span>Form completion</span>
        <span className={progressPercentage === 100 ? 'text-green-600 font-medium' : 'text-gray-600'}>
          {progressPercentage}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${getProgressColor()}`} 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
}

