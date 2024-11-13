import {Component, OnInit} from '@angular/core';
import {Cliente} from '../model/cliente';
import {ClienteService} from '../services/cliente.service';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  faEdit = faEdit;
  faTrash = faTrash;

  constructor(private clienteService: ClienteService) {}

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
    Swal.fire({
      title: 'Editar Cliente',
      html: `
      <input type="text" id="nombre" class="swal2-input" placeholder="Nombre" value="${cliente.nombre}">
      <input type="text" id="apellido" class="swal2-input" placeholder="Apellido" value="${cliente.apellido}">
      <input type="email" id="email" class="swal2-input" placeholder="Email" value="${cliente.email}">
    `,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      preConfirm: () => {
        const nombre = (<HTMLInputElement>Swal.getPopup()!.querySelector('#nombre')).value;
        const apellido = (<HTMLInputElement>Swal.getPopup()!.querySelector('#apellido')).value;
        const email = (<HTMLInputElement>Swal.getPopup()!.querySelector('#email')).value;
        return { nombre, apellido, email };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        cliente.nombre = result.value!.nombre;
        cliente.apellido = result.value!.apellido;
        cliente.email = result.value!.email;
        this.clienteService.updateCliente(cliente).subscribe(() => {
          Swal.fire('Actualizado!', 'El cliente ha sido actualizado.', 'success');
        });
      }
    });
  }

  private loadClientes() {
    this.clienteService.getClientes().subscribe(data => this.clientes = data);
  }
}
