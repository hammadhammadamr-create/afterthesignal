import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ArtifactService } from '../../../core/services/artifact-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '../../../shared/pipes/t.pipe';
import { ImgFallbackDirective } from '../../../shared/directives/img-fallback.directive';
import { accentOf } from '../../../core/services/utils';
import { ArtifactTimeline } from '../artifact-timeline/artifact-timeline';

@Component({
  imports: [RouterLink, TranslatePipe, ImgFallbackDirective, ArtifactTimeline],
  selector: 'app-artifact-story',
  styleUrl: './artifact-story.css',
  templateUrl: './artifact-story.html',
})
export class ArtifactStory {
  protected readonly accentOf = accentOf;
  private readonly route = inject(ActivatedRoute);

  protected readonly service = inject(ArtifactService);

  private readonly params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  protected readonly artifactId = computed(() => this.params().get('id'));

  protected readonly artifact = computed(
    () => this.service.artifacts().find((a) => a.id === this.artifactId()) ?? null,
  );
}
