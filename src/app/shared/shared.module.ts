import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from './services/client.http.service';

@NgModule({
  imports: [
    FlexLayoutModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [HttpService],
  exports: [FlexLayoutModule, FormsModule, ReactiveFormsModule]
})
export class SharedModule {}
