import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  public isLoading = new BehaviorSubject(false);
  private httpLoading$ = new ReplaySubject<boolean>(1);
  constructor() { }
  httpProgress(): Observable<boolean> {
    return this.httpLoading$.asObservable();
  }

  // tslint:disable-next-line:typedef
  setHttpProgressStatus(inprogress: boolean) {
    this.httpLoading$.next(inprogress);
  }
}
