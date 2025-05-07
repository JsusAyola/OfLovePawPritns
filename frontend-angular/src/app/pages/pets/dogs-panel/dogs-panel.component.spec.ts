import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DogsPanelComponent } from './dogs-panel.component';

describe('DogsPanelComponent', () => {
  let component: DogsPanelComponent;
  let fixture: ComponentFixture<DogsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DogsPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DogsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
