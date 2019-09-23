import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TableAdministradoresComponent } from './table-administrators/table-administrators.component';
import { MainContentAdministratorsPanelComponent } from './main-content-administrators.component';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '../shared/shared.module';
import { FormAddOrderComponent } from './form-add-order/form-add-order.component';
import { OtsChipsInputComponent } from './form-add-order/ots-chips-input/ots-chips-input.component';
import { MatChipsModule } from '@angular/material/chips';
import { OnlyNumberDirective } from './form-add-order/ots-chips-input/directive/only-number.directive';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteOrderDialogComponent } from './table-administrators/delete-order-dialog.component';

@NgModule({
  declarations: [
    TableAdministradoresComponent,
    FormAddOrderComponent,
    MainContentAdministratorsPanelComponent,
    OtsChipsInputComponent,
    OnlyNumberDirective,
    DeleteOrderDialogComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    SharedModule,
    MatAutocompleteModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule
  ],
  entryComponents: [
    DeleteOrderDialogComponent
  ]
})
export class MainContentAdministradoresModule { }
