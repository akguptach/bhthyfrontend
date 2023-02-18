import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { CustomService } from 'src/app/service/custom.service';
import { CustomFunctions } from 'src/app/shared/customFunctions/customFunctions';

@Component({
  selector: 'app-freeLancer-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {
  skillForm!: FormGroup;

  userSkills$!: Observable<any>;
  action = 'new';
  submitted = false;
  constructor(
    private formBuilder: FormBuilder,
    private customService: CustomService,
    private customFunctions: CustomFunctions
  ) { }

  ngOnInit(): void {
    this.skillForm = this.createSkillForm();
    this.getSkills();
  }
  getSkills(): void {
    this.userSkills$ = this.customService.Get(`FreeLancerSkill`);
    this.userSkills$.subscribe(skills => {
      console.log('skills ', skills);

    })
  }
  createSkillForm(): FormGroup {
    return this.formBuilder.group({
      Id: [''],
      Name: ['', Validators.required],
      Details: ['', Validators.required],
    });
  }
  async getSkillFormData(): Promise<any> {
    this.submitted = true;
    if (this.skillForm.invalid) {
      this.customFunctions.showResponseMessage('Please validate All Filed is Correct   ', false);
      return;
    }
    const freeLancerSkill: any = {
      Details: this.skillForm.controls.Details.value,
      name: this.skillForm.controls.Name.value
    };
    if (this.action === 'edit') {
      freeLancerSkill.id = this.skillForm.controls.Id.value;
    }
    console.log('freeLancerSkill  ', freeLancerSkill);
    return await freeLancerSkill;
  }
  async saveFreeLancerSkill(): Promise<void> {
    const freeLancerSkill = await this.getSkillFormData();
    await this.customService.post(freeLancerSkill, 'FreeLancerSkill').subscribe(async res => {
      if (res) {
        this.getSkills();
        this.customFunctions.showResponseMessage(res.description, res.code);
        this.skillForm.reset();
      }
    });
  }
  addNew(): void {
    this.skillForm.reset();
    this.action = 'new';
  }
  editFreeLancerSkill(freeLancerSkill: any): void {
    console.log('edit freeLancerSkill ', freeLancerSkill);
    this.action = 'edit';
    this.skillForm.reset();
    this.skillForm.patchValue({
      Id: freeLancerSkill.id,
      Name: freeLancerSkill.name,
      Details: freeLancerSkill.details
    });
  }
  async updateFreeLancerSkill(): Promise<void> {
    const freeLancerSkill = await this.getSkillFormData();
    this.customService.put(freeLancerSkill, `freeLancerSkill/${freeLancerSkill.id}`).subscribe((res: any) => {
      this.customFunctions.showResponseMessage(res.description, res.code);
      this.getSkills();
    });
  }
  confirmDelete(id: number): void {
    this.customFunctions.customConfirm('Are You Sure To Delete This Item ', () => {
      this.customService.Delete(`freeLancerSkill/${id}`).subscribe((res: any) => {
        this.customFunctions.showResponseMessage(res.description, res.code);
        this.getSkills();
      });
    });
  }
}
