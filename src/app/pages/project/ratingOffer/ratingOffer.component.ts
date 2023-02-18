import { CustomFunctions } from 'src/app/shared/customFunctions/customFunctions';
import { CustomService } from 'src/app/service/custom.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-rating-offer',
  templateUrl: './ratingOffer.component.html',
  styleUrls: ['./ratingOffer.component.scss']
})
export class RatingOfferComponent implements OnInit {
  projectOfferRatingForm!: FormGroup;
  projectOffer$!: Observable<any>;
  projectOfferId!: string | null;
  submitted = false;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    private customFunctions: CustomFunctions,
    private customService: CustomService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.projectOfferRatingForm = this.formBuilder.group({
      Rate: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.route.paramMap.subscribe(param => {
      if (param.has('offerId')) {
        this.projectOfferId = param.get('offerId');
        this.projectOffer$ = this.customService.Get(`ProjectOffer/${param.get('offerId')}`);
      }
    });
  }
  get form() {
    return this.projectOfferRatingForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.projectOfferRatingForm.invalid) {
      this.customFunctions.showResponseMessage('Please validate All Filed is Correct ', false);
      return;
    }
    const projectOfferRating: any = {
      projectOwnerMessage: this.projectOfferRatingForm.controls.description.value,
      rate: this.projectOfferRatingForm.controls.Rate.value,
      offerId: this.projectOfferId
    };
    this.customService.post(projectOfferRating, 'ProjectOfferRating').subscribe(res => {
      if (res) {
        this.customFunctions.showResponseMessage(res.description, res.code);
        if (res.code <= 300) {
          this._location.back();
        }
      }
    });
  }

  hide() {
    this.projectOfferRatingForm.reset();
  }


}
