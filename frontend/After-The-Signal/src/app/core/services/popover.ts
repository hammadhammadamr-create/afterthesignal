import { Service, signal } from '@angular/core';

@Service()
export class Popover {
  readonly open = signal<string | null>(null);

  toggle(name: string): void {
    this.open.set(this.open() === name ? null : name);
  }

  close(): void {
    this.open.set(null);
  }
}
