import { effect, Injectable, signal, type WritableSignal } from '@angular/core';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly theme: WritableSignal<Theme> = signal<Theme>('light');
  readonly currentTheme = this.theme.asReadonly();

  constructor() {
    this.theme.set(this.getInitialTheme());
    effect(() => this.applyTheme());
    this.watchSystemPreference();
  }

  toggle(): void {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  private getInitialTheme(): Theme {
    if (typeof document === 'undefined') {
      return 'light';
    }
    const rootTheme = document.documentElement.getAttribute('data-theme');
    if (rootTheme === 'light' || rootTheme === 'dark') {
      return rootTheme;
    }
    return this.systemPreference();
  }

  private systemPreference(): Theme {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return 'light';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private applyTheme(): void {
    const theme = this.theme();
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, theme);
      }
    } catch (e) {
      // ignore storage failures (e.g. private mode)
    }
    const meta = typeof document !== 'undefined' ? document.getElementById('meta-theme-color') : null;
    if (meta) {
      (meta as HTMLMetaElement).content = theme === 'dark' ? '#0a0f1a' : '#f6f8fc';
    }
  }

  private watchSystemPreference(): void {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (event: MediaQueryListEvent): void => {
      // Only follow the system change if the user hasn't explicitly chosen a theme.
      let hasPreference = true;
      try {
        hasPreference = typeof localStorage !== 'undefined' && !!localStorage.getItem(STORAGE_KEY);
      } catch (e) {
        hasPreference = false;
      }
      if (!hasPreference) {
        this.theme.set(event.matches ? 'dark' : 'light');
      }
    };
    if (media.addEventListener) {
      media.addEventListener('change', handler);
    } else if ((media as unknown as { addListener: (fn: (e: MediaQueryListEvent) => void) => void }).addListener) {
      (media as unknown as { addListener: (fn: (e: MediaQueryListEvent) => void) => void }).addListener(handler);
    }
  }
}
