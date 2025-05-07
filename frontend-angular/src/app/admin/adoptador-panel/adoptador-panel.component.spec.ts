import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdoptadorPanelComponent } from './adoptador-panel.component';

describe('AdoptadorPanelComponent', () => {
  let component: AdoptadorPanelComponent;
  let fixture: ComponentFixture<AdoptadorPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdoptadorPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdoptadorPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
