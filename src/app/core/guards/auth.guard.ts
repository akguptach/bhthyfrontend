import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    // tslint:disable-next-line:no-string-literal
    const roles = route.data['roles'] as Array<string>;
    //removed cmnd
    /*
    if (!this.auth.loggedIn()) {
      this.auth.logout();
      return false;
    } else {
      if (roles) {
        // const userType = this.router.paramMap.get('userType');
        if (!this.auth.hasAnyRoles(roles)) {
          // if (!this.auth.loggedIn()) {
          this.auth.logout();
          // this.router.navigateByUrl('/auth/login');
          return false;
        }
      }
    }*/
    return true;
  }

}




