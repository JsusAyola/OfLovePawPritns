import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerBIDashboardComponent } from './power-bidashboard.component';

describe('PowerBIDashboardComponent', () => {
  let component: PowerBIDashboardComponent;
  let fixture: ComponentFixture<PowerBIDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PowerBIDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PowerBIDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
