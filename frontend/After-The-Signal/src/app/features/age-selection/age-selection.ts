import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AgeModeService } from '../../core/services/age-mode.service';
import { AgeMode } from '../../core/services/models';

@Component({
  selector: 'app-age-selection',
  imports: [],
  templateUrl: './age-selection.html',
  styleUrl: './age-selection.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgeSelection {
  private readonly ageModeService = inject(AgeModeService);
  private readonly router = inject(Router);

  protected selectMode(mode: AgeMode): void {
    this.ageModeService.selectMode(mode);
    void this.router.navigate(['/']);
  }
}
