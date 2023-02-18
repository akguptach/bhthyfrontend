import { ActivatedRoute, Router } from '@angular/router';
import { CustomFunctions } from 'src/app/shared/customFunctions/customFunctions';
import { CustomService } from 'src/app/service/custom.service';
import { Observable, Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as moment from 'moment';
import { ProjectOfferStatus } from 'src/app/shared/ItemList/Enum';
@Component({
  selector: 'app-projectOffers',
  templateUrl: './projectOffers.component.html',
  styleUrls: ['./projectOffers.component.scss']
})
export class ProjectOffersComponent implements OnInit {
  projectOffers$!: Observable<any>;
  showModal = false;
  projectOfferStatus = ProjectOfferStatus;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public customFunction: CustomFunctions,
    private customService: CustomService
  ) { }

  ngOnInit() {
    moment.locale('en'); // set to english
    this.getOffers();
  }
  getOffers(): void {
    this.route.paramMap.subscribe(param => {
      if (param.has('id')) {
        this.projectOffers$ = this.customService.Get(`ProjectOffer/GetByProject/${param.get('id')}`);;
      }
    });
  }
  updateOfferStatus(id: string, status: number): void {
    this.customFunction.customConfirm('Are You Sure To Accept', () => {
      this.customService.put(null, `ProjectOffer/UpdateStatus/${id}/${status}`).subscribe(res => {
        this.customFunction.showResponseMessage(res.description, res.code)
        if (res.code <= 300) {
          this.getOffers();
        }
      });
    })
  }

  acceptStatus(id: string): void {
    this.customFunction.customConfirm('Are You Sure To Accept', () => {
      this.customService.Get(`ProjectOffer/AcceptOffer/${id}`).subscribe(res => {
        // this.customFunctions.showResponseMessage(res.description, res.code)
        console.log(res);
        if (res.session_id) {
          sessionStorage.setItem('session_id', res.session_id);
        }
        window.location.href = res.url;
        // if (res.code <= 300) {
        //   this.getOffers();
        // }
      });
    })
  }

  hide() {
    this.showModal = false;
  }


}
