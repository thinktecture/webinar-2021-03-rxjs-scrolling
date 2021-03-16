import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MonoTypeOperatorFunction, partition, race, Subject, Subscription } from 'rxjs';
import { debounceTime, repeat, take, tap } from 'rxjs/operators';

function repeatAfter<T>(delayMs: number): MonoTypeOperatorFunction<T> {
  return source$ => source$.pipe(debounceTime(delayMs), take(1), repeat());
}

@Component({
  selector: 'app-scrolling',
  templateUrl: './scrolling.component.html',
  styleUrls: ['./scrolling.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollingComponent implements OnInit, OnDestroy {
  readonly range = new Array(1000).fill(0).map((_, i) => i);

  @ViewChild('main', { read: ElementRef, static: true })
  readonly main?: ElementRef;

  @ViewChild('side', { read: ElementRef, static: true })
  readonly side?: ElementRef;

  private scroll$ = new Subject<'main' | 'side'>();
  private scrollSub = Subscription.EMPTY;

  ngOnInit(): void {
    const [mainScroll$, sideScroll$] = partition(this.scroll$, source => source === 'main');

    this.scrollSub = race([mainScroll$, sideScroll$])
      .pipe(
        tap(source => this.applyScroll(source)),
        repeatAfter(100),
      )
      .subscribe();
  }

  scroll(source: 'main' | 'side'): void {
    this.scroll$.next(source);
  }

  ngOnDestroy(): void {
    this.scrollSub.unsubscribe();
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
