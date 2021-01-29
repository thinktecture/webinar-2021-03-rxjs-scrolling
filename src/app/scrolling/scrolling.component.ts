import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-scrolling',
  templateUrl: './scrolling.component.html',
  styleUrls: ['./scrolling.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollingComponent implements OnDestroy {
  readonly range = new Array(1000).fill(0).map((_, i) => i);

  @ViewChild('main', { read: ElementRef, static: true })
  readonly main?: ElementRef;

  @ViewChild('side', { read: ElementRef, static: true })
  readonly side?: ElementRef;

  // State variables
  private first?: 'main' | 'side';
  private timeout?: any;

  scroll(source: 'main' | 'side'): void {
    // remember which container scrolled first
    if (!this.first) {
      this.first = source;
    }

    // guard this function while the other container is scrolled
    if (this.first !== source) {
      return;
    }

    // adjust the scroll position
    this.applyScroll(source);

    // reset the timeout
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => (this.first = undefined), 200);
  }

  ngOnDestroy(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  private applyScroll(source: 'main' | 'side'): void {
    const sourceElementRef = source === 'main' ? this.main : this.side;
    const targetElementRef = source === 'main' ? this.side : this.main;

    if (targetElementRef && sourceElementRef) {
      const { scrollTop } = sourceElementRef.nativeElement;
      targetElementRef.nativeElement.scrollTop = scrollTop;
    }

    console.log('scrolling', source);
  }
}
