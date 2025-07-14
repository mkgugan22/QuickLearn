/* import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalDashboardComponent } from './principal-dashboard.component';

describe('PrincipalDashboardComponent', () => {
  let component: PrincipalDashboardComponent;
  let fixture: ComponentFixture<PrincipalDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrincipalDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrincipalDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
 */

import { TestBed } from '@angular/core/testing';
import { PrincipalDashboardComponent } from './principal-dashboard.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
describe('PrincipalDashboardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PrincipalDashboardComponent, // assuming standalone component
        HttpClientTestingModule,
        NgxEchartsModule.forRoot({
          echarts: () => import('echarts') // ✅ required for charts to load
        })
      ],
         providers: [
      { provide: ActivatedRoute, useValue: ActivatedRoute } // ✅
    ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PrincipalDashboardComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
