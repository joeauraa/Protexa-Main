import { Shield, Bell, Battery, Wifi, Camera, Smartphone, Volume2 } from 'lucide-react';
import { AlarmSettings } from '../types';

interface DashboardProps {
  settings: AlarmSettings;
  isProtectionActive: boolean;
  batteryLevel: number;
  isCharging: boolean;
}

export default function Dashboard({ settings, isProtectionActive, batteryLevel, isCharging }: DashboardProps) {
  const activeFeatures = [
    { name: 'Clap Detection', active: settings.clapDetection, icon: Volume2 },
    { name: 'Motion Alert', active: settings.motionDetection, icon: Smartphone },
    { name: 'Pocket Mode', active: settings.pocketMode, icon: Shield },
    { name: 'Charging Alert', active: settings.chargingRemoval, icon: Battery },
    { name: 'Intruder Selfie', active: settings.intruderSelfie, icon: Camera },
    { name: 'Battery Full', active: settings.batteryFull, icon: Battery },
  ];

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-100">
        <div className="flex items-center justify-between mb-77777">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full ${isProtectionActive ? 'bg-red-500' : 'bg-gray-300'}`}>
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Protection Status</h2>
              <p className={`text-sm ${isProtectionActive ? 'text-red-600' : 'text-gray-500'}`}>
                {isProtectionActive ? 'Active & Monitoring' : 'Inactive'}
              </p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full ${isProtectionActive ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Battery Level</span>
            <div className="flex items-center gap-2">
              <Battery className={`w-5 h-5 ${isCharging ? 'text-green-500' : 'text-gray-600'}`} />
              <span className="font-semibold text-gray-800">{batteryLevel}%</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                batteryLevel > 80 ? 'bg-green-500' : batteryLevel > 20 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${batteryLevel}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Active Features</h3>
        <div className="grid grid-cols-2 gap-3">
          {activeFeatures.map((feature) => (
            <div
              key={feature.name}
              className={`p-4 rounded-xl border-2 transition-all ${
                feature.active
                  ? 'bg-red-50 border-red-200'
                  : 'bg-gray-50 border-gray-200 opacity-50'
              }`}
            >
              <feature.icon className={`w-6 h-6 mb-2 ${feature.active ? 'text-red-600' : 'text-gray-400'}`} />
              <p className="text-xs font-semibold text-gray-700">{feature.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
