export interface AlarmSettings {
  clapDetection: boolean;
  whistleDetection: boolean;
  motionDetection: boolean;
  pocketMode: boolean;
  chargingRemoval: boolean;
  batteryFull: boolean;
  intruderSelfie: boolean;
  wrongPasswordAttempts: number;
}

export interface AlarmState {
  isActive: boolean;
  type: 'clap' | 'whistle' | 'motion' | 'charging' | 'battery' | 'intruder' | 'pocket' | null;
  timestamp: number;
}

export interface IntruderAttempt {
  id: string;
  timestamp: number;
  photo?: string;
  attempts: number;
}
