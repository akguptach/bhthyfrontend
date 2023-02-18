import { AuthService } from 'src/app/service/auth.service';
import { CustomService } from 'src/app/service/custom.service';
import { Observable, Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CustomFunctions } from 'src/app/shared/customFunctions/customFunctions';
declare var $: any;

@Component({
  selector: 'app-hire-expert',
  templateUrl: './hireExpert.component.html',
  styleUrls: ['./hireExpert.component.scss']
})

export class HireExpertComponent implements OnInit {
  expertskillslist: any;
  usersfilterlist: any;
  searchfilterForm!: FormGroup;
  hireForm!: FormGroup;
  hirenowprojects: any;
  projectsObj = [];
  hireformsubmit: any;
  error_msg: any;
  total: any;
  current_page: any;
  next_page_url: any;
  per_page: any;
  usersList$ = new Subject();
  usersList: Array<any> = [];
  activeProject$!: Observable<any>;
  skills$!: Observable<any>;
  services$!: Observable<any>;
  subServices$!: Observable<any>;
  take = 10;
  skip = 0;
  showModal!: boolean;
  multiUserModal: boolean = false;
  submitted = false;
  activeProjectsCount = 0;
  projectId: string = "";
  privateMsg: string = "";
  expertIDs: Array<string> = [];
  constructor(
    public customFunctions: CustomFunctions,
    private router: Router,
    private formBuilder: FormBuilder,
    private customService: CustomService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) { }
  ngOnInit() {
    this.skills$ = this.customService.Get(`Skill`);
    this.services$ = this.customService.Get(`Service`);
    this.activeProject$ = this.customService.Get(`Project/GetInviteProjects`);
    this.activeProject$.subscribe(projects => {
      this.activeProjectsCount = projects.length;
    });

    // skills: ['', Validators.required],
    // rate: ['', Validators.required],
    this.searchfilterForm = this.formBuilder.group({
      search: ['', Validators.required],
      skills: ['', Validators.required],
      rate: ['', Validators.required],
      ServiceId: [null, Validators.required]
    });

    this.hireForm = this.formBuilder.group({
      UserId: ['', Validators.required],
      InviteMessage: ['', Validators.required],
      ProjectId: ['', Validators.required],
    });

    this.projectId = this.activatedRoute.snapshot.queryParamMap.get('qsProjectId') || '';
    let serviceId = Number(this.activatedRoute.snapshot.queryParamMap.get('qsServiceID'));
    if( serviceId && serviceId > 0){
      this.searchfilterForm.get('ServiceId')?.setValue(serviceId);
      this.searchHire();
    }else {
      this.customService.Get(`Identity/2`).subscribe(res => {
        this.usersList = res.data;
        console.log('data ', res);
        // this.getExpertCount();

      });
    }


  }

  getExpertCount(){
    this.customService.Get(`Identity/GetDashboardCounts`).subscribe(res => {
      console.log('GetDashboardCounts ', res);

    });
  }

  onSelectService(serviceId: any) {
    console.log('serviceId ', serviceId);
    this.skills$ = this.customService.Get(`Skill/GetByService/${serviceId}`);
  }
  ngDoCheck() {

  }
  searchHire() {
    let serviceId=0;
    if(this.searchfilterForm.controls.ServiceId.value!=null){
      serviceId=this.searchfilterForm.controls.ServiceId.value
    }
    console.log('check',serviceId)
    const data = {
      serviceId: serviceId,
      fullName: this.searchfilterForm.controls.search.value,
      take: this.take,
      skip: this.skip
    }
    this.customService.post(data, `Identity/FindHire`).subscribe(res => {
      this.usersList = res.data;
      console.log('FindHire  ', res);
    });
  }
  expertskills() {

  }
  geclickexpertfilter() {

  }

  onClick(userId: string) {
    if (this.authService.isLoggedIn()) {
      this.showModal = true;
      this.hireForm.patchValue({
        UserId: userId
      });
    } else {
      this.router.navigate(['/account/login'])
    }

  }

