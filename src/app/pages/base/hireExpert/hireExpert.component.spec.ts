import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HireexpertComponent } from './hireexpert.component';

describe('HireexpertComponent', () => {
  let component: HireexpertComponent;
  let fixture: ComponentFixture<HireexpertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HireexpertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HireexpertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
