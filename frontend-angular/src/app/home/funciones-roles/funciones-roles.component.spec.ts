import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionesRolesComponent } from './funciones-roles.component';

describe('FuncionesRolesComponent', () => {
  let component: FuncionesRolesComponent;
  let fixture: ComponentFixture<FuncionesRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncionesRolesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuncionesRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
