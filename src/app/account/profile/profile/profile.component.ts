import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { CustomService } from './../../../service/custom.service';
import { Observable } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user_response: any = {};
  first_name: any = {};
  last_name: any = {};
  userid!: string;
  token!: string;
  about_me!: string;
  reviewslist: any;
  bidstatsprojectslist: any;
  projectsstatslist: any;
  usersloglist: any;
  portfolioslist: any;
  educationlist: any;
  certificationlist: any;
  publicationlist: any;
  experiencelist: any;
  job_completed: any;
  on_time: any;
  on_budget: any;
  repeat_hire_rate: any;
  skillslist: any;
  addskillForm!: FormGroup;
  addskill: any;
  username!: string;
  error_msg: any;
  isError!: boolean;
  @Input() showProgress: boolean = false;
  usersdata: any;
  langs!: string;
  userInfo$!: Observable<any>;
  userReview$!: Observable<any>;
  constructor(
    private customService: CustomService,
    public authService: AuthService,
    public router: Router,
    private formBuilder: FormBuilder) { }

  ngDoCheck() {
    if (!this.isExpert()) {
      this.router.navigate(['/account/account']);
    }
  }

  isExpert(): boolean {
    if (this.authService.hasRole('ExpertAndClient')) {
      if (localStorage.getItem('userType')) {
        const userType = localStorage.getItem('userType')?.toString();
        if (userType === 'expert') {
          return true;
        } else {
          return false;
        }
      } else {
        localStorage.setItem('userType', 'expert');
        return true;
      }
    } else if (this.authService.hasRole('Expert')) {
      return true;
    }
    else {
      return false;
    }
  }
  ngOnInit() {
    this.reviews();
    this.bidstatsprojects();
    this.projectsstats();
    this.userslog();
    this.expertskills();
    this.userInfo$ = this.customService.Get(`Identity/GetUserProfile`);
    // if (this.authService.hasAnyRoles(['ExpertAndClient', 'Client'])) {
    this.userReview$ = this.customService.Get(`Identity/GetUserReview`);
    // }

    this.userInfo$.subscribe(userInfo => {
      console.log('userInfo ', userInfo);

    })
    this.addskillForm = this.formBuilder.group({
      Name: ['', Validators.required],
      Details: ['', Validators.required],
    });

  }

  reviews() {

  }

  bidstatsprojects() {

  }

  projectsstats() {

  }

  userslog() {

  }

  portfolios() {

  }

  education() {

  }

  certification() {

  }

  publication() {

  }

  experience() {

  }

  expertskills() {

  }

  onSubmit() {

  }

}
