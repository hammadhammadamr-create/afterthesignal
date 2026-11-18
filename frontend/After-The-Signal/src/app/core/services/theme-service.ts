import { DOCUMENT, effect, inject, Service, signal } from '@angular/core';
import { storage } from './utils';
import { Theme } from './models';

const THEME_KEY = 'theme';
@Service()
export class ThemeService {
  private doc = inject(DOCUMENT);

  private savedTheme = storage.get(THEME_KEY);

  readonly theme = signal<Theme>(this.savedTheme === 'white' ? 'white' : 'dark');

  constructor() {
    effect(() => {
      const isDark = this.theme() === 'dark';

      this.doc.body.classList.toggle('dark-theme', isDark);
      this.doc.body.classList.toggle('white-theme', !isDark);

      storage.set(THEME_KEY, this.theme());
    });
  }

  toggle(): void {
    const next: Theme = this.theme() === 'dark' ? 'white' : 'dark';

    this.theme.set(next);
  }
}
