import { computed, DOCUMENT, effect, inject, Service, signal } from '@angular/core';
import { Dictionary, Lang } from './models';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { storage } from './utils';
export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN — English' },
  { code: 'es', label: 'ES — Español' },
  { code: 'fr', label: 'FR — Français' },
  { code: 'ar', label: 'AR — العربية' },
];

const LANG_KEY = 'lang';
const RTL: Lang[] = ['ar'];
@Service()
export class I18n {
  private http = inject(HttpClient);
  private doc = inject(DOCUMENT);

  private fallback = signal<Dictionary>({});
  private dictionary = signal<Dictionary>({});

  readonly lang = signal<Lang>('en');
  readonly dir = computed(() => (RTL.includes(this.lang()) ? 'rtl' : 'ltr'));

  constructor() {
    effect(() => {
      this.doc.documentElement.lang = this.lang();
      this.doc.documentElement.dir = this.dir();
    });
  }

  t(key: string): string {
    return this.dictionary()[key] ?? this.fallback()[key] ?? key;
  }

  async init(): Promise<void> {
    const en = await this.load('en');
    this.fallback.set(en);

    const saved = storage.get(LANG_KEY);
    const code = LANGUAGES.some((l) => l.code === saved) ? (saved as Lang) : 'en';
    this.dictionary.set(code === 'en' ? en : await this.load(code));
    this.lang.set(code);
  }

  async setLanguage(code: Lang): Promise<void> {
    if (code === this.lang()) return;
    const dict = code === 'en' ? this.fallback() : await this.load(code);
    this.dictionary.set(dict);
    this.lang.set(code);
    storage.set(LANG_KEY, code);
  }

  private load(code: Lang): Promise<Dictionary> {
    return firstValueFrom(this.http.get<Dictionary>(`data/i18n/${code}.json`));
  }
}
