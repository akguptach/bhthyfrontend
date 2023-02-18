import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { CustomService } from 'src/app/service/custom.service';
import { AuthService } from 'src/app/service/auth.service';
import { CustomFunctions } from 'src/app/shared/customFunctions/customFunctions';

@Component({
  selector: 'app-freeLancer-works',
  templateUrl: './freeLancerWorks.component.html',
  styleUrls: ['./freeLancerWorks.component.css']
})
export class FreeLancerWorksComponent implements OnInit {
  freeLancerWorkForm!: FormGroup;

  freeLancerWorks$!: Observable<any>;
  action = 'new';
  submitted = false;
  imageBase64!: string | ArrayBuffer | null;
  fileType: any;
  constructor(
    private formBuilder: FormBuilder,
    private customService: CustomService,
    public customFunctions: CustomFunctions
  ) { }

  ngOnInit(): void {
    this.freeLancerWorkForm = this.createFreeLancerWorkForm();
    this.getFreeLancerWorks();
  }
  getFreeLancerWorks(): void {
    this.freeLancerWorks$ = this.customService.Get(`freeLancerWork`);
    this.freeLancerWorks$.subscribe(freeLancerWorks => {
      console.log('freeLancerWorks ', freeLancerWorks);

    })
  }
  createFreeLancerWorkForm(): FormGroup {
    return this.formBuilder.group({
      id: [''],
      Name: ['', Validators.required],
      Details: ['', Validators.required],
      Attachment: [null],
      Date: [null]
    });
  }
  async getFreeLancerWorkFormData(): Promise<any> {
    this.submitted = true;
    if (this.freeLancerWorkForm.invalid) {
      this.customFunctions.showResponseMessage('Please validate All Filed is Correct   ', false);
      return;
    }
    const freeLancerWork: any = {
      Details: this.freeLancerWorkForm.controls.Details.value,
      name: this.freeLancerWorkForm.controls.Name.value,
      date: this.customFunctions.formatDate(this.freeLancerWorkForm.controls.Date.value),
      attachment: this.imageBase64,
      fileType: this.fileType
    };
    if (this.action === 'edit') {
      freeLancerWork.id = this.freeLancerWorkForm.controls.id.value;
    }
    console.log('freeLancerWork  ', freeLancerWork);
    return await freeLancerWork;
  }
  async saveFreeLancerWork(): Promise<void> {
    const freeLancerWork = await this.getFreeLancerWorkFormData();
    await this.customService.post(freeLancerWork, 'freeLancerWork').subscribe(async res => {
      if (res) {
        this.getFreeLancerWorks();
        this.customFunctions.showResponseMessage(res.description, res.code);
        this.freeLancerWorkForm.reset();
      }
    });
  }
  addNew(): void {
    this.freeLancerWorkForm.reset();
    this.action = 'new';
  }
  editFreeLancerWork(freeLancerWork: any): void {
    console.log('edit freeLancerWork ', freeLancerWork);
    this.action = 'edit';
    this.freeLancerWorkForm.reset();
    this.freeLancerWorkForm.patchValue({
      id: freeLancerWork.id,
      Name: freeLancerWork.name,
      Details: freeLancerWork.details,
      Date: this.customFunctions.formatDate(freeLancerWork.date)
    });
  }
  async updateFreeLancerWork(): Promise<void> {
    const freeLancerWork = await this.getFreeLancerWorkFormData();
    this.customService.put(freeLancerWork, `freeLancerWork/${freeLancerWork.id}`).subscribe((res: any) => {
      this.customFunctions.showResponseMessage(res.description, res.code);
      this.getFreeLancerWorks();
    });
  }
  confirmDelete(id: number): void {
    this.customFunctions.customConfirm('Are You Sure To Delete This Item ', () => {
      this.customService.Delete(`freeLancerWork/${id}`).subscribe((res: any) => {
        this.customFunctions.showResponseMessage(res.description, res.code);
        this.getFreeLancerWorks();
      });
    });
  }

  // tslint:disable-next-line:typedef
  onSelectFile(event: any) {
    const file = event.target.files[0];
    const name = event.target.files[0].name;
    const lastDot = name.lastIndexOf('.');
    const ext = name.substring(lastDot + 1);
    this.fileType = ext;
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
        //  let v : string = reader.result;
        // console.log( reader.result);
        this.imageBase64 = reader.result;
      };
      reader.onerror = error => reject(error);
    });
  }

}
