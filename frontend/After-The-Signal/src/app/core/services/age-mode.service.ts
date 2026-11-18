import { inject, PLATFORM_ID, signal, Service } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { AgeMode } from './models';

const AGE_MODE_KEY = 'after-the-signal-age-mode';

@Service({})
export class AgeModeService {
  private readonly platformId = inject(PLATFORM_ID);

  readonly selectedMode = signal<AgeMode | null>(this.loadSavedMode());

  private loadSavedMode(): AgeMode | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const savedMode = localStorage.getItem(AGE_MODE_KEY);

    if (savedMode === 'cadet' || savedMode === 'all' || savedMode === 'telemetry') {
      return savedMode;
    }

    return null;
  }

  selectMode(mode: AgeMode): void {
    this.selectedMode.set(mode);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(AGE_MODE_KEY, mode);
    }
  }

  resetMode(): void {
    this.selectedMode.set(null);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(AGE_MODE_KEY);
    }
  }
}
