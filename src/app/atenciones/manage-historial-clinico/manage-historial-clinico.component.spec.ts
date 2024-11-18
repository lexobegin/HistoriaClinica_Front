import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageHistorialClinicoComponent } from './manage-historial-clinico.component';

describe('ManageHistorialClinicoComponent', () => {
  let component: ManageHistorialClinicoComponent;
  let fixture: ComponentFixture<ManageHistorialClinicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageHistorialClinicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageHistorialClinicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
