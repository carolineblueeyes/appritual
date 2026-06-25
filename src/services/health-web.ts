import { NativeHealthPlugin } from './native-health';
import { healthService } from './HealthService';

/**
 * Web-заглушка для NativeHealthPlugin.
 * Используется когда приложение запущено в браузере.
 */
export class NativeHealthWeb implements NativeHealthPlugin {
  async requestPermissions(): Promise<{ granted: boolean }> {
    const granted = await healthService.requestPermissions();
    return { granted };
  }

  async getTodayData(): Promise<{
    hrv: number;
    heartRate: number;
    steps: number;
    sleepHours: number;
    calories: number;
    respiratoryRate: number;
  }> {
    const data = await healthService.getCurrentHealth();
    return {
      hrv: data.hrv,
      heartRate: data.heartRate,
      steps: data.steps,
      sleepHours: data.sleepHours,
      calories: data.activityCalories,
      respiratoryRate: data.respiratoryRate,
    };
  }

  async checkAvailability(): Promise<{ available: boolean; platform: string }> {
    return {
      available: true,
      platform: 'web',
    };
  }
}