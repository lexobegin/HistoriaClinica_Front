import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProgramacionMedicosComponent } from './manage-programacion-medicos.component';

describe('ManageProgramacionMedicosComponent', () => {
  let component: ManageProgramacionMedicosComponent;
  let fixture: ComponentFixture<ManageProgramacionMedicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageProgramacionMedicosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageProgramacionMedicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
