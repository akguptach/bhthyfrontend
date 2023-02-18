import { AuthService } from '../service/auth.service';
import { Injectable } from '@angular/core';
// import { LoaderService } from '../services/LoaderService ';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, finalize, catchError, switchMap, filter, take } from 'rxjs/operators';
import { CustomFunctions } from '../shared/customFunctions/customFunctions';
import { Router } from '@angular/router';
import { LoaderService } from '../service/loader.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefershing = false;
  private refershTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private count = 0;

  constructor(private authServiceService: AuthService,
    private loaderService: LoaderService, private spinner: NgxSpinnerService,
    private customFunctions: CustomFunctions, private _router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.count === 0) {
      this.loaderService.setHttpProgressStatus(true);
      this.spinner.show();
      console.log('setHttpProgressStatus true');
    }
    this.count++;
    // this.authServiceService.roleMatch("Admin");
    if (this.authServiceService.getJwtToken()) {
      request = this.addToken(request, 'Bearer ' + this.authServiceService.getJwtToken());
    }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    }
    request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
    return next.handle(request).pipe(
      finalize(() => {
        this.count--;
        if (this.count === 0) {
          this.loaderService.setHttpProgressStatus(false);
          this.spinner.hide();
          console.log('setHttpProgressStatus false');
        }
      })

    );
  }
  addToken(request: HttpRequest<any>, token: string): HttpRequest<unknown> {
    return request.clone({
      setHeaders: { Authorization: token }
    });
  }
  // tslint:disable-next-line:typedef
  handle401Error(request: HttpRequest<unknown>, next: HttpHandler) {
    // if (!this.isRefershing) {
    //   this.isRefershing = true;
    //   this.refershTokenSubject.next(null);
    //   return this.authServiceService.refershToken().pipe(
    //     switchMap(( token: any ) => {
    //       this.isRefershing = false;
    //       this.refershTokenSubject.next(token.jwt);
    //       return next.handle(this.addToken(request , token.jwt));
    //     })
    //   );
    // this.authServiceService.logout();
    //   this.isRefershing = true;
    //   retrun next();
    // } else {
    return this.refershTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(jwt => {
        return next.handle(this.addToken(request, jwt));
      })
    );
    // }
  }
}
