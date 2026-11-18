import { Component, inject, Input } from '@angular/core';
import { TranslatePipe } from '../../pipes/t.pipe';
import { ArtifactCard } from '../artifact-card/artifact-card';
import { ArtifactService } from '../../../core/services/artifact-service';
import { Artifact } from '../../../core/services/models';

@Component({
  imports: [TranslatePipe, ArtifactCard],
  selector: 'app-artifact-grid',
  styleUrl: './artifact-grid.css',
  templateUrl: './artifact-grid.html',
})
export class ArtifactGrid {
  protected service = inject(ArtifactService);
  @Input({ required: true }) artifacts: Artifact[] = [];
}
