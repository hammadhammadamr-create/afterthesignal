import { I18n } from './../../core/services/i18n';
import { Pipe, PipeTransform, inject } from '@angular/core';
@Pipe({ name: 't', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform {
  private i18n = inject(I18n);

  transform(key: string): string {
    return this.i18n.t(key);
  }
}
