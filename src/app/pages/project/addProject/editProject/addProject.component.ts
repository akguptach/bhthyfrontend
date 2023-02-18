import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CustomFunctions } from 'src/app/shared/customFunctions/customFunctions';
import { CustomService } from 'src/app/service/custom.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { PriceDiscountType } from 'src/app/shared/ItemList/Enum';
declare var $: any;

declare var $: any;
@Component({
  selector: 'app-add-Project',
  templateUrl: './AddProject.component.html',
  styleUrls: ['./AddProject.component.scss']
})
export class AddProjectComponent implements OnInit {
  projectForm!: FormGroup;
  services$!: Observable<any>;
  subServices$!: Observable<any>;
  priceRanges$!: Observable<any>;
  skills$!: Observable<any>;
  submitted!: boolean;
  action = 'new';
  selectedService!: number;
  selectedSubService!: number;
  selectedSkill: Array<any> = [];
  selectedPriceRange!: number;
  appPriceSetting!: any;
  PriceDiscountType = PriceDiscountType;
  constructor(
    private formBuilder: FormBuilder,
    private customService: CustomService,
    public customFunctions: CustomFunctions,
    private activateRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.projectForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      project_range_id: ['', Validators.required],
      Specialty: [null],
      ServiceId: ['', Validators.required],
      SubServiceId: ['', Validators.required],
      // skill_select: ['', Validators.required],
      bid_duration: [null, Validators.required],
      is_featured: [false],
      IsInviteBid: [false],
      IsSealed: [false],
      is_urgent: [false],
      is_private: [false],
      is_hidded_bid: [false],
    });
    this.customService.Get(`AppPriceSetting`).subscribe(appPrice => {
      this.appPriceSetting = appPrice;
    })
    this.activateRoute.paramMap.subscribe(param => {
      if (param.has('id')) {
        this.customService.Get(`Project/${param.get('id')}`).subscribe(project => {
          this.patchProjectForm(project);
          this.action = 'edit';
        })
      }
    })
    this.services$ = this.customService.Get(`Service`);
    this.priceRanges$ = this.customService.Get(`PriceRange`);
  }
  patchProjectForm(project: any): void {
    console.log('Edit project data', project);
    this.onSelectService(project.serviceId);
    this.selectedService = project.serviceId;
    this.selectedSubService = project.subServiceId;
    this.selectedPriceRange = project.priceRangeId;
    project.projectSkills.forEach((skill: any) => {
      this.selectedSkill.push(skill.skillId);
    });
    console.log('selectedSkill data', this.selectedSkill);
    this.projectForm.patchValue({
      id: project.id,
      name: project.name,
      description: project.description,
      Specialty: project.specialty,
      bid_duration: project.executionTime,
      is_private: project.isPrivate,
      IsSealed: project.isSealed,
      is_featured: project.isFeatured,
      is_urgent: project.isUrgent,
      IsInviteBid: project.isInviteBid,
      skill_select: this.selectedSkill
    })
  }
  getProjectFormData(): any {
    this.submitted = true;
    if (this.projectForm.invalid) {
      this.customFunctions.showResponseMessage('Please validate All Filed is Correct ', false);
      return;
    }
     const selectedSkills: Array<any> = [];
    this.projectForm.controls.skill_select.value.forEach((skillId: number) => {
     selectedSkills.push({ SkillId: skillId })
    });
    const project: any = {
      serviceId: this.projectForm.controls.ServiceId.value,
      subServiceId: this.projectForm.controls.SubServiceId.value,
      name: this.projectForm.controls.name.value,
      description: this.projectForm.controls.description.value,
      specialty: this.projectForm.controls.Specialty.value,
      executionTime: this.projectForm.controls.bid_duration.value,
      isPrivate: this.projectForm.controls.is_private.value,
      isSealed: this.projectForm.controls.IsSealed.value,
      isHiddenBid: this.projectForm.controls.is_hidded_bid.value,
      isFeatured: this.projectForm.controls.is_featured.value,
      isUrgent: this.projectForm.controls.is_urgent.value,
      priceRangeId: this.projectForm.controls.project_range_id.value
    };
    if (this.action === 'edit') {
      project.id = this.projectForm.controls.id.value;
    }
    console.log('project ', project);
    return project;
  }
  async saveProject(status: number): Promise<void> {
    const project = this.getProjectFormData();
    project.status = status;
    this.customService.post(project, 'project').subscribe(res => {
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
  async updateProject(): Promise<void> {
    const project = this.getProjectFormData();
    this.customService.put(project, `project/${project.id}`).subscribe((res: any) => {
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
  onSelectService(serviceId: any) {
    console.log('serviceId ', serviceId);
    this.subServices$ = this.customService.Get(`SubService/GetByService/${serviceId}`);
    this.skills$ = this.customService.Get(`Skill/GetByService/${serviceId}`);
  }


  onSelectCategories(data: any): void {


  }

  onSelectSkill(data: any): void {


  }

  onSubmit() {



  }

}
