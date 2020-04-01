import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { ResponsiveService } from '../services/responsive.service';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/internal/operators';
import { IConfig } from '../services/responsive.service';
import { map } from 'rxjs/internal/operators';

@Directive({
  selector: '[onlyForScreen]'
})
export class OnlyForScreenDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private responsiveService: ResponsiveService) { }

    @Input() set onlyForScreen(mode: string) {
      combineLatest([this.responsiveService.getWindowSize(), this.responsiveService.getConfig()])
      .pipe(
        take(1),
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
        })
      )
      .subscribe(curMode => {
        console.log('curMode', curMode);

        if (curMode === mode) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      });
  }
}
