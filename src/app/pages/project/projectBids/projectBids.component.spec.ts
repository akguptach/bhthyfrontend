
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBidsComponent } from './projectBids.component';

describe('ProjectBidsComponent', () => {
  let component: ProjectBidsComponent;
  let fixture: ComponentFixture<ProjectBidsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectBidsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectBidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
