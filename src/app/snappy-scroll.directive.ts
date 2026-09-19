import { Directive, ElementRef, HostListener, inject, OnDestroy } from '@angular/core';

/**
 * Fast, Apple-like anchor scrolling. Intercepts clicks on `a[href^="#"]`
 * inside the host and animates with a short ease-out curve instead of the
 * browser's default smooth scroll (which feels sluggish and uncontrollable).
 *
 * Honors `prefers-reduced-motion` by jumping instantly.
 */
@Directive({
  selector: '[appSnappyScroll]',
  standalone: true,
})
export class SnappyScrollDirective implements OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private frame: number | null = null;

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    const anchor = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
    if (!anchor) {
      return;
    }

    const hash = anchor.getAttribute('href') ?? '';
    if (hash.length < 2) {
      return;
    }

    const destination = document.getElementById(hash.slice(1));
    if (!destination) {
      return;
    }

    event.preventDefault();
    this.cancel();

    const targetY = this.targetY(destination);
    const startY = window.scrollY;
    const distance = targetY - startY;

    if (Math.abs(distance) < 2) {
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      window.scrollTo({ top: targetY });
      return;
    }

    const started = performance.now();
    const duration = Math.min(720, Math.max(300, Math.abs(distance) * 0.45));

    // Temporarily disable CSS smooth-scrolling so per-frame scrolls are direct.
    document.documentElement.style.scrollBehavior = 'auto';

    const tick = (now: number): void => {
      const progress = Math.min(1, (now - started) / duration);
      window.scrollTo(0, startY + distance * easeOutQuart(progress));

      if (progress < 1) {
        this.frame = requestAnimationFrame(tick);
      } else {
        document.documentElement.style.scrollBehavior = '';
        this.frame = null;
      }
    };

    this.frame = requestAnimationFrame(tick);
  }

  /** Land the section just below the sticky app bar + section nav. */
  private targetY(destination: HTMLElement): number {
    let offset = 18;
    const appBar = document.querySelector('.app-bar') as HTMLElement | null;
    if (appBar) {
      offset += appBar.offsetHeight;
    }
    const sectionNav = document.querySelector('.section-nav') as HTMLElement | null;
    if (sectionNav) {
      offset += sectionNav.offsetHeight;
    }
    return destination.getBoundingClientRect().top + window.scrollY - offset;
  }

  private cancel(): void {
    if (this.frame !== null) {
      cancelAnimationFrame(this.frame);
      document.documentElement.style.scrollBehavior = '';
      this.frame = null;
    }
  }

  ngOnDestroy(): void {
    this.cancel();
  }
}

/** easeOutQuart — quick to act, settles with a satisfying deceleration. */
function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}