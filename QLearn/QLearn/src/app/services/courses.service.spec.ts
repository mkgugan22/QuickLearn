/* import { TestBed } from '@angular/core/testing';

import { CourseService } from './courses.service';  

describe('CourseService', () => {
  let service: CourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
 */

import { TestBed } from '@angular/core/testing';
import { CourseService } from './courses.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CourseService', () => {
  let service: CourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],  // ✅ Provides HttpClient mock
      providers: [CourseService]
    });
    service = TestBed.inject(CourseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
