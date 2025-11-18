import { useState, useEffect, useRef } from 'react';
import { Settings, Home, FileText } from 'lucide-react';
import Dashboard from './components/Dashboard';
import SettingsPanel from './components/SettingsPanel';
import AlarmScreen from './components/AlarmScreen';
import IntruderLog from './components/IntruderLog';
import ProtectionToggle from './components/ProtectionToggle';
import { AlarmSettings, AlarmState, IntruderAttempt } from './types';
import { AudioDetector } from './utils/audioDetection';
import { MotionDetector } from './utils/motionDetection';
import { AlarmSound } from './utils/alarmSound';
import { BatteryMonitor } from './utils/batteryMonitor';

type Tab = 'home' | 'settings' | 'log';

function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  const [isProtectionActive, setIsProtectionActive] = useState(false);
  const [settings, setSettings] = useState<AlarmSettings>({
    clapDetection: true,
    whistleDetection: true,
    motionDetection: false,
    pocketMode: false,
    chargingRemoval: false,
    batteryFull: true,
    intruderSelfie: false,
    wrongPasswordAttempts: 3,
  });
  const [alarm, setAlarm] = useState<AlarmState>({
    isActive: false,
    type: null,
    timestamp: 0,
  });
  const [intruderAttempts, setIntruderAttempts] = useState<IntruderAttempt[]>([]);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isCharging, setIsCharging] = useState(false);

  const audioDetectorRef = useRef<AudioDetector | null>(null);
  const motionDetectorRef = useRef<MotionDetector | null>(null);
  const alarmSoundRef = useRef<AlarmSound | null>(null);
  const batteryMonitorRef = useRef<BatteryMonitor | null>(null);

  const triggerAlarm = (type: AlarmState['type']) => {
    setAlarm({
      isActive: true,
      type,
      timestamp: Date.now(),
    });

    if (!alarmSoundRef.current) {
      alarmSoundRef.current = new AlarmSound();
    }
    alarmSoundRef.current.play();

    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  };

  const dismissAlarm = () => {
    setAlarm({
      isActive: false,
      type: null,
      timestamp: 0,
    });
    if (alarmSoundRef.current) {
      alarmSoundRef.current.stop();
    }
  };

  useEffect(() => {
    const initializeBattery = async () => {
      batteryMonitorRef.current = new BatteryMonitor();
      const initialized = await batteryMonitorRef.current.initialize();

      if (initialized) {
        const updateBattery = () => {
          if (batteryMonitorRef.current) {
            setBatteryLevel(batteryMonitorRef.current.getBatteryLevel());
            setIsCharging(batteryMonitorRef.current.isCharging());
          }
        };

        updateBattery();
        const interval = setInterval(updateBattery, 5000);

        if (settings.chargingRemoval) {
          batteryMonitorRef.current.onChargingRemoved(() => {
            if (isProtectionActive) {
              triggerAlarm('charging');
            }
          });
        }

        if (settings.batteryFull) {
          batteryMonitorRef.current.onBatteryFull(() => {
            if (isProtectionActive) {
              triggerAlarm('battery');
            }
          });
        }

        return () => clearInterval(interval);
      }
    };

    initializeBattery();
  }, [isProtectionActive, settings.chargingRemoval, settings.batteryFull]);

  useEffect(() => {
    if (!isProtectionActive) {
      if (audioDetectorRef.current) {
        audioDetectorRef.current.stopListening();
      }
      if (motionDetectorRef.current) {
        motionDetectorRef.current.stopListening();
      }
      return;
    }

    const initializeDetection = async () => {
      if (settings.clapDetection || settings.whistleDetection) {
        if (!audioDetectorRef.current) {
          audioDetectorRef.current = new AudioDetector();
          await audioDetectorRef.current.initialize();
        }

        audioDetectorRef.current.startListening(
          () => {
            if (settings.clapDetection) {
              triggerAlarm('clap');
            }
          },
          () => {
            if (settings.whistleDetection) {
              triggerAlarm('whistle');
            }
          }
        );
      }

      if (settings.motionDetection || settings.pocketMode) {
        if (!motionDetectorRef.current) {
          motionDetectorRef.current = new MotionDetector();
        }

        motionDetectorRef.current.startListening(() => {
          if (settings.pocketMode) {
            triggerAlarm('pocket');
          } else if (settings.motionDetection) {
            triggerAlarm('motion');
          }
        });
      }
    };

    initializeDetection();

    return () => {
      if (audioDetectorRef.current) {
        audioDetectorRef.current.stopListening();
      }
      if (motionDetectorRef.current) {
        motionDetectorRef.current.stopListening();
      }
    };
  }, [isProtectionActive, settings]);

  const toggleProtection = () => {
    setIsProtectionActive(!isProtectionActive);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <AlarmScreen alarm={alarm} onDismiss={dismissAlarm} />

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center justify-center mb-6">
          <img src="https://i.postimg.cc/prstnKmY/Whats-App-Image-2025-11-06-at-22-12-58-b0c31a35-removebg-preview.png" alt="App Icon" className="w-20 h-20 mr-4" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Protexa</h1>
            <p className="text-gray-600">My Phone Security</p>
          </div>
        </div>

        <div className="mb-6">
          <ProtectionToggle isActive={isProtectionActive} onToggle={toggleProtection} />
        </div>

        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setCurrentTab('home')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              currentTab === 'home'
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Home className="w-5 h-5" />
            Dashboard
          </button>
          <button
            onClick={() => setCurrentTab('settings')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              currentTab === 'settings'
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
          <button
            onClick={() => setCurrentTab('log')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              currentTab === 'log'
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-5 h-5" />
            Log
          </button>
        </div>

        <div className="flex justify-center">
          {currentTab === 'home' && (
            <Dashboard
              settings={settings}
              isProtectionActive={isProtectionActive}
              batteryLevel={batteryLevel}
              isCharging={isCharging}
            />
          )}
          {currentTab === 'settings' && (
            <SettingsPanel settings={settings} onSettingsChange={setSettings} />
          )}
          {currentTab === 'log' && <IntruderLog attempts={intruderAttempts} />}
        </div>

        {isProtectionActive && (
          <div className="mt-6 p-4 bg-green-100 border-2 border-green-300 rounded-xl text-center">
            <p className="text-green-800 font-semibold">
              Protection is active. Your phone is being monitored.
            </p>
          </div>
        )}

        <div>
          <h3 className="font-bold text-gray-800 mb-3"></h3>
          <ul className="space-y-2 text-sm text-gray-600">
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
