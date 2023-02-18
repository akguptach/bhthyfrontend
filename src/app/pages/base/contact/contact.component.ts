import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { CustomService } from "src/app/service/custom.service";
// import { ContentService } from "../content.service";
// import { ToastrService } from "ngx-toastr";
// import { DynamicScriptLoaderServiceService } from "../dynamic-script-loader-service.service";
import { CustomFunctions } from './../../../shared/customFunctions/customFunctions';


@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"]
})
export class ContactComponent implements OnInit {
  public formGroup: FormGroup;
  constructor(
    private contentService: CustomService,
    private router: Router,
    public customFunction: CustomFunctions,
    private fb: FormBuilder,
    // private toastr: ToastrService,
    // private dynamicService: DynamicScriptLoaderServiceService
  ) {
    this.formGroup = this.createFormGroup();
   }

  contactDetails: any = {};
  userEmail!: string;
  adminMob: any = "";

  ngOnInit() {

    console.log(this.userEmail);
    this.contactDetails = { email_id: this.userEmail };

  }

  //#region Private Functions

  private createFormGroup(){
    return new FormGroup(
      {
        First_Name: new FormControl('', [Validators.required]),
        Last_Name: new FormControl('', [Validators.required]),
        Email: new FormControl('', [Validators.required, Validators.email]),
        Subject: new FormControl('', [Validators.required]),
        Message: new FormControl('', [Validators.required]),
        //Phone: new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
		Phone: new FormControl('', [Validators.required]),
      }
    )
  }

  //#endregion

  //#region Component Functions

  public onSubmitForm(){
    console.log(this.formGroup.value);
    if(this.formGroup.valid){
      let postObj: any = {
        Name: this.formGroup.value.First_Name+' '+this.formGroup.value.Last_Name,
        Email: this.formGroup.value.Email,
        Subject: this.formGroup.value.Subject,
        Message: this.formGroup.value.Message
      }
      this.contentService.post(postObj, `ContactUs`)
      .subscribe(res =>{
        this.customFunction.showResponseMessage(res.description, res.code)

        this.formGroup = this.createFormGroup();
      })
    }else {
      this.formGroup.markAllAsTouched();
    }
  }

  //#endregion


}
