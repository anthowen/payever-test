import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { fromEvent, Observable, Subscription, of } from 'rxjs';
import { map, startWith} from 'rxjs/internal/operators';


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

  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

  config: IConfig;

  constructor() {

   }

  public getWindowSize(): Observable<number> {
    return fromEvent(window, 'resize').pipe(
      map(event => (event.target as Window).innerWidth),
      startWith(window.innerWidth)
    );
  }

  public getConfig(): Observable<IConfig> {
    return of(new Config(480, 1024));
  }

}
