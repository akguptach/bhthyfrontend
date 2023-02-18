import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferChatComponent } from './offerChat.component';

describe('OfferChatComponent', () => {
  let component: OfferChatComponent;
  let fixture: ComponentFixture<OfferChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
