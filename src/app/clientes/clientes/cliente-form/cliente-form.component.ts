import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Cliente} from '../model/cliente';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html'
})
export class ClienteFormComponent {
  @Input() cliente: Cliente = { id: 0, nombre: '', apellido: '', email: '', createAt: new Date(), foto: '', region: { id: 0, nombre: '' } };
  @Output() onSave = new EventEmitter<Cliente>();

  constructor(public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }


  saveCliente(): void {
    this.onSave.emit(this.cliente);
  }
}
