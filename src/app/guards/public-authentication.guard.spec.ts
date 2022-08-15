import { TestBed } from '@angular/core/testing';

import { PublicAuthenticationGuard } from './public-authentication.guard';

describe('PublicAuthenticationGuard', () => {
  let guard: PublicAuthenticationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PublicAuthenticationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
