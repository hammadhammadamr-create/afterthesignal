import { Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '../../shared/pipes/t.pipe';
import { ArtifactGrid } from '../../shared/components/artifact-grid/artifact-grid';
import { ArtifactService } from '../../core/services/artifact-service';
import { FILTER_RULES, FilterMode } from '../../core/services/models';

@Component({
  imports: [TranslatePipe, ArtifactGrid],
  selector: 'app-archive',
  styleUrl: './archive.css',
  templateUrl: './archive.html',
})
export class Archive {
  private service = inject(ArtifactService);

  protected readonly mode = signal<FilterMode>('all');
  protected readonly filters: { mode: FilterMode; key: string; showCount: boolean }[] = [
    { mode: 'all', key: 'filter.all', showCount: true },
    { mode: 'moon', key: 'filter.moon', showCount: false },
    { mode: 'mars', key: 'filter.mars', showCount: false },
  ];

  protected readonly visible = computed(() =>
    this.service.artifacts().filter(FILTER_RULES[this.mode()]),
  );

  protected count(mode: FilterMode): number {
    return this.service.artifacts().filter(FILTER_RULES[mode]).length;
  }
}
