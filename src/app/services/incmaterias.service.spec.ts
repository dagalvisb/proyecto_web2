import { TestBed } from '@angular/core/testing';

import { IncmateriasService } from './incmaterias.service';

describe('IncmateriasService', () => {
  let service: IncmateriasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncmateriasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
