import { ActivatedRoute } from '@angular/router';
import { CustomFunctions } from 'src/app/shared/customFunctions/customFunctions';
import { CustomService } from 'src/app/service/custom.service';
import { Observable } from 'rxjs';
// import * as moment from 'moment';
// import 'moment/locale/ar-sa';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
@Component({
  selector: 'app-myOffers',
  templateUrl: './myOffers.component.html',
  styleUrls: ['./myOffers.component.scss']
})
export class MyOffersComponent implements OnInit {
  searchfilterForm!: FormGroup;
  showModal!: boolean;
  myOffers: Array<any> = [];
  services$!: Observable<any>;
  subServices$!: Observable<any>;
  priceRanges$!: Observable<any>;
  skills$!: Observable<any>;
  submitted = false;
  skip = 0;
  take = 10;
  // moment = moment;
  routeUrl = 'GetByFreeLancer';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private customFunctions: CustomFunctions,
    private customService: CustomService
  ) { }

  ngOnInit() {
    // moment.locale('en');
    this.route.paramMap.subscribe(param => {
      if (param.has('offerType')) {
        if (param.get('offerType') === 'InviteOffers') {
          this.routeUrl = 'GetInviteProject';
        } else if (param.get('offerType') === 'MyOffers') {
          this.routeUrl = 'GetByFreeLancer';
        }
      }
    })
    this.customService.Get(`ProjectOffer/${this.routeUrl}`).subscribe(res => {
      this.myOffers = res;
      console.log('myOffers ', res);
    });
    this.searchfilterForm = this.formBuilder.group({
      search: [null],
      ServiceId: ['', Validators.required],
      project_range_id: [null],
    });
  }

  searchProjects() {
    this.submitted = true;
    if (this.searchfilterForm.invalid) {
      this.customFunctions.showResponseMessage('Please validate All Filed is Correct ', false);
      return;
    }
    const data = {
      serviceId: this.searchfilterForm.controls.ServiceId.value,
      priceRangeId: this.searchfilterForm.controls.project_range_id.value,
      name: this.searchfilterForm.controls.search.value,
      take: this.take,
      skip: this.skip
    }
    console.log('data ', data);
    this.customService.post(data, 'Project/FindProjectByUser').subscribe(res => {
      if (res) {
        console.log('res ', res);
        this.myOffers = res.data;
      }
    });
  }


}
