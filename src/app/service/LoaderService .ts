import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private httpLoading$ = new ReplaySubject<boolean>(1);
  constructor() { }

  httpProgress(): Observable<boolean> {
    return this.httpLoading$.asObservable();
  }

  setHttpProgressStatus(inprogress: boolean) {
    this.httpLoading$.next(inprogress);
  }
}
//  this.loaderService.httpProgress().subscribe((status: boolean) => {
//       if (status) {
//         this.renderer.addClass(document.body, 'cursor-loader');
//       } else {
//         this.renderer.removeClass(document.body, 'cursor-loader');
//       }
//     });
