import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";

@Component({
  selector: 'app-linked-in-login',
  templateUrl: './linked-in-login.component.html',
  styleUrls: ['./linked-in-login.component.css']
})
export class LinkedInLoginComponent implements OnInit {

  linkedInToken = "";
  
  constructor(private route: ActivatedRoute) {}
  
  ngOnInit() {
    this.linkedInToken = this.route.snapshot.queryParams["code"];
    console.log(this.linkedInToken)
  }

   

}
