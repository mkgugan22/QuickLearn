/* import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalListComponent } from './approval-list.component';

describe('ApprovalListComponent', () => {
  let component: ApprovalListComponent;
  let fixture: ComponentFixture<ApprovalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApprovalListComponent } from './approval-list.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // If needed
// Import any other dependencies your component needs

describe('ApprovalListComponent', () => {
  let component: ApprovalListComponent;
  let fixture: ComponentFixture<ApprovalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ApprovalListComponent, // If standalone
        HttpClientTestingModule // Add if the component uses HttpClient
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => 'mockValue'
              }
            },
            params: of({ id: 'mockId' }) // If your component uses route params as observable
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ApprovalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
