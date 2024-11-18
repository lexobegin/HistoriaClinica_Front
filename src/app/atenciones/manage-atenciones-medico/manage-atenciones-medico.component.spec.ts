import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAtencionesMedicoComponent } from './manage-atenciones-medico.component';

describe('ManageAtencionesMedicoComponent', () => {
  let component: ManageAtencionesMedicoComponent;
  let fixture: ComponentFixture<ManageAtencionesMedicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageAtencionesMedicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAtencionesMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
