import { Directive, ElementRef, HostListener, inject, OnDestroy, Input } from '@angular/core';

/**
 * Adds a subtle 3D tilt effect to the host element as the pointer moves over it,
 * plus a glow that follows the cursor. Disabled for reduced-motion and touch.
 */
@Directive({
  selector: '[appTilt]',
  standalone: true,
})
export class TiltDirective implements OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private frame = 0;
  private pointerInside = false;

  @Input() tiltMax = 8;
  @Input() tiltScale = 1.04;
  @Input() tiltGlow = true;

  private get reducedMotion(): boolean {
    return typeof window !== 'undefined' && !!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private get isTouch(): boolean {
    return typeof window !== 'undefined' && 'ontouchstart' in window;
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (this.reducedMotion || this.isTouch) {
      return;
    }
    this.pointerInside = true;
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => this.apply(event));
  }

  @HostListener('pointerleave')
  onPointerLeave(): void {
    if (this.reducedMotion || this.isTouch) {
      return;
    }
    this.pointerInside = false;
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => this.reset());
  }

  private apply(event: PointerEvent): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * this.tiltMax;
    const rotateX = (0.5 - py) * this.tiltMax;

    this.el.nativeElement.style.transform =
      `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(${this.tiltScale})`;

    if (this.tiltGlow) {
      this.el.nativeElement.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      this.el.nativeElement.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      this.el.nativeElement.style.setProperty('--glow-opacity', '1');
    }
  }

  private reset(): void {
    this.el.nativeElement.style.transform =
      'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
    this.el.nativeElement.style.setProperty('--glow-opacity', '0');
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frame);
  }
}
