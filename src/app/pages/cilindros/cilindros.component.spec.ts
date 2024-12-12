import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CilindrosComponent } from './cilidros.component';

describe('CilindrosComponent', () => {
  let component: CilindrosComponent;
  let fixture: ComponentFixture<CilindrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CilindrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CilindrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
