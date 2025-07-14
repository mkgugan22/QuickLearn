/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import 'aos/dist/aos.css'; // ✅ Import AOS CSS
import AOS from 'aos';
import * as echarts from 'echarts';
import { provideEchartsCore } from 'ngx-echarts';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import {tokenInterceptor} from './app/interceptor/token.interceptor';

// ✅ Initialize AOS here before bootstrap
AOS.init({
  duration: 1000,
  once: true
});

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes),  provideHttpClient(withInterceptors([tokenInterceptor])),
    provideAnimations(), // 👈 Required for toastr animations
    provideToastr(),
    importProvidersFrom(NgbModule),
    importProvidersFrom(BrowserAnimationsModule),
    provideEchartsCore({ echarts })
  ],
});
