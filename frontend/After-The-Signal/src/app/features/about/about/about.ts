import { Component } from '@angular/core';
import { TranslatePipe } from '../../../shared/pipes/t.pipe';
import { ImgFallbackDirective } from '../../../shared/directives/img-fallback.directive';

@Component({
  imports: [TranslatePipe, ImgFallbackDirective],
  selector: 'app-about',
  styleUrl: './about.css',
  templateUrl: './about.html',
})
export class About {}
