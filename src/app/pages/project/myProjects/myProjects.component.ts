import { CustomFunctions } from 'src/app/shared/customFunctions/customFunctions';
import { CustomService } from 'src/app/service/custom.service';
import { Observable } from 'rxjs';
import * as moment from 'moment';
// import 'moment/locale/ar-sa';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from 'src/app/service/auth.service';
@Component({
  selector: 'app-myProjects',
  templateUrl: './myProjects.component.html',
  styleUrls: ['./myProjects.component.scss']
})
export class MyProjectsComponent implements OnInit {
  searchfilterForm!: FormGroup;
  paymentForm!: FormGroup;
  showModal!: boolean;
  projects: Array<any> = [];
  services$!: Observable<any>;
  subServices$!: Observable<any>;
  priceRanges$!: Observable<any>;
  skills$!: Observable<any>;
  submitted = false;
  showAcceptModal = false;
  skip = 0;
  take = 10;
  @Input()
  projectStatus: any;
  tempProjectid: any;
  constructor(
    private formBuilder: FormBuilder,
    private customFunctions: CustomFunctions, public authService: AuthService,
    private customService: CustomService
  ) { }

  ngOnInit() {
    // console.log(localStorage.getItem('Bhthy_JWT_TOKEN'))
    this.paymentForm = this.createPaymentForm();

    moment.locale('en'); // set to english
    this.getProjects();
    // this.services$ = this.customService.Get(`Service`);
    // this.priceRanges$ = this.customService.Get(`PriceRange`);
    this.searchfilterForm = this.formBuilder.group({
      search: [null],
      ServiceId: ['', Validators.required],
      project_range_id: [null],
    });
  }
  getProjects(): void {
    this.customService.Get(`Project/FindByStatus/${this.projectStatus}`).subscribe(res => {
      this.projects = res;
      console.log('projects ', res);
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
        this.projects = res.data;
      }
    });
  }

  updateProjectStatus(id: string, status: number, message: string): void {
    this.customFunctions.customConfirm(`Are You Sure To ${message}`, () => {
      this.customService.put(null, `Project/UpdateStatus/${id}/${status}`).subscribe(res => {
        this.customFunctions.showResponseMessage(res.description, res.code)
        if (res.code <= 300) {
          this.getProjects();
        }
      });
    })
  }

  createPaymentForm(): FormGroup {
    return this.formBuilder.group({
      PaymentType: [null],
      Amount: [null, Validators.required],
      AccountNo: [null],
      Transection: [null, Validators.required],
      Recipt: [null],
      Documents: [null],
      AmountHolder: [null],
      BeneficiaryNo: [null],
      ProjectId: [null, Validators.required],
      FileType: [null, Validators.required],
    });
  }

  public acceptPayment(id, paymentType: string, alldetails) {
    console.log(paymentType);

    if (paymentType == 'FullPayment' || paymentType == 'PartialPay') {
      this.customFunctions.customConfirm(`Are You Sure To pay`, () => {
        this.customService.Get(`Project/AcceptPayment/${id}`).subscribe(res => {
          // console.log(res)
          // this.customFunctions.showResponseMessage(res.description, res.code)

          if (res.session_id) {
            sessionStorage.setItem('session_id', res.session_id);
          }
          window.location.href = res.url;

        });
      })
    } else if (paymentType == 'BankTransfer') {
      this.showAcceptModal = true;
      this.paymentForm.get('ProjectId').setValue(id)
      this.paymentForm.get('PaymentType').setValue(paymentType)
    } else if (paymentType == 'Contract') {
      this.showAcceptModal = true;
      this.paymentForm.get('ProjectId').setValue(id)
      this.paymentForm.get('PaymentType').setValue(paymentType)
      this.paymentForm.get('BeneficiaryNo').setValue('63673601')
      this.paymentForm.get('AmountHolder').setValue('Athr for Investment and Development')
      this.paymentForm.get('AccountNo').setValue('1058039965001')


    }

  }

  onSelectFile(event: any, controlName: string) {
    const file = event.target.files[0];
    const name = event.target.files[0].name;
    const lastDot = name.lastIndexOf('.');
    const ext = name.substring(lastDot + 1);
    console.log(ext)
    console.log('file size  ', file.size);
    if (file.size > 3254478) {
      console.log('file size larag ', file.size);
      alert('the max size of File mus be 1 MB');
      // this.customFunctions.showResponseMessage('the max size of File mus be 1 MB', 'حجم الملف اكبر من واحد ميقا بايت', false);
      return;
    }
    // const fileTypes = ['jpg', 'jpeg', 'png'];  // acceptable file types
    // const extension = file.fileName.split('.').pop().toLowerCase();  // file extension from input file
    // const isSuccess = fileTypes.indexOf(extension) > -1;  // is extension in acceptable types
    // this.fileType = extension;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      // var b64 = reader.result.replace(/^data:.+;base64,/, '');
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.paymentForm.get('Recipt').setValue(reader.result);
        this.paymentForm.get('FileType').setValue(ext)


        // if (this.paymentForm.value.PaymentType == 'BankTransfer') {
        //   this.paymentForm.get('Recipt').setValue(reader.result);
        //   this.paymentForm.get('FileType').setValue(ext)
        // } else {
        //   this.paymentForm.get('Documents').setValue(reader.result);
        //   this.paymentForm.get('FileType').setValue(ext)
        // }


       };
      reader.onerror = error => reject(error);
    });
  }

  public onSubmitForm() {
    const userId = this.authService.getUserId();
    
    if (this.paymentForm.value.PaymentType == 'BankTransfer') {
      console.log(this.paymentForm);
      if (this.paymentForm.valid) {
        const uploadJson = {
          "userId": userId,
          "paymentType": this.paymentForm.value.PaymentType,
          "amount": ""+this.paymentForm.value.Amount+"",
          "accountNo": '',
          "transection": this.paymentForm.value.Transection,
          "recipt": this.paymentForm.value.Recipt,
          "documents": '',
          "amountHolder": '',
          "beneficiaryNo": '',
          "projectId": this.paymentForm.value.ProjectId,
          "fileType": this.paymentForm.value.FileType
        }
        console.log(uploadJson)
        this.customService.post(uploadJson, `Project/UrgentProjectPayment/${this.paymentForm.value.ProjectId}`).subscribe(async res => {
          console.log('res','')
          if (res) {
            if (res.code <= 300) {
              this.customFunctions.showResponseMessage(res.description, res.code);
             } else {
              this.customFunctions.showResponseMessage(res.description, res.code);
            }
            this.paymentForm.reset()
            this.showAcceptModal = false;

           }
        });
      } else {
        this.paymentForm.markAllAsTouched();
        this.customFunctions.showResponseMessage('Please enter all fields.', false)

      }

    } else {
      if (this.paymentForm.value.FileType != '' && this.paymentForm.value.FileType != null) {
        const uploadJson = {
          // "userId": userId,
          // "paymentType": this.paymentForm.value.PaymentType,
          // "amount": '',
          // "accountNo": '',
          // "transection": '',
          // "recipt": this.paymentForm.value.Recipt,
          // "documents": '',
          // "amountHolder": '',
          // "beneficiaryNo": '',
          // "projectId": this.paymentForm.value.ProjectId,
          // "fileType": this.paymentForm.value.FileType

          "userId": userId,
          "paymentType": this.paymentForm.value.PaymentType,
          "amount": "0",
          "accountNo": '',
          "transection": "",
          "recipt": this.paymentForm.value.Recipt,
          "documents": '',
          "amountHolder": '',
          "beneficiaryNo": '',
          "projectId": this.paymentForm.value.ProjectId,
          "fileType": this.paymentForm.value.FileType
        }
        console.log(uploadJson)
        this.customService.post(uploadJson, `Project/UrgentProjectPayment/${this.paymentForm.value.ProjectId}`).subscribe(async res => {
          if (res) {
            if (res.code <= 300) {
              this.customFunctions.showResponseMessage(res.description, res.code);
             } else {
              this.customFunctions.showResponseMessage(res.description, res.code);
            }
            this.paymentForm.reset()
            this.showAcceptModal = false;
           }
        });


      } else {
        this.customFunctions.showResponseMessage('Please select document.', false)
      }

    }


     

  }
}
