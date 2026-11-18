import { afterNextRender, Component, inject } from '@angular/core';

import { Router, RouterOutlet } from '@angular/router';

import { Navbar } from './shared/components/navbar/navbar/navbar';
import { Footer } from './shared/components/footer/footer/footer';
import { AiAssistant } from './features/ai-assistant/ai-assistant/ai-assistant';
import { ThemeService } from './core/services/theme-service';
import { ArtifactModal } from './shared/components/artifact-modal/artifact-modal';

import { AgeModeService } from './core/services/age-mode.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, AiAssistant, ArtifactModal],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly theme = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly ageModeService = inject(AgeModeService);

  constructor() {
    afterNextRender(() => {
      const selectedMode = this.ageModeService.selectedMode();
      const currentUrl = this.router.url;

      if (!selectedMode && currentUrl !== '/age-selection') {
        void this.router.navigateByUrl('/age-selection');
      }
    });
  }
}
