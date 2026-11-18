import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
} from '@angular/core';

import { TranslatePipe } from '../../../shared/pipes/t.pipe';
import { TimelineEvent, TimelineEventType } from '../../../core/services/models';

const TIMELINE_ICONS: Record<TimelineEventType, string> = {
  launch: '↗',
  landing: '↓',
  deployment: '⌁',
  discovery: '✦',
  milestone: '◆',
  communication: '⌁',
  end: '◉',
};
const TIMELINE_COLORS: Record<TimelineEventType, string> = {
  launch: '#60a5fa',
  landing: '#22c55e',
  deployment: '#a78bfa',
  discovery: '#facc15',
  milestone: '#22d3ee',
  communication: '#fb923c',
  end: '#f87171',
};

@Component({
  selector: 'app-artifact-timeline',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './artifact-timeline.css',
  templateUrl: './artifact-timeline.html',
})
export class ArtifactTimeline {
  readonly events = input.required<TimelineEvent[]>();
  protected colorOf(type: TimelineEventType): string {
    return TIMELINE_COLORS[type];
  }
  private readonly host = inject(ElementRef<HTMLElement>);

  private observer?: IntersectionObserver;
  private activeObserver?: IntersectionObserver;

  private visibleItems = new Set<HTMLElement>();

  constructor() {
    afterRenderEffect((onCleanup) => {
      // Track input changes
      this.events();

      this.initScrollReveal(onCleanup);
    });
  }

  protected iconOf(type: TimelineEventType): string {
    return TIMELINE_ICONS[type];
  }

  private initScrollReveal(onCleanup: (cleanupFn: () => void) => void): void {
    const host = this.host.nativeElement;

    const items = host.querySelectorAll('.timeline-event') as NodeListOf<HTMLElement>;

    this.visibleItems.clear();
    this.updateProgress(items, undefined);

    // Reset previous visual states
    items.forEach((item: HTMLElement) => {
      item.classList.remove('is-visible', 'is-active');
    });

    if (!items.length) {
      host.classList.remove('reveal-pending');
      return;
    }

    host.classList.add('reveal-pending');

    // Fallback for unsupported browsers
    if (typeof IntersectionObserver === 'undefined') {
      host.classList.remove('reveal-pending');

      items.forEach((item: HTMLElement) => {
        item.classList.add('is-visible');
      });

      items[0]?.classList.add('is-active');
      this.updateProgress(items, items[0]);
      return;
    }

    // Scroll Reveal Observer
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const item = entry.target as HTMLElement;

          item.classList.add('is-visible');
          this.observer?.unobserve(item);
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      },
    );

    // Active Event Observer
    this.activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const item = entry.target as HTMLElement;

          if (entry.isIntersecting) {
            this.visibleItems.add(item);
          } else {
            this.visibleItems.delete(item);
          }
        });

        const rootBounds = entries[0]?.rootBounds;

        if (!rootBounds) return;

        const center = rootBounds.top + rootBounds.height / 2;

        const activeItem = [...this.visibleItems].sort((a, b) => {
          const centerA = a.getBoundingClientRect().top + a.offsetHeight / 2;

          const centerB = b.getBoundingClientRect().top + b.offsetHeight / 2;

          return Math.abs(centerA - center) - Math.abs(centerB - center);
        })[0];

        host.querySelector('.timeline-event.is-active')?.classList.remove('is-active');

        activeItem?.classList.add('is-active');

        this.updateProgress(items, activeItem);
      },
      {
        threshold: 0,
        rootMargin: '-45% 0px -45% 0px',
      },
    );

    // Observe all events
    items.forEach((item: HTMLElement) => {
      this.observer?.observe(item);
      this.activeObserver?.observe(item);
    });

    // Cleanup before reinitialization or component destruction
    onCleanup(() => {
      this.observer?.disconnect();
      this.activeObserver?.disconnect();

      this.observer = undefined;
      this.activeObserver = undefined;

      this.visibleItems.clear();
    });
  }
  private updateProgress(
    items: NodeListOf<HTMLElement>,
    activeItem: HTMLElement | undefined,
  ): void {
    const progress = this.host.nativeElement.querySelector(
      '.timeline-progress-fill',
    ) as HTMLElement | null;

    if (!progress) return;

    if (!activeItem || !items.length) {
      progress.style.height = '0%';
      return;
    }

    const activeIndex = Array.from(items).indexOf(activeItem);

    if (activeIndex === -1) return;

    const progressPercentage = ((activeIndex + 0.5) / items.length) * 100;

    progress.style.height = `${progressPercentage}%`;
    progress.style.setProperty(
      '--active-event-color',
      this.colorOf(activeItem.getAttribute('data-event-type') as TimelineEventType),
    );
  }
  protected onEventKeydown(event: KeyboardEvent): void {
    const currentItem = event.currentTarget;

    if (!(currentItem instanceof HTMLElement)) return;
    const nodeList = this.host.nativeElement.querySelectorAll('.timeline-event');

    const items: HTMLElement[] = Array.from(nodeList) as HTMLElement[];

    const currentIndex = items.indexOf(currentItem);

    if (currentIndex === -1) return;

    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowDown':
        nextIndex = Math.min(currentIndex + 1, items.length - 1);
        break;

      case 'ArrowUp':
        nextIndex = Math.max(currentIndex - 1, 0);
        break;

      case 'Home':
        nextIndex = 0;
        break;

      case 'End':
        nextIndex = items.length - 1;
        break;

      case 'Enter':
      case ' ':
        this.selectEvent(event);
        return;

      default:
        return;
    }

    event.preventDefault();

    const nextItem = items[nextIndex];

    nextItem.focus();
    this.selectEventFromItem(nextItem, true);
  }
  private selectEventFromItem(item: HTMLElement, shouldScroll = false): void {
    const host = this.host.nativeElement;

    host.querySelector('.timeline-event.is-active')?.classList.remove('is-active');

    item.classList.add('is-active');

    const items = host.querySelectorAll('.timeline-event') as NodeListOf<HTMLElement>;

    this.updateProgress(items, item);

    if (shouldScroll) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      item.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'center',
      });
    }
  }
  protected selectEvent(event: Event): void {
    const item = event.currentTarget;

    if (!(item instanceof HTMLElement)) return;

    this.selectEventFromItem(item);
  }
}
