import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../shared/pipes/t.pipe';
import { ImgFallbackDirective } from '../../../shared/directives/img-fallback.directive';
import { ArtifactService } from '../../../core/services/artifact-service';
import { FILTER_RULES, FilterMode } from '../../../core/services/models';
import { Model } from '../../../core/services/model';
import { Filter } from '../../../core/services/filter';
import { ArtifactGrid } from '../../../shared/components/artifact-grid/artifact-grid';

@Component({
  imports: [RouterLink, TranslatePipe, ImgFallbackDirective, ArtifactGrid],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  protected artifacts = inject(ArtifactService);
  protected filter = inject(Filter);

  protected readonly filters: { mode: FilterMode; key: string; showCount: boolean }[] = [
    { mode: 'featured', key: 'filter.featured', showCount: true },
    { mode: 'all', key: 'filter.all', showCount: true },
    { mode: 'moon', key: 'filter.moon', showCount: false },
    { mode: 'mars', key: 'filter.mars', showCount: false },
  ];

  protected readonly visible = computed(() =>
    this.artifacts.artifacts().filter(FILTER_RULES[this.filter.mode()]),
  );

  protected count(mode: FilterMode): number {
    return this.artifacts.artifacts().filter(FILTER_RULES[mode]).length;
  }

  ngOnInit(): void {
    this.filter.reset();
  }

  protected toggleAll(): void {
    this.filter.mode.set(this.filter.mode() === 'all' ? 'featured' : 'all');
  }
  protected modal = inject(Model);
}
