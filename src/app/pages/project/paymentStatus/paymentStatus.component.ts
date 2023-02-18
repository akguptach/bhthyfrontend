import { CustomFunctions } from 'src/app/shared/customFunctions/customFunctions';
import { CustomService } from 'src/app/service/custom.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-payment-status',
  templateUrl: './paymentStatus.component.html',
  styleUrls: ['./paymentStatus.component.scss']
})
export class PaymentStatusComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private customFunctions: CustomFunctions,
    private customService: CustomService) { }

  ngOnInit() {

    this.route.paramMap.subscribe(param => {
      if (param.has('paymentStatus')) {
        if (param.get('paymentStatus') === 'success') {
          const id = param.get('id');
          this.customService.Get( `ProjectOffer/UpdateStatus/${id}/4`).subscribe(res => {
            this.customFunctions.showResponseMessage(res.description, res.code)
            if (res.code <= 300) {
              this.router.navigate(['/projects/dashboard']);
            }
          });
        } else {
          this.customFunctions.showResponseMessage('Error InPayment', false);
        }
      }
    });
  }



}
