import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  template: `
    <h2 mat-dialog-title> Está a punto de eliminar {{ ordersToDelete }} {{ ordersToDelete > 1 ? 'pedidos' : 'pedido' }} </h2>
    <mat-dialog-content>¿Desea continuar?</mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close> Cancelar </button>
      <!-- The mat-dialog-close directive optionally accepts a value as a result for the dialog. -->
      <button mat-button [mat-dialog-close]="true"> Continuar </button>
    </mat-dialog-actions>
  `,
  styles: ['mat-dialog-actions {justify-content: flex-end;}']
})
export class DeleteOrderDialogComponent implements OnInit {

  ordersToDelete: number;

  ngOnInit() {
    this.ordersToDelete = this.data.ordersToDelete;
  }

  constructor (
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

  }

}
