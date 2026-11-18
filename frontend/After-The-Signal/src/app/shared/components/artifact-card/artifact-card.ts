import { Component, computed, inject, Input, signal } from '@angular/core';
import { Model } from '../../../core/services/model';
import { Artifact } from '../../../core/services/models';
import { accentOf } from '../../../core/services/utils';
import { TranslatePipe } from '../../pipes/t.pipe';
import { ImgFallbackDirective } from '../../directives/img-fallback.directive';

@Component({
  imports: [TranslatePipe, ImgFallbackDirective],
  selector: 'app-artifact-card',
  styleUrl: './artifact-card.css',
  templateUrl: './artifact-card.html',
})
export class ArtifactCard {
  private modal = inject(Model);

  protected readonly data = signal<Artifact | null>(null);
  protected readonly accent = computed(() => accentOf(this.data()?.world ?? ''));

  @Input({ required: true }) set artifact(value: Artifact) {
    this.data.set(value);
  }

  protected open(event?: Event): void {
    event?.preventDefault();
    const a = this.data();
    if (a) this.modal.open(a.id);
  }
}
