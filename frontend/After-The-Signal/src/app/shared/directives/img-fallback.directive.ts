import { Directive, ElementRef, HostListener, Input, inject } from '@angular/core';
import { fallbackSrc } from '../../core/services/utils';

/** لو الصورة فشلت في التحميل، بنحط مكانها صورة SVG فيها الاسم. */
@Directive({ selector: 'img[appFallback]', standalone: true })
export class ImgFallbackDirective {
  @Input({ required: true }) appFallback = '';
  @Input() fallbackAccent = 'cyan';

  private img = inject<ElementRef<HTMLImageElement>>(ElementRef).nativeElement;

  @HostListener('error')
  onError(): void {
    if (this.img.src.startsWith('data:')) return;
    this.img.src = fallbackSrc(this.appFallback, this.fallbackAccent);
  }
}
