import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecetarMedicamentosComponent } from './recetar-medicamentos.component';

describe('RecetarMedicamentosComponent', () => {
  let component: RecetarMedicamentosComponent;
  let fixture: ComponentFixture<RecetarMedicamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecetarMedicamentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecetarMedicamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
