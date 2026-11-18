import { Component, inject } from '@angular/core';
import { TranslatePipe } from '../../../pipes/t.pipe';
import { AGE_MODES, AgeModeService } from '../../../../core/services/age-model-service';
import { Popover } from '../../../../core/services/popover';

@Component({
  imports: [TranslatePipe],
  selector: 'app-age-menu',
  styleUrl: './age-menu.css',
  templateUrl: './age-menu.html',
})
export class AgeMenu {
  protected age = inject(AgeModeService);
  protected popover = inject(Popover);
  protected readonly modes = AGE_MODES;

  protected toggle(event: Event): void {
    event.stopPropagation();
    this.popover.toggle('age');
  }
}
