import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageServiciosComponent } from './manage-servicios.component';

describe('ManageServiciosComponent', () => {
  let component: ManageServiciosComponent;
  let fixture: ComponentFixture<ManageServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageServiciosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
