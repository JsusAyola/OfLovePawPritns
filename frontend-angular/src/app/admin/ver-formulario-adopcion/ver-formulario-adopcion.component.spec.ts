import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerFormularioAdopcionComponent } from './ver-formulario-adopcion.component';

describe('VerFormularioAdopcionComponent', () => {
  let component: VerFormularioAdopcionComponent;
  let fixture: ComponentFixture<VerFormularioAdopcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerFormularioAdopcionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerFormularioAdopcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
