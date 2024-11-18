import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageusuariosComponent } from './manageusuarios.component';

describe('ManageusuariosComponent', () => {
  let component: ManageusuariosComponent;
  let fixture: ComponentFixture<ManageusuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageusuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageusuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
