import { TestBed } from '@angular/core/testing';
import { PlacesService } from './places.service';

describe('Places', () => {
  let service: PlacesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlacesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
