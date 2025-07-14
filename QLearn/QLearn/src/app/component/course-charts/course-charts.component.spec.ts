import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseChartsComponent } from './course-charts.component';

describe('CourseChartsComponent', () => {
  let component: CourseChartsComponent;
  let fixture: ComponentFixture<CourseChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseChartsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
