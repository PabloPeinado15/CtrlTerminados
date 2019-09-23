import { NgModule } from '@angular/core';
import { MainContentRegistryComponent } from './main-content-registry.component';
import { TableRegistryComponent } from './table-registry/table-registry.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from '../shared/shared.module';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    MainContentRegistryComponent,
    TableRegistryComponent
  ],
  imports: [
    MatFormFieldModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    SharedModule,
    MatInputModule
  ]
})
export class MainContentRegistryModule { }
