import { CommonModule } from '@angular/common';
import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';
import { ScrollRevealDirective } from '../../scroll-reveal.directive';
import { ScrollSpyService } from '../../scroll-spy.service';
import { SnappyScrollDirective } from '../../snappy-scroll.directive';
import { TextRevealDirective } from '../../text-reveal.directive';
import { TiltDirective } from '../../tilt.directive';

export interface Project {
  title: string;
  description: string;
  color: string;
  categories: Category[];
  link?: string;
  tech: string;
}

export type Category = 'All' | 'Web' | 'Android' | 'Machine Learning' | 'Hardware';

const PROJECTS: Project[] = [
  {
    title: 'Educational Institute Management System',
    description:
      'Website for an institute to manage students\u2019 enrolment and online reservations of the institute\u2019s auditorium.',
    color: '#6366f1',
    categories: ['Web'],
    link: 'https://github.com/CSWanigasooriya',
    tech: 'PHP · JavaScript · Materialize',
  },
  {
    title: 'MNIST Handwritten Digit Classification',
    description:
      'Angular app with object detection and digit recognizer using TensorFlow.js and MNIST handwritten digit classification.',
    color: '#ff6f00',
    categories: ['Web', 'Machine Learning'],
    link: 'https://github.com/CSWanigasooriya',
    tech: 'TensorFlow.js · Angular',
  },
  {
    title: 'University Results Management System',
    description: 'Angular application for university results management.',
    color: '#0ea5e9',
    categories: ['Web'],
    link: 'https://github.com/CSWanigasooriya/Result-Management-System',
    tech: 'Angular · Firebase · PHP',
  },
  {
    title: 'VIMBAL — Decentralized Publication System',
    description:
      'A blockchain-based publication system for open research, combining Ethereum smart contracts and IPFS to publish science for free and reward reviewers with cryptocurrency.',
    color: '#3c3c3d',
    categories: ['Web'],
    link: 'https://github.com/CSWanigasooriya',
    tech: 'Solidity · Ethereum · IPFS',
  },
  {
    title: 'English-Sinhala Android Translator',
    description: 'An Android app to translate English words to Sinhala.',
    color: '#22c55e',
    categories: ['Android'],
    link: 'https://github.com/CSWanigasooriya',
    tech: 'Android',
  },
  {
    title: 'MIDI-Piano',
    description: 'Android piano app.',
    color: '#8b5cf6',
    categories: ['Android'],
    link: 'https://github.com/CSWanigasooriya',
    tech: 'Android',
  },
  {
    title: 'Arduino Phone Follower',
    description:
      'An Arduino project using the u-Blox NEO 6M GPS, QMC5883L compass and HC-06 Bluetooth that follows a phone.',
    color: '#00979d',
    categories: ['Hardware'],
    link: 'https://github.com/CSWanigasooriya',
    tech: 'Arduino · C++',
  },
  {
    title: 'Student Management System',
    description: 'Java student management system.',
    color: '#ec4899',
    categories: ['Web'],
    link: 'https://github.com/CSWanigasooriya',
    tech: 'Java',
  },
];

const CATEGORIES: Category[] = ['All', 'Web', 'Android', 'Machine Learning', 'Hardware'];


const SKILL_GROUPS: { title: string; skills: { label: string; url: string }[] }[] = [
  {
    title: 'Languages & Frameworks',
    skills: [
      { label: 'Java', url: 'https://www.java.com/' },
      { label: 'Spring Boot', url: 'https://spring.io/projects/spring-boot' },
      { label: 'Angular', url: 'https://angular.io/' },
      { label: 'TypeScript', url: 'https://www.typescriptlang.org/' },
      { label: 'Python', url: 'https://www.python.org/' },
      { label: 'HTML5', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
    ],
  },
  {
    title: 'Cloud & DevOps',
    skills: [
      { label: 'AWS', url: 'https://aws.amazon.com/' },
      { label: 'Docker', url: 'https://www.docker.com/' },
      { label: 'Kubernetes', url: 'https://kubernetes.io/' },
      { label: 'Firebase', url: 'https://firebase.google.com/' },
      { label: 'Git', url: 'https://git-scm.com/' },
      { label: 'GitLab', url: 'https://gitlab.com/' },
    ],
  },
  {
    title: 'Databases & Caching',
    skills: [
      { label: 'PostgreSQL', url: 'https://www.postgresql.org/' },
      { label: 'MySQL', url: 'https://www.mysql.com/' },
      { label: 'MongoDB', url: 'https://www.mongodb.com/' },
      { label: 'Redis', url: 'https://redis.io/' },
    ],
  },
  {
    title: 'Development Tools',
    skills: [
      { label: 'IntelliJ IDEA', url: 'https://www.jetbrains.com/idea/' },
      { label: 'VS Code', url: 'https://code.visualstudio.com/' },
      { label: 'Postman', url: 'https://www.postman.com/' },
      { label: 'Jira', url: 'https://www.atlassian.com/software/jira' },
      { label: 'Splunk', url: 'https://www.splunk.com/' },
      { label: 'Linux', url: 'https://www.linux.org/' },
    ],
  },
];

const NAV_SECTIONS = ['about', 'skills', 'projects', 'experience', 'education', 'credentials', 'contact'];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective, SnappyScrollDirective, TextRevealDirective, TiltDirective],
})
export class HomeComponent implements OnInit {
  readonly greeting = "Hello, I'm Chamath Wanigasooriya.";

