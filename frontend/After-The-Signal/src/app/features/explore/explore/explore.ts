import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtifactService } from '../../../core/services/artifact-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { World } from '../../../core/services/models';
import { TranslatePipe } from '../../../shared/pipes/t.pipe';
import { ArtifactGrid } from '../../../shared/components/artifact-grid/artifact-grid';

@Component({
  imports: [TranslatePipe, ArtifactGrid],
  selector: 'app-explore',
  styleUrl: './explore.css',
  templateUrl: './explore.html',
})
export class Explore {
  private readonly route = inject(ActivatedRoute);
  protected readonly service = inject(ArtifactService);

  private readonly routeData = toSignal(this.route.data, {
    initialValue: this.route.snapshot.data,
  });

  protected readonly world = computed(() => this.routeData()['world'] as World);

  protected readonly artifacts = computed(() =>
    this.world() === 'moon' ? this.service.moon() : this.service.mars(),
  );

  protected readonly titleKey = computed(() => `explore.${this.world()}.title`);

  protected readonly descriptionKey = computed(() => `explore.${this.world()}.description`);
}
