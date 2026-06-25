import { Preferences } from '@capacitor/preferences';

/**
 * Универсальное хранилище: в браузере использует localStorage,
 * в нативном приложении — @capacitor/preferences.
 */
class StorageService {
  private isNative: boolean;

  constructor() {
    this.isNative = typeof (window as any).Capacitor !== 'undefined' && 
                    (window as any).Capacitor.isNativePlatform();
  }

  async get(key: string): Promise<string | null> {
    if (this.isNative) {
      const result = await Preferences.get({ key });
      return result.value;
    }
    return localStorage.getItem(key);
  }

  async set(key: string, value: string): Promise<void> {
    if (this.isNative) {
      await Preferences.set({ key, value });
    } else {
      localStorage.setItem(key, value);
    }
  }

  async remove(key: string): Promise<void> {
    if (this.isNative) {
      await Preferences.remove({ key });
    } else {
      localStorage.removeItem(key);
    }
  }

  getSync(key: string): string | null {
    if (this.isNative) {
      // Fallback: в синхронном режиме читаем из памяти если есть
      return null;
    }
    return localStorage.getItem(key);
  }

  setSync(key: string, value: string): void {
    if (!this.isNative) {
      localStorage.setItem(key, value);
    } else {
      // Асинхронный вызов для native
      Preferences.set({ key, value });
    }
  }
}

export const storageService = new StorageService();