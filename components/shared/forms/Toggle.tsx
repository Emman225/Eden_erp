
import React from 'react';

interface ToggleProps {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ label, enabled, onChange }) => {
  return (
    <div className="flex items-center">
      <label className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            checked={enabled}
            onChange={() => onChange(!enabled)}
          />
          <div className="block bg-gray-200 w-12 h-6 rounded-full"></div>
          <div
            className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
              enabled ? 'transform translate-x-6 bg-blue-600' : ''
            }`}
          ></div>
        </div>
        <div className="ml-3 text-sm font-medium text-gray-700">{label}</div>
      </label>
    </div>
  );
};

export default Toggle;
