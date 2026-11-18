import { Service, signal } from '@angular/core';
import { FilterMode, World } from './models';

@Service()
export class Filter {
  readonly mode = signal<FilterMode>('featured');

  reset(): void {
    this.mode.set('featured');
  }

  /** زرار EXPLORE MOON / MARS في قسم Worlds */
  jumpToWorld(world: World): void {
    this.mode.set(world);
    document.getElementById('stories')?.scrollIntoView({ behavior: 'smooth' });
  }
}
