import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnadirDiagnosticoComponent } from './anadir-diagnostico.component';

describe('AnadirDiagnosticoComponent', () => {
  let component: AnadirDiagnosticoComponent;
  let fixture: ComponentFixture<AnadirDiagnosticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnadirDiagnosticoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnadirDiagnosticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
