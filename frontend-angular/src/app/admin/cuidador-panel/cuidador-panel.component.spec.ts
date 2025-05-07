import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuidadorPanelComponent } from './cuidador-panel.component';

describe('CuidadorPanelComponent', () => {
  let component: CuidadorPanelComponent;
  let fixture: ComponentFixture<CuidadorPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuidadorPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuidadorPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
