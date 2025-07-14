/* import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyLearningComponent } from './mylearning.component';

describe('MyLearningComponent', () => {
  let component: MyLearningComponent;
  let fixture: ComponentFixture<MyLearningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyLearningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyLearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
 */

import { TestBed } from '@angular/core/testing';
import { MyLearningComponent } from './mylearning.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';

describe('MyLearningComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MyLearningComponent,          // ✅ Standalone component
        HttpClientTestingModule,      // ✅ Fixes HttpClient injection
        RouterTestingModule,           // (Optional) if routing is used
           ToastrModule.forRoot(),
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(MyLearningComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
