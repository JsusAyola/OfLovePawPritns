import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilAdoptadorComponent } from './perfil-adoptador.component';

describe('PerfilAdoptadorComponent', () => {
  let component: PerfilAdoptadorComponent;
  let fixture: ComponentFixture<PerfilAdoptadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilAdoptadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilAdoptadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
