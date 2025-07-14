/* import { TestBed } from '@angular/core/testing';

import { PrincipalServiceService } from './principal-service.service';

describe('PrincipalServiceService', () => {
  let service: PrincipalServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrincipalServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PrincipalServiceService } from './principal-service.service';

describe('PrincipalServiceService', () => {
  let service: PrincipalServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // ✅ mock HttpClient
      providers: [PrincipalServiceService]
    });
    service = TestBed.inject(PrincipalServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
