interface BatteryManager extends EventTarget {
  charging: boolean;
  level: number;
  addEventListener(type: 'chargingchange' | 'levelchange', listener: EventListener): void;
  removeEventListener(type: 'chargingchange' | 'levelchange', listener: EventListener): void;
}

interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

export class BatteryMonitor {
  private battery: BatteryManager | null = null;
  private wasCharging = false;

  async initialize(): Promise<boolean> {
    try {
      const nav = navigator as NavigatorWithBattery;
      if (!nav.getBattery) {
        console.warn('Battery API not supported');
        return false;
      }

      this.battery = await nav.getBattery();
      this.wasCharging = this.battery.charging;
      return true;
    } catch (error) {
      console.error('Battery monitoring not available:', error);
      return false;
    }
  }

  onChargingRemoved(callback: () => void) {
    if (!this.battery) return;

    const handler = () => {
      if (this.battery && this.wasCharging && !this.battery.charging) {
        callback();
      }
      if (this.battery) {
        this.wasCharging = this.battery.charging;
      }
    };

    this.battery.addEventListener('chargingchange', handler);
  }

  onBatteryFull(callback: () => void) {
    if (!this.battery) return;

    const handler = () => {
      if (this.battery && this.battery.level >= 0.99 && this.battery.charging) {
        callback();
      }
    };

    this.battery.addEventListener('levelchange', handler);
  }

  getBatteryLevel(): number {
    return this.battery ? Math.round(this.battery.level * 100) : 0;
  }

  isCharging(): boolean {
    return this.battery ? this.battery.charging : false;
  }
}