  readonly projects = PROJECTS;
  readonly categories = CATEGORIES;
  readonly skillGroups = SKILL_GROUPS;
  readonly navSections = NAV_SECTIONS;

  readonly activeFilter = signal<Category>('All');

  readonly filteredProjects = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'All') {
      return this.projects;
    }
    return this.projects.filter((p) => p.categories.includes(filter));
  });

  private readonly scrollSpy = inject(ScrollSpyService);
  readonly activeSection = this.scrollSpy.activeSection;
  readonly showFabHint = signal(false);

  ngOnInit(): void {
    this.typeName(this.greeting, 0);
    this.showFabHint.set(
      typeof localStorage !== 'undefined' && !localStorage.getItem('fabHintSeen'),
    );
    this.updateActiveSection();
  }

  setFilter(category: Category): void {
    this.activeFilter.set(category);
  }

  onFabHintSeen(): void {
    if (this.showFabHint() && typeof localStorage !== 'undefined') {
      localStorage.setItem('fabHintSeen', '1');
      this.showFabHint.set(false);
    }
  }

  typeName(name: string, iteration: number): void {
    if (iteration === name.length) {
      return;
    }

    setTimeout(() => {
      const el = document.querySelector('.main-header') as HTMLElement | null;
      if (el) {
        el.textContent = (el.textContent ?? '') + name[iteration];
      }
      this.typeName(name, iteration + 1);
    }, 22);
  }

  private isTicking = false;

  @HostListener('window:scroll')
  onScroll(): void {
    if (!this.isTicking) {
      window.requestAnimationFrame(() => {
        this.updateActiveSection();
        this.isTicking = false;
      });
      this.isTicking = true;
    }
  }

  private updateActiveSection(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const scrollY = window.scrollY;
    const triggerPoint = scrollY + window.innerHeight * 0.38;

    // If still in the hero banner (before About section enters view)
    const aboutSection = document.getElementById('about');
    if (aboutSection && scrollY < aboutSection.offsetTop - window.innerHeight * 0.45) {
      this.scrollSpy.setActiveSection('hero');
      return;
    }

    let current = NAV_SECTIONS[0];
    for (const id of NAV_SECTIONS) {
      const section = document.getElementById(id);
      if (section && section.offsetTop <= triggerPoint) {
        current = id;
      }
    }

    const scrollBottom =
      window.innerHeight + scrollY >= document.body.offsetHeight - 80;
    if (scrollBottom) {
      current = NAV_SECTIONS[NAV_SECTIONS.length - 1];
    }

    const prevSection = this.scrollSpy.activeSection();
    this.scrollSpy.setActiveSection(current);

    // Only scroll horizontal navInner on mobile if section changed (NEVER call scrollIntoView!)
    if (prevSection !== current) {
      const navInner = document.querySelector('.section-nav-inner') as HTMLElement | null;
      const activePill = document.querySelector(`.section-nav a[href="#${current}"]`) as HTMLElement | null;
      if (navInner && activePill && navInner.scrollWidth > navInner.clientWidth) {
        const pillLeft = activePill.offsetLeft;
        const pillWidth = activePill.offsetWidth;
        const targetScroll = pillLeft - navInner.clientWidth / 2 + pillWidth / 2;
        navInner.scrollTo({ left: targetScroll, behavior: 'smooth' });
      }
    }
  }
}
