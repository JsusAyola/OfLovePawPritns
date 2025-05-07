import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MascotasAdoptadasComponent } from './mascotas-adoptadas.component';

describe('MascotasAdoptadasComponent', () => {
  let component: MascotasAdoptadasComponent;
  let fixture: ComponentFixture<MascotasAdoptadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MascotasAdoptadasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MascotasAdoptadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
