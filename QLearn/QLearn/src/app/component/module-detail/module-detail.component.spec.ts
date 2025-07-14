/* import { ComponentFixture, TestBed } from '@angular/core/testing';

import {  ModuleDetailComponent } from './module-detail.component';

describe('ModuleDetailComponent', () => {
  let component: ModuleDetailComponent;
  let fixture: ComponentFixture<ModuleDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ModuleDetailComponent } from './module-detail.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('ModuleDetailComponent', () => {
  let component: ModuleDetailComponent;
  let fixture: ComponentFixture<ModuleDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleDetailComponent, HttpClientTestingModule], // if using standalone
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            // mock route parameters or data as needed
            params: of({ id: '123' }), // example param
            snapshot: {
              paramMap: {
                get: () => '123', // mock for snapshot.paramMap.get()
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModuleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
