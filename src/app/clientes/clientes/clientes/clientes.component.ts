import {Component, OnInit} from '@angular/core';
import {Cliente} from '../model/cliente';
import {ClienteService} from '../services/cliente.service';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import {ClienteFormComponent} from '../cliente-form/cliente-form.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  faEdit = faEdit;
  faTrash = faTrash;

  constructor(
    private clienteService: ClienteService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.clienteService.getClientes().subscribe(data => this.clientes = data);
  }

  confirmDelete(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.deleteCliente(id).subscribe(() => {
          this.loadClientes();
          Swal.fire('Eliminado!', 'El cliente ha sido eliminado.', 'success');
        });
      }
    });
  }


  editCliente(cliente: Cliente): void {
    const modalRef = this.modalService.open(ClienteFormComponent);
    modalRef.componentInstance.cliente = { ...cliente }; // Pasamos una copia del cliente

    modalRef.componentInstance.onSave.subscribe((updatedCliente: Cliente) => {
      this.clienteService.updateCliente(updatedCliente).subscribe(() => {
        this.loadClientes();
        modalRef.close();
      });
    });
  }

  private loadClientes() {
    this.clienteService.getClientes().subscribe(data => this.clientes = data);
  }
}
