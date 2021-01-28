import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-scrolling',
  templateUrl: './scrolling.component.html',
  styleUrls: ['./scrolling.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollingComponent {
  readonly range = new Array(1000).fill(0).map((_, i) => i);

  @ViewChild('main', { read: ElementRef, static: true })
  readonly main?: ElementRef;

  @ViewChild('side', { read: ElementRef, static: true })
  readonly side?: ElementRef;

  scroll(source: 'main' | 'side'): void {
    this.applyScroll(source);
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
