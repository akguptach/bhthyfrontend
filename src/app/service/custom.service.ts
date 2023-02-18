import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map, tap, mapTo } from 'rxjs/operators';
import { AppConfig } from '../config/config';
@Injectable({
  providedIn: 'root'
})
export class CustomService {
  private token: any;
  user: any;
  private serverUrl = `${this._appConfig.setting['PathAPI']}api/`;
  constructor(private http: HttpClient,
    private _appConfig: AppConfig) { }
  // Handle API errors
  // tslint:disable-next-line:typedef
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.log(error);

      console.error(
        `${error.error} Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
  post(data: any, url: string): Observable<any> {
    return this.http.post(`${this.serverUrl}${url}`, data).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
  put(data: any, url: string): Observable<any> {
    return this.http.put(`${this.serverUrl}${url}`, data).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
  Get(url: string): Observable<any> {
    return this.http.get(`${this.serverUrl}${url}`).pipe(
      catchError(this.handleError)
    );
  }
  Delete(url: string): Observable<any> {
    return this.http.delete(`${this.serverUrl}${url}`).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }


}
