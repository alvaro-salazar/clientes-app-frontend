import {Component, OnInit} from '@angular/core';
import {Cliente} from '../model/cliente';
import {ClienteService} from '../services/cliente.service';
import { faUserPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import {ClienteFormComponent} from '../cliente-form/cliente-form.component';
import {Region} from '../model/region';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  faEdit = faEdit;
  faTrash = faTrash;
  faUserPlus = faUserPlus;


  constructor(
    private clienteService: ClienteService
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

  addCliente(): void {
    // Cargar regiones desde el backend antes de mostrar el modal
    this.clienteService.getRegiones().subscribe((regiones: Region[]) => {
      // Construir las opciones del select para las regiones
      const regionOptions = regiones
        .map(region => `<option value="${region.id}">${region.nombre}</option>`)
        .join('');

      // Mostrar el formulario en SweetAlert2
      Swal.fire({
        title: 'Añadir Cliente',
        html: `
          <input type="text" id="nombre" class="swal2-input" placeholder="Nombre">
          <input type="text" id="apellido" class="swal2-input" placeholder="Apellido">
          <input type="email" id="email" class="swal2-input" placeholder="Email">
          <select id="region" class="swal2-input" style="
            width: calc(100% - 2rem); /* Ajusta el ancho para que coincida */
            padding: 0.75em;
            border-radius: 0.25em;
            border: 1px solid #dcdcdc;
            color: #6c757d;
            font-size: 1em;
            height: 2.5em;
            box-sizing: border-box;
            background-color: #f8f9fa;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            margin-top: 1em;
            margin-bottom: 1em;
          ">
            <option value="" disabled selected>Seleccione una región</option>
            ${regionOptions}
          </select>
        `,
        focusConfirm: false,
        preConfirm: () => {
          const nombre = (document.getElementById('nombre') as HTMLInputElement).value;
          const apellido = (document.getElementById('apellido') as HTMLInputElement).value;
          const email = (document.getElementById('email') as HTMLInputElement).value;
          const regionId = (document.getElementById('region') as HTMLSelectElement).value;

          if (!nombre || !apellido || !email || !regionId) {
            Swal.showValidationMessage('Todos los campos son obligatorios');
            return;
          }

          return {
            nombre,
            apellido,
            email,
            region: { id: +regionId }
          };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const nuevoCliente: Cliente = {
            nombre: result.value!.nombre,
            apellido: result.value!.apellido,
            email: result.value!.email,
            region: result.value!.region,
            createAt: new Date() // Opcional: puedes omitir esto si el backend lo asigna
          };

          // Guardar el cliente usando el servicio
          this.clienteService.createCliente(nuevoCliente).subscribe(() => {
            this.loadClientes(); // Recargar la lista de clientes
            Swal.fire('¡Creado!', 'El cliente ha sido creado exitosamente.', 'success');
          });
        }
      });
    });
  }


  private loadClientes() {
    this.clienteService.getClientes().subscribe(data => this.clientes = data);
  }
}
