import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBitacoraComponent } from './manage-bitacora.component';

describe('ManageBitacoraComponent', () => {
  let component: ManageBitacoraComponent;
  let fixture: ComponentFixture<ManageBitacoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageBitacoraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageBitacoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
