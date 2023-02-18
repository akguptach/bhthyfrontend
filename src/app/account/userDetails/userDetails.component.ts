import { CustomFunctions } from 'src/app/shared/customFunctions/customFunctions';
import { CustomService } from 'src/app/service/custom.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-userDetails',
  templateUrl: './userDetails.component.html',
  // styleUrls: ['./userDetails.component.css']
})
export class UserDetailsComponent implements OnInit {


  id: any;
  userDetails: any;
  userSkills: any;
  userReview: any;
  userExperience: any;
  userWorks: any;
  certificationlist: any;
  data!: string;
  // ratingStyle = {
  //   starsStyle: { 'height': '22px', 'width': '22px' },
  //   ratingStyle: { 'font-size': '18px' },
  //   countStyle: { 'font-size': '14px' }
  // }
  constructor(
    private route: ActivatedRoute,
    private customService: CustomService,
    private customFunction: CustomFunctions

  ) { }

  ngDoCheck() {
  }

  ngOnInit() {
    moment.locale('en'); // set to english
    this.getUserDetails();
  }
  getUserDetails() {
    this.route.paramMap.subscribe(params => {
      this.customService.Get(`Identity/GetUserDetails/${params.get('id')}`).subscribe((userDetails: any) => {
        if (userDetails) {
          this.userDetails = userDetails.user;
          this.userSkills = userDetails.skills;
          this.userExperience = userDetails.experiences;
          this.userWorks = userDetails.works;
          this.userReview = userDetails.review;
          console.log(userDetails);
          console.log('userReview ', this.userReview);
        } else {
        }
      });
    });
  }




}
