import { Directive, ElementRef, HostListener, inject, OnDestroy, OnInit } from '@angular/core';

/**
 * Apple-style scroll-driven showcase. The host is a tall "track" with a
 * sticky, full-height child inside. As the user scrolls through the track,
 * the active full-view panel crossfades — one view "turns" into the next.
 *
 * Usage:
 *   <section appShowcase>
 *     <div class="showcase-track">
 *       <div class="showcase-sticky">
 *         <div class="showcase-panel">…</div>
 *         <div class="showcase-panel">…</div>
 *       </div>
 *     </div>
 *   </section>
 */
@Directive({
  selector: '[appShowcase]',
  standalone: true,
})
export class ShowcaseDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private frame: number | null = null;
  private panelCount = 0;

  ngOnInit(): void {
    this.panelCount = this.el.nativeElement.querySelectorAll('.showcase-panel').length;
    if (this.panelCount > 0) {
      this.update();
    }
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onScroll(): void {
    this.schedule();
  }

  private schedule(): void {
    if (this.frame !== null) {
      cancelAnimationFrame(this.frame);
    }
    this.frame = requestAnimationFrame(() => this.update());
  }

  private update(): void {
    const track = this.el.nativeElement;
    const sticky = track.querySelector('.showcase-sticky') as HTMLElement | null;
    if (!sticky || this.panelCount === 0) {
      return;
    }

    const rect = track.getBoundingClientRect();
    const navHeight = 70; // matches --nav-h
    const range = Math.max(1, track.offsetHeight - sticky.offsetHeight);
    const progress = Math.min(1, Math.max(0, (navHeight - rect.top) / range));
    const index = Math.min(this.panelCount - 1, Math.floor(progress * this.panelCount));

    const panels = Array.from(track.querySelectorAll('.showcase-panel')) as HTMLElement[];
    panels.forEach((panel, i) => {
      const active = i === index;
      panel.classList.toggle('is-active', active);
      panel.setAttribute('aria-hidden', String(!active));
    });

    const dots = Array.from(track.querySelectorAll('.showcase-dot')) as HTMLElement[];
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));

    const counter = track.querySelector('.showcase-counter') as HTMLElement | null;
    if (counter) {
      counter.textContent = String(index + 1).padStart(2, '0');
      counter.style.setProperty('--progress', String(Math.round(progress * 100)));
    }

    this.frame = null;
  }

  ngOnDestroy(): void {
    if (this.frame !== null) {
      cancelAnimationFrame(this.frame);
    }
  }
}