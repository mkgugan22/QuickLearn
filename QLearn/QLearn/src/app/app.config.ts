import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { NgxEchartsModule } from 'ngx-echarts';
import { provideHttpClient} from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';





export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(), // Required for Toastr
    provideToastr(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
      
       

    
  ]
};
