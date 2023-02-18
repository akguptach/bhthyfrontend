import { CustomFunctions } from 'src/app/shared/customFunctions/customFunctions';
import { CustomService } from 'src/app/service/custom.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
declare var $: any;

@Component({
  selector: 'app-confirm-project-complete',
  templateUrl: './confirmProjectComplete.component.html',
  styleUrls: ['./confirmProjectComplete.component.scss']
})
export class ConfirmProjectCompleteComponent implements OnInit {
  projectOfferRatingForm!: FormGroup;
  projectOffer$!: Observable<any>;
  projectOfferId!: string | null;
  rating!: any;
  submitted = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private customFunctions: CustomFunctions,
    private customService: CustomService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.projectOfferRatingForm = this.formBuilder.group({
      Id: ['', Validators.required],
      Rating: [''],
      description: ['', Validators.required],
    });
    this.route.paramMap.subscribe(param => {
      if (param.has('offerId')) {
        this.projectOfferId = param.get('offerId');
        this.projectOffer$ = this.customService.Get(`ProjectOffer/${param.get('offerId')}`);
        this.projectOffer$.subscribe(offer => {
          if (offer) {
            console.log('offer Info', offer);
            this.rating = offer.rating;
            if (this.rating) {
              this.projectOfferRatingForm.patchValue({
                Id: this.rating.id,
                Rating: this.rating.rate
              });
            }
          }

        });
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
      expertMessage: this.projectOfferRatingForm.controls.description.value,
      id: this.projectOfferRatingForm.controls.Id.value
    };
    this.customService.put(projectOfferRating, `ProjectOfferRating/${projectOfferRating.id}`).subscribe(res => {
      if (res) {
        this.customFunctions.showResponseMessage(res.description, res.code);
        if (res.code <= 300) {
          this.router.navigate(['/projects/dashboard']);
        }
      }
    });
  }

  hide() {
    this.projectOfferRatingForm.reset();
  }


}
