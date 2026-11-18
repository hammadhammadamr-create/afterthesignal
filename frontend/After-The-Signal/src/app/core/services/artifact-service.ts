import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';

import { catchError, firstValueFrom, from, of, switchMap, tap } from 'rxjs';

import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { I18n } from './i18n';
import { Artifact, Lang, World } from './models';

type Overrides = Record<string, Partial<Artifact>>;
@Service()
export class ArtifactService {
  private http = inject(HttpClient);
  private i18n = inject(I18n);

  private base?: Promise<Artifact[]>;

  readonly error = signal(false);

  readonly artifacts = toSignal(
    toObservable(this.i18n.lang).pipe(
      switchMap((lang) =>
        from(this.load(lang)).pipe(
          tap(() => this.error.set(false)),
          catchError(() => {
            this.error.set(true);
            return of([] as Artifact[]);
          }),
        ),
      ),
    ),
    { initialValue: [] as Artifact[] },
  );

  readonly moon = computed(() => this.byWorld('moon'));

  readonly mars = computed(() => this.byWorld('mars'));

  byWorld(world: World): Artifact[] {
    return this.artifacts().filter((a) => a.world === world);
  }

  private async load(lang: Lang): Promise<Artifact[]> {
    const request =
      this.base ??
      (this.base = firstValueFrom(
        this.http.get<{ artifacts: Artifact[] }>('data/artifacts.json'),
      ).then((res) => res.artifacts));

    let artifacts: Artifact[];

    try {
      artifacts = await request;
    } catch (err) {
      this.base = undefined;
      throw err;
    }

    if (lang === 'en') return artifacts;

    try {
      const overrides = await firstValueFrom(
        this.http.get<Overrides>(`data/i18n/artifacts.${lang}.json`),
      );

      return artifacts.map((artifact) => {
        const override = overrides[artifact.id];

        if (!override) return artifact;

        const translatedTimeline = override.timeline;

        return {
          ...artifact,
          ...override,

          timeline: artifact.timeline.map((event) => {
            const translatedEvent = translatedTimeline?.find((item) => item.id === event.id);

            return {
              ...event,
              ...translatedEvent,
            };
          }),
        };
      });
    } catch {
      return artifacts;
    }
  }
}
