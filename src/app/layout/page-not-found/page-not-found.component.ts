import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  adminEmail : string;

  constructor(private _location: Location) { }

  ngOnInit() {
    // localStorage.getItem("adminEmail");
  }

  backClicked() {
    this._location.back();
  }

}
