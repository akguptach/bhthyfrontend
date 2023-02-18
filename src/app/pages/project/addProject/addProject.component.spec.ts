import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsaddComponent } from './projectsadd.component';

describe('ProjectsaddComponent', () => {
  let component: ProjectsaddComponent;
  let fixture: ComponentFixture<ProjectsaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectsaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
