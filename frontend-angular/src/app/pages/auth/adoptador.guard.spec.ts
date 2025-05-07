import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adoptadorGuard } from './adoptador.guard';

describe('adoptadorGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adoptadorGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
