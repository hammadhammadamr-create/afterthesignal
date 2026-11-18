import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '../../../pipes/t.pipe';
import { ArtifactService } from '../../../../core/services/artifact-service';
import { Model } from '../../../../core/services/model';
import { Popover } from '../../../../core/services/popover';
import { I18n, LANGUAGES } from '../../../../core/services/i18n';
import { LangMenu } from '../lang-menu/lang-menu';
import { AgeMenu } from '../age-menu/age-menu';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

@Component({
  imports: [RouterLink, TranslatePipe, RouterLinkActive, LangMenu, AgeMenu, ThemeToggle],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {
  protected popover = inject(Popover);
  protected artifacts = inject(ArtifactService);
  protected modal = inject(Model);
  protected i18n = inject(I18n);

  protected readonly languages = LANGUAGES;
  protected readonly mobileOpen = signal(false);
  protected readonly activeOptions = {
    paths: 'exact',
    queryParams: 'ignored',
    fragment: 'ignored',
    matrixParams: 'ignored',
  } as const;

  protected toggleExplore(event: Event): void {
    event.stopPropagation();
    this.popover.toggle('explore');
  }

  /** أي كليك برّه القايمة بيقفلها (زي السلوك الأصلي) */
  @HostListener('document:click')
  protected closeAll(): void {
    this.popover.close();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.popover.close();
  }
}
