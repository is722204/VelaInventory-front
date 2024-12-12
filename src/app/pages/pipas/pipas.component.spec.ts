import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipasComponent } from './pipas.component';

describe('PipasComponent', () => {
  let component: PipasComponent;
  let fixture: ComponentFixture<PipasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
