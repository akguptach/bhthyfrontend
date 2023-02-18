import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { CustomService } from 'src/app/service/custom.service';
import { AuthService } from 'src/app/service/auth.service';
import { CustomFunctions } from 'src/app/shared/customFunctions/customFunctions';

@Component({
  selector: 'app-freeLancer-experience',
  templateUrl: './freeLancerExperience.component.html',
  styleUrls: ['./freeLancerExperience.component.css']
})
export class FreeLancerExperiencesComponent implements OnInit {
  freeLancerExperienceForm!: FormGroup;

  freeLancerExperiences$!: Observable<any>;
  action = 'new';
  submitted = false;
  imageBase64!: string | ArrayBuffer | null;
  constructor(
    private formBuilder: FormBuilder,
    private customService: CustomService,
    private customFunctions: CustomFunctions
  ) { }

  ngOnInit(): void {
    this.freeLancerExperienceForm = this.createFreeLancerExperienceForm();
    this.getFreeLancerExperiences();
  }
  getFreeLancerExperiences(): void {
    this.freeLancerExperiences$ = this.customService.Get(`freeLancerExperience`);
    this.freeLancerExperiences$.subscribe(freeLancerExperiences => {
      console.log('freeLancerExperiences ', freeLancerExperiences);

    })
  }
  createFreeLancerExperienceForm(): FormGroup {
    return this.formBuilder.group({
      id: [''],
      Company: ['', Validators.required],
      Description: ['', Validators.required],
      FromMonthYear: [null],
      ToMonthYear: [null]
    });
  }
  async getFreeLancerExperienceFormData(): Promise<any> {
    this.submitted = true;
    if (this.freeLancerExperienceForm.invalid) {
      this.customFunctions.showResponseMessage('Please validate All Filed is Correct   ', false);
      return;
    }
    const freeLancerExperience: any = {
      description: this.freeLancerExperienceForm.controls.Description.value,
      company: this.freeLancerExperienceForm.controls.Company.value,
      fromMonthYear: this.customFunctions.formatDate(this.freeLancerExperienceForm.controls.FromMonthYear.value),
      toMonthYear: this.customFunctions.formatDate(this.freeLancerExperienceForm.controls.ToMonthYear.value)
    };
    if (this.action === 'edit') {
      freeLancerExperience.id = this.freeLancerExperienceForm.controls.id.value;
    }
    console.log('freeLancerExperience  ', freeLancerExperience);
    return await freeLancerExperience;
  }
  async saveFreeLancerExperience(): Promise<void> {
    const freeLancerExperience = await this.getFreeLancerExperienceFormData();
    await this.customService.post(freeLancerExperience, 'freeLancerExperience').subscribe(async res => {
      if (res) {
        this.getFreeLancerExperiences();
        this.customFunctions.showResponseMessage(res.description, res.code);
        this.freeLancerExperienceForm.reset();
      }
    });
  }
  addNew(): void {
    this.freeLancerExperienceForm.reset();
    this.action = 'new';
  }
  editFreeLancerExperience(freeLancerExperience: any): void {
    console.log('edit freeLancerExperience ', freeLancerExperience);
    this.action = 'edit';
    this.freeLancerExperienceForm.reset();
    this.freeLancerExperienceForm.patchValue({
      id: freeLancerExperience.id,
      Company: freeLancerExperience.company,
      Description: freeLancerExperience.description,
      FromMonthYear: this.customFunctions.formatDate(freeLancerExperience.fromMonthYear),
      ToMonthYear: this.customFunctions.formatDate(freeLancerExperience.toMonthYear),
    });
  }
  async updateFreeLancerExperience(): Promise<void> {
    const freeLancerExperience = await this.getFreeLancerExperienceFormData();
    this.customService.put(freeLancerExperience, `freeLancerExperience/${freeLancerExperience.id}`).subscribe((res: any) => {
      this.customFunctions.showResponseMessage(res.description, res.code);
      this.getFreeLancerExperiences();
    });
  }
  confirmDelete(id: number): void {
    this.customFunctions.customConfirm('Are You Sure To Delete This Item ', () => {
      this.customService.Delete(`freeLancerExperience/${id}`).subscribe((res: any) => {
        this.customFunctions.showResponseMessage(res.description, res.code);
        this.getFreeLancerExperiences();
      });
    });
  }

  // tslint:disable-next-line:typedef
  onSelectFile(event: any) {
    const file = event.target.files[0];
    const name = event.target.files[0].name;
    const lastDot = name.lastIndexOf('.');
    const ext = name.substring(lastDot + 1);
    // this.fileType = ext;
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
