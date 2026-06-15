import { TestBed } from '@angular/core/testing';

import { PalestraService } from './palestra.service';

describe('PalestraService', () => {
  let service: PalestraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PalestraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
