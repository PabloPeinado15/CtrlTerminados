import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XHRBackend, RequestOptions, HttpModule } from '@angular/http';
import {  } from '@angular/material';

import { CustomHttpService } from './http.service';

@NgModule({
    imports: [
      CommonModule,
      HttpModule
    ],
    exports: [
      HttpModule
    ],
    declarations: [
    ],
    providers: [
      // LoaderService,
      // {
      //   provide: HttpService,
      //   useFactory: httpServiceFactory,
      //   deps: [XHRBackend, RequestOptions, LoaderService ]
      // }
    ]
})

export class CoreModule { }
