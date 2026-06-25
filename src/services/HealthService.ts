import { HealthState } from '../types';
import { healthBridge } from './HealthBridge';

export interface HealthData {
  hrv: number;
  heartRate: number;
  steps: number;
  sleepHours: number;
  sleepQuality: number;
  stressLevel: number;
  activityCalories: number;
  respiratoryRate: number;
  energyLevel: number;
}

export type HealthPlatform = 'apple' | 'google' | 'simulator';

export interface IHealthService {
  readonly platform: HealthPlatform;
  requestPermissions(): Promise<boolean>;
  getCurrentHealth(): Promise<HealthData>;
  calculateHealthState(data: HealthData): { state: HealthState; score: number };
  isAvailable(): Promise<boolean>;
}

/**
 * Симулятор для браузера — возвращает разные данные каждый раз
 */
class HealthSimulator implements IHealthService {
  readonly platform: HealthPlatform = 'simulator';

  async requestPermissions(): Promise<boolean> {
    return true;
  }

  async getCurrentHealth(): Promise<HealthData> {
    return {
      hrv: this.randomBetween(25, 75),
      heartRate: this.randomBetween(60, 85),
      steps: this.randomBetween(3000, 10000),
      sleepHours: this.randomBetween(5.5, 8.5),
      sleepQuality: this.randomBetween(40, 95),
      stressLevel: this.randomBetween(20, 70),
      activityCalories: this.randomBetween(150, 600),
      respiratoryRate: this.randomBetween(12, 18),
      energyLevel: this.randomBetween(40, 95),
    };
  }

  calculateHealthState(data: HealthData): { state: HealthState; score: number } {
    return calculateHealthFromData(data);
  }

  async isAvailable(): Promise<boolean> { return true; }

  private randomBetween(min: number, max: number): number {
    return parseFloat((Math.random() * (max - min) + min).toFixed(1));
  }
}

/**
 * Нативная реализация через HealthBridge (cordova-plugin-health).
 * Запрашивает разрешения и читает реальные данные с устройства.
 */
class HealthNative implements IHealthService {
  readonly platform: HealthPlatform = 'google';
  private permissionsGranted = false;

  async requestPermissions(): Promise<boolean> {
    // Инициализируем bridge и запрашиваем разрешения
    await healthBridge.initialize();
    this.permissionsGranted = await healthBridge.requestPermissions();
    return this.permissionsGranted;
  }

  async getCurrentHealth(): Promise<HealthData> {
    if (!this.permissionsGranted) {
      const granted = await this.requestPermissions();
      if (!granted) {
        throw new Error('Health permissions not granted');
      }
    }

    const data = await healthBridge.getHealthData();
    console.log('[HealthNative] Real health data received:', data);
    return data;
  }

  calculateHealthState(data: HealthData): { state: HealthState; score: number } {
    return calculateHealthFromData(data);
  }

  async isAvailable(): Promise<boolean> {
    try {
      return await healthBridge.isAvailable();
    } catch {
      return false;
    }
  }
}

/**
 * Чистая функция расчёта состояния здоровья.
 */
export function calculateHealthFromData(data: HealthData): { state: HealthState; score: number } {
  const hrvScore = Math.min(100, (data.hrv / 100) * 100);
  const hrScore = Math.max(0, 100 - Math.abs(70 - data.heartRate) * 2);
  const sleepScore = Math.min(100, (data.sleepHours / 8) * 100);
  const stressScore = Math.max(0, 100 - data.stressLevel);
  const stepsScore = Math.min(100, (data.steps / 10000) * 100);

  const totalScore = Math.round(
    hrvScore * 0.25 +
    hrScore * 0.15 +
    sleepScore * 0.25 +
    stressScore * 0.2 +
    stepsScore * 0.15
  );

  let state: HealthState;
  if (totalScore >= 80) state = 'Shining';
  else if (totalScore >= 60) state = 'Balance';
  else if (totalScore >= 40) state = 'Tension';
  else state = 'Overload';

  return { state, score: totalScore };
}

export function createHealthService(): IHealthService {
  const isNative = typeof (window as any).Capacitor !== 'undefined' && 
                   (window as any).Capacitor.isNativePlatform();
  if (isNative) {
    console.log('[HealthService] Native platform detected — using HealthBridge');
    return new HealthNative();
  }
  console.log('[HealthService] Browser platform — using simulator');
  return new HealthSimulator();
}

export const healthService = createHealthService();