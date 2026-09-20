import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollSpyService {
  readonly activeSection = signal<string>('hero');

  setActiveSection(section: string): void {
    if (this.activeSection() !== section) {
      this.activeSection.set(section);
    }
  }
}
