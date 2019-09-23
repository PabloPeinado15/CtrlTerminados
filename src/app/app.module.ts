import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { SharedModule } from './shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppComponent } from './app.component';
import { MainContentOperariosModule } from './main-content-operators/main-content-operators.module';
import { AppRoutingModule } from './app-routing.module';
import { MainContentAdministradoresModule } from './main-content-administrators/main-content-administrators.module';
import { ReactiveStickyHeaderComponent } from './reactive-sticky-header/reactive-sticky-header.component';
import { MainContentRegistryModule } from './main-content-registry/main-content-registry.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MatPaginatorIntl } from '@angular/material';
import { getSpanishPaginatorIntl } from './translate-table/spanish-paginator-intl';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoaderComponent } from './loader/loader.component';
import { ConfigurationPanelModule } from './configuration-panel/configuration-panel.module';

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
    ReactiveStickyHeaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    MainContentOperariosModule,
    MainContentAdministradoresModule,
    MainContentRegistryModule,
    ConfigurationPanelModule,
    AppRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatProgressBarModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    {provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl()}
  ],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
