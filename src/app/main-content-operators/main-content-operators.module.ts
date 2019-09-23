import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MainContentOperatorsComponent } from './main-content-operators.component';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { TableOperariosComponent } from './table-operators/table-operators.component';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '../shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../../environments/environment.prod';

@NgModule({
    declarations: [MainContentOperatorsComponent, TableOperariosComponent],
    imports: [
        MatSelectModule,
        MatGridListModule,
        CommonModule,
        MatTableModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        SharedModule,
        // ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
    ],
    exports: []
})
export class MainContentOperariosModule {}
