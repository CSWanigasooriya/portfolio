import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ScrollSpyService } from './scroll-spy.service';
import { SnappyScrollDirective } from './snappy-scroll.directive';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterOutlet, SnappyScrollDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly themeService = inject(ThemeService);
  private readonly scrollSpy = inject(ScrollSpyService);

  readonly theme = this.themeService.currentTheme;
  readonly activeSection = this.scrollSpy.activeSection;
  readonly sidenavOpen = signal(false);
  readonly showBackToTop = signal(false);
  readonly currentYear = new Date().getFullYear();

  toggleSidenav(open?: boolean): void {
    this.sidenavOpen.set(open ?? !this.sidenavOpen());
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  backToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onScrollOrResize(): void {
    this.showBackToTop.set(window.scrollY > 400);
    if (window.innerWidth > 992 && this.sidenavOpen()) {
      this.sidenavOpen.set(false);
    }
  }
}
