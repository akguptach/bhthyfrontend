import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map, tap, mapTo } from 'rxjs/operators';
import { AppConfig } from '../config/config';
class Permission {
  id!: string;
  nameAr!: string;
  name!: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private serverurl = `${this._appConfig.setting['PathAPI']}api/Identity/`;
  private serverUrl = `${this._appConfig.setting['PathAPI']}api/`;
  private token: any;
  user: any;
  private readonly JWT_USER = 'Bhthy_USERNAME';
  private readonly REFERSH_ROKEN = 'Bhthy_REFERSH_TOKEN';
  private readonly JWT_TOKEN = 'Bhthy_JWT_TOKEN';
  private readonly JWT_ROLES = 'Bhthy_JWT_ROLES';
  private readonly JWT_PERMISSION = 'Bhthy_JWT_PERMISSION';
  constructor(
    private http: HttpClient, private router: Router, private _appConfig: AppConfig
  ) {
    // this.getUserPermissions();
  }
  // Handle API errors
  // tslint:disable-next-line:typedef
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
  // tslint:disable-next-line:ban-types
  registerUser(user: any): Observable<Object> {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    return this.http.post(`${this.serverurl}Login`, user, { headers }).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
  loginUser(user: any, routeAction: string): Observable<any> {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    return this.http.post(`${this.serverurl}${routeAction}`, user).pipe(
      tap((response: any) => {
        if (response.status === true) {
          this.doLoggIn(response);
          console.log(response);
        }
      }),
      retry(2),
      catchError(this.handleError)
    );
  }
  // tslint:disable-next-line:typedef
  refershToken() {
    // return this.http.post(`${this.serverurl}refersh` , {refershToken: this.getRefershToken()} ).pipe(
    //   tap( (token) => {this.storJwtTOken(token); } ) ,
    //   mapTo(true) ,
    //  retry(2),
    //  catchError(this.handleError)
    // );
  }


  changePassword(userInfo: any): Observable<any> {
    const headers = new HttpHeaders();
    this.loadToken();
    headers.append('Authorization', `${this.token}`);
    headers.set('content-type', 'application/json');
    headers.set('Access-Control-Allow-Origin', '*');
    return this.http.put(`${this.serverurl}changePassword`, userInfo, { headers }).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
  // tslint:disable-next-line:typedef
  storeUserData(token: any) {
    localStorage.setItem(this.JWT_TOKEN, token);
    localStorage.setItem(this.REFERSH_ROKEN, token);
    const roles: any = [];
    this.token = token;
  }
  setToken(token: string): void {
    localStorage.setItem(this.JWT_TOKEN, token);
    localStorage.setItem(this.REFERSH_ROKEN, token);
    this.token = token;
  }
  storJwtTOken(jwt: string): void {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }
  public roleMatch(allowedRole: any): boolean {
    let isMatch = false;
    if (this.isLoggedIn()) {
      const payLoad = JSON.parse(window.atob(localStorage!.getItem(this.JWT_TOKEN)!.split('.')[1]));
      const userRole = payLoad.userRole;
      // console.log('user role', userRole);
      // allowedRole.forEach(element => {
      if (userRole.trim() === allowedRole) {
        isMatch = true;
        // return false;
      }
    }
    return isMatch;
  }
  public hasAnyRoles(allowedRoles: Array<string>): boolean {
    let isMatch = false;
    if (this.isLoggedIn()) {
      const payLoad = JSON.parse(window.atob(localStorage!.getItem(this.JWT_TOKEN)!.split('.')[1]));
      const userRole = payLoad.userRole;
      // tslint:disable-next-line:prefer-for-of
      // for (let index = 0; index < userRole.length; index++) {
      if (allowedRoles.indexOf(userRole) > -1) {
        isMatch = true;
      }
      // }
    }
    return isMatch;
  }
  public hasRole(allowedRoles: string): boolean {
    let isMatch = false;
    if (this.isLoggedIn()) {
      const payLoad = JSON.parse(window.atob(localStorage!.getItem(this.JWT_TOKEN)!.split('.')[1]));
      const userRole = payLoad.userRole;
      // console.log('userRole ', userRole);

      // tslint:disable-next-line:prefer-for-of
      if (allowedRoles === userRole) {
        isMatch = true;
      }
    }
    return isMatch;
  }

  loadToken(): void {
    const authtoken = localStorage.getItem(this.JWT_TOKEN);
    this.token = authtoken;
  }
  doLoggIn(res: any): void {
    this.storeUserData(res.token);
  }
  public logout(): void {
    this.clearToken();
    this.router.navigate(['/#']);
    // return this.http.post(`${this.serverurl}logout` , {refershToken: this.getRefershToken()} ).pipe(
    //   tap( () => { this.doLogout(); } ) ,
    //   mapTo(true) ,
    //  retry(2),
    //  catchError(this.handleError)
    // );
  }

  public isLoggedIn(): boolean {
    return !!this.getJwtToken();
  }
  private clearToken(): void {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFERSH_ROKEN);
    localStorage.removeItem(this.JWT_ROLES);
    localStorage.removeItem(this.JWT_PERMISSION);
    localStorage.removeItem(this.JWT_USER);
    localStorage.removeItem('user_info');
  }
  getRefershToken(): any {
    return localStorage.getItem('');
  }
  getJwtToken(): any {
    return localStorage.getItem(this.JWT_TOKEN);
  }
  public getUserDetails(): any {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }
  public getUserId(): any {
    if (this.isLoggedIn()) {
      const payLoad = JSON.parse(window.atob(localStorage!.getItem(this.JWT_TOKEN)!.split('.')[1]));
      return payLoad.id;
    }
  }
  public getUserName(): any {
    if (this.isLoggedIn()) {
      const payLoad = JSON.parse(window.atob(localStorage!.getItem(this.JWT_TOKEN)!.split('.')[1]));

      return payLoad.name;
    }
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      const user = JSON.parse(payload);
      return user.name;
    } else {
      return null;
    }
  }

  getToken(): any {
    // if (!this.token) {
    //     this.token = localStorage.getItem(this.JWT_TOKEN);
    // }
    return localStorage.getItem(this.JWT_TOKEN);
  }
  loggedIn(): boolean {
    const user: any = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }
}
