import { CustomFunctions } from 'src/app/shared/customFunctions/customFunctions';
import { CustomService } from 'src/app/service/custom.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
declare var $: any;

@Component({
  selector: 'app-project-view',
  templateUrl: './projectview.component.html',
  styleUrls: ['./projectview.component.scss']
})
export class ProjectViewComponent implements OnInit {
  bidForm!: FormGroup;
  project$!: Observable<any>;
  projectId!: string | null;
  submitted = false;
  constructor(private router: Router,
    private route: ActivatedRoute,
    public customFunctions: CustomFunctions,
    private customService: CustomService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.bidForm = this.formBuilder.group({
      amount: ['', Validators.required],
      duration: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.route.paramMap.subscribe(param => {
      if (param.has('id')) {
        this.projectId = param.get('id');
        this.project$ = this.customService.Get(`Project/${param.get('id')}`);
      }
    });
  }
  get form() {
    return this.bidForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.bidForm.invalid) {
      this.customFunctions.showResponseMessage('Please validate All Filed is Correct ', false);
      return;
    }
    const duse = Number(this.bidForm.controls.amount.value) - (Number(this.bidForm.controls.amount.value) / 10.0)
    const offer: any = {
      price: this.bidForm.controls.amount.value,
      yourDues: duse,
      details: this.bidForm.controls.description.value,
      deliveryTerm: this.bidForm.controls.duration.value,
      projectId: this.projectId
    };
   
    this.customService.post(offer, 'projectOffer').subscribe(res => {
      if (res) {
        if (res.code <= 300) {
          this.customFunctions.showResponseMessage(res.description, res.code);
          this.router.navigate(['/projects/dashboard'])
        } else {
          this.customFunctions.showResponseMessage(res.description, res.code);
        }
      }
    });
  }

  hide() {
    this.bidForm.reset();
  }


}
