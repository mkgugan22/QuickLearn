/* import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StudentDataComponent } from './student-data.component';

describe('StudentDataComponent', () => {
  let component: StudentDataComponent;
  let fixture: ComponentFixture<StudentDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentDataComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentDataComponent } from './student-data.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('StudentDataComponent', () => {
  let component: StudentDataComponent;
  let fixture: ComponentFixture<StudentDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentDataComponent, HttpClientTestingModule], // if standalone
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'some-student-id', // mock route param
              },
            },
            params: of({ id: 'some-student-id' }), // optional: if component uses observable
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
