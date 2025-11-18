import { AlertTriangle, X } from 'lucide-react';
import { AlarmState } from '../types';

interface AlarmScreenProps {
  alarm: AlarmState;
  onDismiss: () => void;
}

export default function AlarmScreen({ alarm, onDismiss }: AlarmScreenProps) {
  if (!alarm.isActive) return null;

  const alarmMessages = {
    clap: 'Clap , Whistle Detected!',
    whistle: 'Whistle , Clap Detected!',
    motion: 'Motion Detected!',
    charging: 'Charger Removed!',
    battery: 'Battery Full!',
    intruder: 'Intruder Alert!',
    pocket: 'Phone Removed from Pocket!',
  };

  const message = alarm.type ? alarmMessages[alarm.type] : 'Alarm Triggered!';

  return (
    <div className="fixed inset-0 bg-red-600 z-50 flex items-center justify-center p-6 animate-pulse">
      <div className="text-center">
        <div className="inline-block p-6 bg-white rounded-full mb-6 animate-bounce">
          <AlertTriangle className="w-24 h-24 text-red-600" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">{message}</h1>
        <p className="text-xl text-red-100 mb-8">Your phone security has been triggered</p>
        <button
          onClick={onDismiss}
          className="px-8 py-4 bg-white text-red-600 rounded-full font-bold text-lg shadow-lg hover:bg-red-50 transition-colors flex items-center gap-2 mx-auto"
        >
          <X className="w-6 h-6" />
          Dismiss Alarm NP
        </button>
      </div>
    </div>
  );
}
