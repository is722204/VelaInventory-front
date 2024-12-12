import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioFinalComponent } from './inventariofinal.component';

describe('InventarioFinalComponent', () => {
  let component: InventarioFinalComponent;
  let fixture: ComponentFixture<InventarioFinalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventarioFinalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventarioFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
