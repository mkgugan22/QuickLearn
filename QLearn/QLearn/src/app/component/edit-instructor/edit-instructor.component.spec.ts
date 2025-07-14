/* import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInstructorComponent } from './edit-instructor.component';

describe('EditInstructorComponent', () => {
  let component: EditInstructorComponent;
  let fixture: ComponentFixture<EditInstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditInstructorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
 */

import { TestBed } from '@angular/core/testing';
import { EditInstructorComponent } from './edit-instructor.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EditInstructorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditInstructorComponent, HttpClientTestingModule], // Standalone component
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            // Customize as needed for your component logic
            paramMap: of({ get: () => '123' }),
            snapshot: { paramMap: { get: () => '123' } } 
          }
        }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(EditInstructorComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
