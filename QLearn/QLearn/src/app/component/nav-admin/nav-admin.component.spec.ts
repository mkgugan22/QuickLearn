/* import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavAdminComponent } from './nav-admin.component';

describe('NavAdminComponent', () => {
  let component: NavAdminComponent;
  let fixture: ComponentFixture<NavAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
 */

import { TestBed } from '@angular/core/testing';
import { NavAdminComponent } from './nav-admin.component';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('NavAdminComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavAdminComponent, RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {},
              data: {},
              queryParams: {}
            }
          }
        }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(NavAdminComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
