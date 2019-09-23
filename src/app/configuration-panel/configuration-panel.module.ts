import { NgModule } from '@angular/core';
import { ConfigurationPanelComponent } from './configuration-panel.component';
import { FileDropModule } from 'ngx-file-drop';
import { BrowserModule } from '@angular/platform-browser';
import { PapaParseModule } from 'ngx-papaparse';
import { MatTableModule, MatButtonModule } from '@angular/material';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ConfigurationPanelComponent],
  imports: [
    BrowserModule,
    FileDropModule,
    PapaParseModule,
    MatTableModule,
    SharedModule,
    MatButtonModule
  ],
  providers: [],
  exports: [],
  bootstrap: []
})
export class ConfigurationPanelModule { }
