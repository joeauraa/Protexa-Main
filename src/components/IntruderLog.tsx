import { Camera, Clock } from 'lucide-react';
import { IntruderAttempt } from '../types';

interface IntruderLogProps {
  attempts: IntruderAttempt[];
}

export default function IntruderLog({ attempts }: IntruderLogProps) {
  if (attempts.length === 0) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-100">
          <div className="flex items-center gap-3 mb-4">
            <Camera className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-bold text-gray-800">Intruder Log</h2>
          </div>
          <p className="text-gray-500 text-center py-8">No intruder attempts detected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-100">
        <div className="flex items-center gap-3 mb-4">
          <Camera className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-bold text-gray-800">Intruder Log</h2>
        </div>

        <div className="space-y-3">
          {attempts.map((attempt) => (
            <div
              key={attempt.id}
              className="p-4 rounded-xl bg-red-50 border-2 border-red-200"
            >
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 bg-red-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  {attempt.photo ? (
                    <img
                      src={attempt.photo}
                      alt="Intruder"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Camera className="w-8 h-8 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    {attempt.attempts} wrong password attempts
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Clock className="w-4 h-4" />
                    {new Date(attempt.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
