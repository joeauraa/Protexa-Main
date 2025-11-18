import { Shield, ShieldOff } from 'lucide-react';

interface ProtectionToggleProps {
  isActive: boolean;
  onToggle: () => void;
}

export default function ProtectionToggle({ isActive, onToggle }: ProtectionToggleProps) {
  return (
    <div className="w-full max-w-md">
      <button
        onClick={onToggle}
        className={`w-full p-8 rounded-2xl shadow-lg border-4 transition-all transform hover:scale-105 ${
          isActive
            ? 'bg-gradient-to-br from-blue-900 to-red-600 border-red-700'
            : 'bg-gradient-to-br from-gray-800 to-gray-500 border-gray-600'
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          {isActive ? (
            <Shield className="w-25 h-25 text-white" />
          ) : (
            <ShieldOff className="w-25 h-25 text-white" />
          )}
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {isActive ? 'Protection Active' : 'Protection Inactive NP'}
            </h2>
            <p className="text-blue-100">
              {isActive ? 'Tap to deactivate' : 'Tap to activate protection'}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}
