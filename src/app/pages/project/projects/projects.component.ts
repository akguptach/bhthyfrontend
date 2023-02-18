import { AuthService } from 'src/app/service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomFunctions } from 'src/app/shared/customFunctions/customFunctions';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as moment from 'moment';
import { CustomService } from 'src/app/service/custom.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  searchfilterForm!: FormGroup;
  projects: Array<any> = [];
  private _backUpProjects: Array<any> = [];
  categorieslist: any;
  expertskillslist: any;
  latestproject: any;
  data!: string;
  token!: string;
  userid!: string;
  first_name!: string;
  about_me!: string;
  username!: string;
  users: any;
  getuserid: any;
  editprojects: any;
  langs!: string;

  //count: Number = 250;
  total: any;
  metadata: any;
  current_page: any;
  next_page_url: any;
  per_page: any;
  page = 1;
  rate: any;
  filter!: string;
  search: any;
  skills: any;
  categories: any;
  projects$!: Observable<any>;
  services$!: Observable<any>;
  subServices$!: Observable<any>;
  priceRanges$!: Observable<any>;
  skills$!: Observable<any>;
  submitted = false;
  skip = 0;
  take = 10;
  showModal = false;
  lastBidDate: Date = new Date(1669628373962);
  constructor(
    private formBuilder: FormBuilder,
    private customService: CustomService,
    private authService: AuthService,
    private router: Router,
    public customFunctions: CustomFunctions,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    moment.locale('en'); // set to english


   this.initializePage();




    // this.projects$ = this.customService.Get(`Project`);
    this.services$ = this.customService.Get(`Service`);
    this.priceRanges$ = this.customService.Get(`PriceRange`);
    const page = 1;
    this.browsecategories();
    this.expertskills();
    this.userslog();
    if (this.token == null) {
      this.latestprojects();
    } else {
      this.showallprojects();
    }

    // this.searchfilterForm = this.formBuilder.group({
    //   search: ['', Validators.required],
    //   ServiceId: ['', Validators.required],
    //   skills: ['', Validators.required],
    //   rate: ['', Validators.required],
    // });

  }
  goToProjectPage(projectId: string): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/projects/projectView/' + projectId])
    } else {
      this.router.navigate(['/account/login'])
    }
  }

  onSelectService(serviceId: any) {
    console.log('serviceId ', serviceId);
    this.subServices$ = this.customService.Get(`SubService/GetByService/${serviceId}`);
    this.skills$ = this.customService.Get(`Skill/GetByService/${serviceId}`);
  }

  private initializePage(){
    let search = this.activeRoute.snapshot.queryParamMap.get('search');
    let category = this.activeRoute.snapshot.queryParamMap.get('category');
    if (this.authService.isLoggedIn()) {
      this.customService.Get(`Project/PrivateProjects`).subscribe(res => {
        this.projects = res.filter((oi: any) => oi.isHiddenBid  == 1);
        this._backUpProjects = this.projects;
        if (search) this.projects = this.projects.filter((oi: any) => oi.name.includes(search));
        if (category) this.projects = this.projects.filter((oi: any) => oi.serviceName.includes(category));
      });
    } else {
      this.customService.Get(`Project`).subscribe(res => {
        this.projects = res;
      });
      if (search) this.projects = this.projects.filter((oi: any) => oi.name.includes(search));
      if (category) this.projects = this.projects.filter((oi: any) => oi.serviceName.includes(category));
    }
    // this.services$ = this.customService.Get(`Service`);
    // this.priceRanges$ = this.customService.Get(`PriceRange`);
    this.searchfilterForm = this.formBuilder.group({
      search: [search],
      ServiceId: [category, Validators.required],
      project_range_id: [null],
    });

  }

  ngDoCheck() {


  }

  onSubmit() {


  }

  browsecategories() {

  }

  expertskills() {


  }

  latestprojects() {

  }

  showallprojects() {

  }

  searchProjects() {
    this.submitted = true;
    // if (this.searchfilterForm.invalid) {
    //   // this.initializePage();
    //   this.customService.Get(`Project/PrivateProjects`).subscribe(res => {
    //     this.projects = res.filter((oi: any) => oi.isHiddenBid  == 1);
    //     // if (search) this.projects = this.projects.filter((oi: any) => oi.name.includes(search));
    //     // if (category) this.projects = this.projects.filter((oi: any) => oi.serviceName.includes(category));
    //   });
    //   this.customFunctions.showResponseMessage('Please validate All Filed is Correct ', false);
    //   return;
    // }
    // const data = {
    //   serviceId: this.searchfilterForm.controls.ServiceId.value? this.searchfilterForm.controls.ServiceId.value: 0,
    //   priceRangeId: this.searchfilterForm.controls.project_range_id.value?this.searchfilterForm.controls.project_range_id.value: 0 ,
    //   name: this.searchfilterForm.controls.search.value,
    //   take: this.take,
    //   skip: this.skip
    // }
    // console.log('data ', data);
    // this.customService.post(data, 'Project/FindProject').subscribe(res => {
    //   if (res) {
    //     // console.log('res ', res);
    //     this.projects = res.data;
    //   }
    // });
    // this.projects = this._backUpProjects.filter(oi => {
    //   if(this.searchfilterForm.controls.search.value){
    //     return (oi.name as string).toLowerCase().includes(this.searchfilterForm.controls.search.value.toLowerCase());
    //   }
    // })
    let temp_project = this._backUpProjects;

    if(this.searchfilterForm.controls.search.value){
      temp_project = temp_project.filter(oi => (oi.name as string).toLowerCase().includes(this.searchfilterForm.controls.search.value.toLowerCase()))
    }
    if(this.searchfilterForm.controls.project_range_id.value){
      temp_project = temp_project.filter(oi => oi.priceRangeId == this.searchfilterForm.controls.project_range_id.value)
    }
    if(this.searchfilterForm.controls.ServiceId.value){
      temp_project = temp_project.filter(oi => oi.serviceId == this.searchfilterForm.controls.ServiceId.value)
    }
    this.projects = temp_project;

  }

  onClick(event: any) {

  }

  getTime(createdDate: string): boolean{
    return true;
    // let date = new Date(createdDate);
    // return this.lastBidDate.getTime() < date.getTime();
  }

  hide() {
    this.showModal = false;
  }

  userslog() {

  }

  p(event: number) {
    this.page = event;
  }

}
