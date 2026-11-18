import { computed, inject, Service, signal } from '@angular/core';
import { ArtifactService } from './artifact-service';

@Service()
export class Model {
  private artifacts = inject(ArtifactService);
  private selectedId = signal<string | null>(null);

  readonly artifact = computed(
    () => this.artifacts.artifacts().find((a) => a.id === this.selectedId()) ?? null,
  );

  open(id: string): void {
    this.selectedId.set(id);
  }

  close(): void {
    this.selectedId.set(null);
  }
}
