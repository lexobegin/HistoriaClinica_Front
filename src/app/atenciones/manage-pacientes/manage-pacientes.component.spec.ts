import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePacientesComponent } from './manage-pacientes.component';

describe('ManagePacientesComponent', () => {
  let component: ManagePacientesComponent;
  let fixture: ComponentFixture<ManagePacientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagePacientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagePacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
