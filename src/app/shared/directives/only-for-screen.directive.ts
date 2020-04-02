import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { ResponsiveService } from '../services/responsive.service';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { take, tap, shareReplay } from 'rxjs/internal/operators';
import { IConfig } from '../services/responsive.service';
import { map } from 'rxjs/internal/operators';

@Directive({
  selector: '[onlyForScreen]'
})
export class OnlyForScreenDirective implements OnInit, OnDestroy {

  modeCheck$: Observable<string>;
  modeCheckSubscription: Subscription;
  mode: string;
  created: boolean = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private responsiveService: ResponsiveService) { }

  ngOnInit() {
    this.modeCheck$ = combineLatest([this.responsiveService.getWindowSizeObservable(), this.responsiveService.getConfigObservable()])
    .pipe(
      map(([viewportWidth, config] : [number, IConfig]) => {
        let curMode = 'none';
        if (config.mobile > viewportWidth) {
          curMode = 'mobile';
        } else if (config.mobile <= viewportWidth && config.tablet >= viewportWidth) {
          curMode = 'tablet';
        } else if (config.tablet <= viewportWidth) {
          curMode = 'desktop';
        }
        return curMode;
      }),
      shareReplay(1)
    );

    this.modeCheckSubscription = this.modeCheck$
    .pipe(
      tap(mode => {
        console.log(mode, this.mode);
        if (this.mode === mode && !this.created) {
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.created = true;
        } else {
          this.created = false;
          this.viewContainer.clear();
        }
      }),
    )
    .subscribe();
  }

  ngOnDestroy() {
    if (this.modeCheckSubscription) {
      this.modeCheckSubscription.unsubscribe();
    }
  }

  @Input() set onlyForScreen(mode: string) {
    this.mode = mode;
  }
}
 