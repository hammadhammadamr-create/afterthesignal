import { computed, inject, PLATFORM_ID, signal, Service } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AgeMode } from './models';

const AGE_MODE_KEY = 'after-the-signal-age-mode';
const LEGACY_AGE_KEY = 'age-mode';

export const AGE_MODES: AgeMode[] = ['cadet', 'all', 'telemetry'];

@Service()
export class AgeModeService {
  private readonly platformId = inject(PLATFORM_ID);

  readonly selectedMode = signal<AgeMode | null>(this.loadSavedMode());

  // API compatible with the existing Age Menu
  readonly mode = computed(() => this.selectedMode() ?? 'all');
  readonly labelKey = computed(() => `age.${this.mode()}.short`);

  private loadSavedMode(): AgeMode | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    const savedMode = localStorage.getItem(AGE_MODE_KEY) ?? localStorage.getItem(LEGACY_AGE_KEY);

    if (savedMode && AGE_MODES.includes(savedMode as AgeMode)) {
      return savedMode as AgeMode;
    }

    return null;
  }

  selectMode(mode: AgeMode): void {
    if (!AGE_MODES.includes(mode)) return;

    this.selectedMode.set(mode);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(AGE_MODE_KEY, mode);
      localStorage.removeItem(LEGACY_AGE_KEY);
    }
  }

  // Compatible with the existing Age Menu
  set(mode: AgeMode): void {
    this.selectMode(mode);
  }

  resetMode(): void {
    this.selectedMode.set(null);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(AGE_MODE_KEY);
      localStorage.removeItem(LEGACY_AGE_KEY);
    }
  }
}
