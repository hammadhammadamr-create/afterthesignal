import { Component, inject } from '@angular/core';
import { I18n, LANGUAGES } from '../../../../core/services/i18n';
import { Popover } from '../../../../core/services/popover';

@Component({
  imports: [],
  selector: 'app-lang-menu',
  styleUrl: './lang-menu.css',
  templateUrl: './lang-menu.html',
})
export class LangMenu {
  protected i18n = inject(I18n);
  protected popover = inject(Popover);
  protected readonly languages = LANGUAGES;

  protected toggle(event: Event): void {
    event.stopPropagation();
    this.popover.toggle('lang');
  }
}
