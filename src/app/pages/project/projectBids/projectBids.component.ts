import { CustomFunctions } from 'src/app/shared/customFunctions/customFunctions';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as moment from 'moment';
import { CustomService } from 'src/app/service/custom.service';
import { Observable } from 'rxjs';
import { ProjectOfferStatus } from 'src/app/shared/ItemList/Enum';
import { AuthService } from 'src/app/service/auth.service';
@Component({
  selector: 'app-projectBids',
  templateUrl: './projectBids.component.html',
  styleUrls: ['./projectBids.component.scss']
})
export class ProjectBidsComponent implements OnInit {
  projectsBids$!: Observable<any>;
  complaintTypes$!: Observable<any>;
  complaintForm!: FormGroup;
  editPriceForm!: FormGroup;
  @Output() bidsCountButtonEvent = new EventEmitter();
  @Input()
  projectStatus!: number;
  @Input()
  userType!: string;
  url = '';
  showModal!: boolean;
  showEditPriceModal!: boolean;
  submitted = false;
  complaintSenderType!: number;
  projectOfferStatus = ProjectOfferStatus;
  constructor(
    private formBuilder: FormBuilder,
    private customService: CustomService,
    private customFunctions: CustomFunctions,
    private authService: AuthService
  ) { }

  ngOnInit() {
    moment.locale('en'); // set to english
    this.complaintForm = this.createComplaintForm();
    this.editPriceForm = this.formBuilder.group({
      Price: [null, Validators.required],
      Id: [null, Validators.required],
    });
    if (this.userType === 'ProjectOwner') {
      this.url = 'FindByProjectOwnerAndStatus';
      this.complaintSenderType = 1;
      this.getBids();
    } else if (this.userType === 'Expert') {
      this.url = 'FindByExpertAndStatus';
      this.complaintSenderType = 2;
      this.getBids();
    }
    this.complaintTypes$ = this.customService.Get(`complaintType`);
    console.log(this.authService.getUserDetails(), "user details");

  }
  createComplaintForm(): FormGroup {
    return this.formBuilder.group({
      Type: [null],
      Description: [null, Validators.required],
      ProjectId: [null, Validators.required],
      ProjectOfferId: [null, Validators.required],
      ComplaintTypeId: [null],
    });
  }
  getBids() {
    this.projectsBids$ = this.customService.Get(`ProjectOffer/${this.url}/${this.projectStatus}`);
    this.projectsBids$.subscribe(bids => {
      this.bidsCountButtonEvent.emit(bids.length);
    })
  }
  addNewComplaint(projectId: string, projectOfferId: string): void {
    this.showModal = true;
    this.complaintForm.patchValue({
      ProjectId: projectId,
      ProjectOfferId: projectOfferId
    });
  }
  showEditPriceModelAction(id: string): void {
    this.showEditPriceModal = true;
    this.editPriceForm.patchValue({
      Id: id
    });
  }
  saveComplaint() {
    this.submitted = true;
    if (this.complaintForm.invalid) {
      this.customFunctions.showResponseMessage('Please validate All Filed is Correct ', false);
      return;
    }
    const data = {
      type: this.complaintForm.controls.Type.value,
      description: this.complaintForm.controls.Description.value,
      projectId: this.complaintForm.controls.ProjectId.value,
      projectOfferId: this.complaintForm.controls.ProjectOfferId.value,
      complaintTypeId: this.complaintForm.controls.ComplaintTypeId.value,
      senderType: this.complaintSenderType
    }
    if (data.complaintTypeId == 0) {
      data.complaintTypeId = null;
    } else {
      data.type = null;
    }
    console.log('complaint data ', data);

    this.customService.post(data, 'ProjectComplaint').subscribe(res => {
      if (res) {
        if (res.code <= 300) {
          this.showModal = false;
        }
        this.customFunctions.showResponseMessage(res.description, res.code);
      }
    });
  }
  editBidPrice() {
    this.submitted = true;
    if (this.editPriceForm.invalid) {
      this.customFunctions.showResponseMessage('Please validate All Filed is Correct ', false);
      return;
    }
    const data = {
      id: this.editPriceForm.controls.Id.value,
      price: this.editPriceForm.controls.Price.value
    }

    console.log('price data ', data);

    this.customService.put(data, 'ProjectOffer/UpdateBidPrice').subscribe(res => {
      if (res) {
        if (res.code <= 300) {
          this.showEditPriceModal = false;
        }
        this.customFunctions.showResponseMessage(res.description, res.code);
        this.getBids();
      }
    });
  }

  hide() {
    this.complaintForm.reset();
    this.editPriceForm.reset();
    this.showModal = false;
    this.showEditPriceModal = false;
  }
  updateOfferStatus(id: string, status: number): void {
    // console.log(sthis);

    this.customFunctions.customConfirm('Are you Sure To Change Status For This Bids', () => {
      this.customService.Get(`ProjectOffer/UpdateStatus/${id}/${status}`).subscribe(res => {
        this.customFunctions.showResponseMessage(res.description, res.code)
        if (res.code <= 300) {
          this.getBids();
        }
      });
    })
  }
  acceptBids(id: string): void {
    this.customFunctions.customConfirm('Are you Sure To Accept  This Bids And You Must Pay Project Price Before Accept ', () => {
      this.customService.Get(`ProjectOffer/AcceptOffer/${id}`).subscribe(res => {
        console.log(res);
        if (res.session_id) {
          sessionStorage.setItem('session_id', res.session_id);
        }
        window.location.href = res.url;
      });
    })
  }

}
