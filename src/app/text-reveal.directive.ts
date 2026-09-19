import { Directive, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';

/**
 * Premium word-by-word text reveal. Splits the host's text into words, wraps
 * each in an overflow-hidden mask, and staggers a slide-up + fade on scroll.
 *
 * Falls back to plain text when `prefers-reduced-motion` is set or when the
 * IntersectionObserver API is unavailable.
 */
@Directive({
  selector: '[appTextReveal]',
  standalone: true,
})
export class TextRevealDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;
  private words?: HTMLSpanElement[];

  ngOnInit(): void {
    const host = this.el.nativeElement;

    if (this.reducedMotion) {
      return;
    }

    const words = (host.textContent ?? '').split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      return;
    }

    this.split(host, words);

    if (typeof IntersectionObserver === 'undefined') {
      host.classList.add('revealed');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            host.classList.add('revealed');
            this.observer?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.35, rootMargin: '0px 0px -40px 0px' },
    );
    this.observer.observe(host);
  }

  private split(host: HTMLElement, words: string[]): void {
    const fragment = document.createDocumentFragment();

    words.forEach((word, index) => {
      const mask = document.createElement('span');
      mask.className = 'tw-mask';

      const inner = document.createElement('span');
      inner.className = 'tw-word';
      inner.style.setProperty('--i', String(index));
      inner.textContent = word;

      mask.appendChild(inner);
      fragment.appendChild(mask);

      if (index < words.length - 1) {
        fragment.appendChild(document.createTextNode(' '));
      }
    });

    host.classList.add('text-reveal');
    host.textContent = '';
    host.appendChild(fragment);
    this.words = Array.from(host.querySelectorAll<HTMLSpanElement>('.tw-word'));
  }

  private get reducedMotion(): boolean {
    return (
      typeof window !== 'undefined' &&
      !!window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}