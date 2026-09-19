import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose the current theme', () => {
    expect(typeof service.currentTheme()).toBe('string');
  });

  it('should toggle between dark and light', () => {
    const start = service.currentTheme();
    service.toggle();
    expect(service.currentTheme()).not.toBe(start);
    service.toggle();
    expect(service.currentTheme()).toBe(start);
  });
});
