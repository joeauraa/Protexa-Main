import { Volume2, Smartphone, Shield, Battery, Camera, AlertTriangle } from 'lucide-react';
import { AlarmSettings } from '../types';

interface SettingsPanelProps {
  settings: AlarmSettings;
  onSettingsChange: (settings: AlarmSettings) => void;
}

export default function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  const toggleSetting = (key: keyof AlarmSettings) => {
    onSettingsChange({
      ...settings,
      [key]: !settings[key],
    });
  };

  const settingsOptions = [
    {
      key: 'clapDetection' as keyof AlarmSettings,
      label: 'Find by Clap',
      description: 'Clap to trigger alarm and find your phone',
      icon: Volume2,
    },
    {
      key: 'whistleDetection' as keyof AlarmSettings,
      label: 'Find by Whistle',
      description: 'Whistle to locate your device',
      icon: Volume2,
    },
    {
      key: 'motionDetection' as keyof AlarmSettings,
      label: 'Motion Detection',
      description: 'Alert when phone is moved or picked up',
      icon: Smartphone,
    },
    {
      key: 'pocketMode' as keyof AlarmSettings,
      label: 'Pocket Mode',
      description: 'Detect when phone is removed from pocket',
      icon: Shield,
    },
    {
      key: 'chargingRemoval' as keyof AlarmSettings,
      label: 'Charging Removal',
      description: 'Alert when charger is disconnected',
      icon: Battery,
    },
    {
      key: 'batteryFull' as keyof AlarmSettings,
      label: 'Battery Full Alert',
      description: 'Notify when battery reaches 100%',
      icon: Battery,
    },
    {
      key: 'intruderSelfie' as keyof AlarmSettings,
      label: 'Intruder Selfie',
      description: 'Capture photo on wrong password attempts',
      icon: Camera,
    },
  ];

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-full bg-red-500">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Security Settings</h2>
        </div>

        <div className="space-y-3">
          {settingsOptions.map((option) => (
            <div
              key={option.key}
              className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border-2 border-gray-200 hover:border-red-200 transition-all"
            >
              <div className="flex items-start gap-3 flex-1">
                <option.icon className="w-5 h-5 text-red-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">{option.label}</h3>
                  <p className="text-xs text-gray-600 mt-1">{option.description}</p>
                </div>
              </div>
              <button
                onClick={() => toggleSetting(option.key)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings[option.key] ? 'bg-red-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings[option.key] ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        {settings.intruderSelfie && (
          <div className="mt-4 p-4 bg-orange-50 border-2 border-orange-200 rounded-xl">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Wrong Password Attempts
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={settings.wrongPasswordAttempts}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  wrongPasswordAttempts: parseInt(e.target.value) || 3,
                })
              }
              className="w-full px-4 py-2 border-2 border-orange-300 rounded-lg focus:outline-none focus:border-orange-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}
