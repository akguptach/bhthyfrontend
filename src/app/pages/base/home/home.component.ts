import { Observable, throwError } from 'rxjs';
import { catchError, retry, map, tap, mapTo } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomService } from 'src/app/service/custom.service';
import { CustomFunctions } from 'src/app/shared/customFunctions/customFunctions';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
 
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  categories$!: Observable<any>;
  private isClient: boolean = false;
  public formGorup: FormGroup = new FormGroup({});
  constructor(private customService: CustomService,
    public customFunction: CustomFunctions,
    private router: Router,
    private authService: AuthService,
    public http:HttpClient,
    private activeRoute: ActivatedRoute) { }

  linkedInToken:any='';
  ngOnInit(): void { 

    this.formGorup = new FormGroup({
      category: new FormControl(''),
      search: new FormControl(''),
    })
    this.isClient = this.authService.hasRole('Client');
    // this.router.paramMap.subscribe(param => {
    //   if (param.has('posId')) {
    //     this.categories$ = this.customService.Get(`OnlineMenu/GetCategory/${param.get('posId')}`);
    //   }
    // });
  }
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
 





  backgroundImg: string = "assets/images/img-background.png"

  public onSubmitForm() {
    if(this.isClient){
      this.router.navigate(['/hireExpert'], { queryParams: this.formGorup.value })

    }else {
      this.router.navigate(['/projects'], { queryParams: this.formGorup.value })

    }
  }

}
