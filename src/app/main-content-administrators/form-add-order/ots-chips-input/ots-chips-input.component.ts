import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Input } from '@angular/core';
import { MatChipInputEvent } from '@angular/material';
import { Pedido } from '../form-add-order.component';
import { ControlContainer, NgForm } from '@angular/forms';

@Component({
  selector: 'ots-chips-input', // tslint:disable-line
  templateUrl: './ots-chips-input.component.html',
  styleUrls: ['./ots-chips-input.component.css'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class OtsChipsInputComponent {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @Input() dataModel: Pedido;

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Añade la ot
    if ((value || '').trim()) {
      if (value.indexOf('`') === -1 && this.dataModel.ots.find(ot => ot === Number(value)) !== Number(value)) {
        this.dataModel.ots.push(Number(value.trim()));
      }
    }

    // Reinicia el campo de introducción
    if (input) {
      input.value = '';
    }

  }

  remove(ot: number): void {
    const index = this.dataModel.ots.indexOf(ot);

    if (index >= 0) {
      this.dataModel.ots.splice(index, 1);
    }
  }
}
