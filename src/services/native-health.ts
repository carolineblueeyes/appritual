import { registerPlugin } from '@capacitor/core';
import type { HealthData } from './HealthService';

/**
 * Интерфейс кастомного нативного плагина для Health.
 * 
 * Android: использует Google Health Connect API (Jetpack Health Connect)
 * iOS: использует Apple HealthKit
 */
export interface NativeHealthPlugin {
  /**
   * Запросить разрешения на чтение health-данных.
   * На Android вызывает Health Connect permission intent.
   * На iOS вызывает HKHealthStore.requestAuthorization.
   */
  requestPermissions(): Promise<{ granted: boolean }>;

  /**
   * Получить данные здоровья за сегодня.
   */
  getTodayData(): Promise<{
    hrv: number;
    heartRate: number;
    steps: number;
    sleepHours: number;
    calories: number;
    respiratoryRate: number;
  }>;

  /**
   * Проверить доступность Health API на устройстве.
   */
  checkAvailability(): Promise<{ available: boolean; platform: string }>;
}

/**
 * Регистрируем плагин с именем 'NativeHealth'.
 * Capacitor автоматически свяжет его с нативными реализациями.
 */
const NativeHealth = registerPlugin<NativeHealthPlugin>('NativeHealth', {
  web: () => import('./health-web').then(m => new m.NativeHealthWeb()),
});

export { NativeHealth };