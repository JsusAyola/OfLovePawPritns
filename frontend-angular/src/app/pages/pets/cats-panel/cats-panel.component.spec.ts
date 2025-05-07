import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatsPanelComponent } from './cats-panel.component';

describe('CatsPanelComponent', () => {
  let component: CatsPanelComponent;
  let fixture: ComponentFixture<CatsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatsPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
