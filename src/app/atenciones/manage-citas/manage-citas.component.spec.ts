import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCitasComponent } from './manage-citas.component';

describe('ManageCitasComponent', () => {
  let component: ManageCitasComponent;
  let fixture: ComponentFixture<ManageCitasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageCitasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
