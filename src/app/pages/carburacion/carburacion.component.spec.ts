import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarburacionComponent } from './carburacion.component';

describe('CarburacionComponent', () => {
  let component: CarburacionComponent;
  let fixture: ComponentFixture<CarburacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarburacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarburacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