  onSendInvitationClick() {
    if (this.authService.isLoggedIn()) {
      if(this.expertIDs.length < 1){
        this.customFunctions.showResponseMessage('Please Select Experts', false);
        return;
      }
      if(this.expertIDs.length > 5){
        this.customFunctions.showResponseMessage('Please only 5 experts at a time ', false);
        return;
      }
      this.multiUserModal = true;
      // this.hireForm.patchValue({
      //   UserId: userId
      // });
    } else {
      this.router.navigate(['/account/login'])
    }

  }

  onPrivateMsgUpdate(e:any){
    this.privateMsg = e.target.value;
  }

  onMultiHideClick(){
    console.log(this.privateMsg);

    if(this.privateMsg == ''){
      this.customFunctions.showResponseMessage('Private Message is required.', false);
        return;
    }

    const data = {
      userId: this.expertIDs,
      projectId: this.projectId,
      inviteMessage: this.privateMsg,
    }
    this.customService.post(data, 'ProjectOffer/MultipleUsersSendInvite').subscribe(res => {
      if (res) {
        this.customFunctions.showResponseMessage(res.description, res.code);
        if (res.code <= 300) {
          this.multiUserModal = false;
          this.privateMsg = '';
        }
      }
    });


  }

  goToUserDetailsPage(userId: string): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/account/userDetails/' + userId])
    } else {
      this.router.navigate(['/account/login'])
    }
  }
  hide() {
    this.hireForm.reset();
    this.showModal = false;
    // this.showModal = false;
  }

  onSubmit() {
  }

  fieldsChange(values:any, userid: string):void {
    if(values.currentTarget.checked){
      this.expertIDs.push(userid);
    }else {
      this.expertIDs = this.expertIDs.filter(oi => oi != userid);
    }
  }

  onMultipleSubmitClick() {
    this.submitted = true;
    if (this.hireForm.invalid) {
      this.customFunctions.showResponseMessage('Please validate All Filed is Correct ', false);
      return;
    }
    const data = {
      userId: this.hireForm.controls.UserId.value,
      projectId: this.hireForm.controls.ProjectId.value,
      inviteMessage: this.hireForm.controls.InviteMessage.value,
    }
    this.customService.post(data, 'ProjectOffer/SendInvite').subscribe(res => {
      if (res) {
        this.customFunctions.showResponseMessage(res.description, res.code);
        if (res.code <= 300) {
          this.hireForm.reset();
          this.showModal = false;
        }
      }
    });
    var projects = this.projectsObj;
    var message = this.hireForm.value.inputMessage;
    var obj = {
      "message": message,
      "class": 'Project',
      "projects": projects
    };

    //let pushedtime = { "projects": {projects}};
    // let pu = {"projects":[{"project_id":99},{"project_id":100}]};
  }

  onHire() {
    this.submitted = true;
    if (this.hireForm.invalid) {
      this.customFunctions.showResponseMessage('Please validate All Filed is Correct ', false);
      return;
    }
    const data = {
      userId: this.hireForm.controls.UserId.value,
      projectId: this.hireForm.controls.ProjectId.value,
      inviteMessage: this.hireForm.controls.InviteMessage.value,
    }
    this.customService.post(data, 'ProjectOffer/SendInvite').subscribe(res => {
      if (res) {
        this.customFunctions.showResponseMessage(res.description, res.code);
        if (res.code <= 300) {
          this.hireForm.reset();
          this.showModal = false;
        }
      }
    });
    var projects = this.projectsObj;
    var message = this.hireForm.value.inputMessage;
    var obj = {
      "message": message,
      "class": 'Project',
      "projects": projects
    };

    //let pushedtime = { "projects": {projects}};
    // let pu = {"projects":[{"project_id":99},{"project_id":100}]};
  }

  onProjectnameChange(event: any, value: any) {

  }

  p(event: any) {

  }

}
