import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDepartamentosComponent } from './manage-departamentos.component';

describe('ManageDepartamentosComponent', () => {
  let component: ManageDepartamentosComponent;
  let fixture: ComponentFixture<ManageDepartamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageDepartamentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDepartamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
