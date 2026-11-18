import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../pipes/t.pipe';
import { ArtifactService } from '../../../../core/services/artifact-service';
import { Model } from '../../../../core/services/model';

@Component({
  imports: [RouterLink, TranslatePipe],
  selector: 'app-footer',
  styleUrl: './footer.css',
  templateUrl: './footer.html',
})
export class Footer {
  protected artifacts = inject(ArtifactService);
  protected modal = inject(Model);
}
