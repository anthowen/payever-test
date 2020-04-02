import { Injectable } from '@angular/core';
import { fromEvent, Observable, of } from 'rxjs';
import { map, startWith, take} from 'rxjs/internal/operators';

export interface IConfig {
  mobile: number;
  tablet: number;
}

class Config implements IConfig {
  mobile: number;
  tablet: number;

  constructor(mobile = 0, tablet = 0) {
    this.mobile = mobile;
    this.tablet = tablet;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {

  constructor() {
  }

  public getWindowSizeObservable(): Observable<number> {
    return fromEvent(window, 'resize').pipe(
      map(event => (event.target as Window).innerWidth),
      startWith(window.innerWidth)
    );
  }

  public getConfigObservable(): Observable<IConfig> {
    return of(new Config(480, 1024));
  }

}
