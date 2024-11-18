import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEmpleadosComponent } from './manage-empleados.component';

describe('ManageEmpleadosComponent', () => {
  let component: ManageEmpleadosComponent;
  let fixture: ComponentFixture<ManageEmpleadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageEmpleadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
