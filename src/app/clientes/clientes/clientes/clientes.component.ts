import { Component, OnInit } from '@angular/core';
import { Cliente } from '../model/cliente';
import { ClienteService } from '../services/cliente.service';
import Swal from 'sweetalert2';
import { Region } from '../model/region';
import { Page } from '../../../shared/page.model';

type Estado = 'cargando' | 'ok' | 'error' | 'vacio';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];
  estado: Estado = 'cargando';
  paginaActual = 0;
  totalPaginas = 0;
  totalElementos = 0;

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.cargar(0);
  }

  cargar(page: number): void {
    this.estado = 'cargando';
    this.clienteService.getClientesPaginado(page).subscribe({
      next: (data: Page<Cliente>) => {
        this.clientes = data.content;
        this.paginaActual = data.number;
        this.totalPaginas = data.totalPages;
        this.totalElementos = data.totalElements;
        this.estado = data.content.length === 0 ? 'vacio' : 'ok';
      },
      error: () => { this.estado = 'error'; }
    });
  }

  confirmDelete(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.clienteService.deleteCliente(id).subscribe(() => {
          Swal.fire('Eliminado!', 'El cliente ha sido eliminado.', 'success');
          // Si era el último de la página, retroceder
          const nuevaPagina = this.clientes.length === 1 && this.paginaActual > 0
            ? this.paginaActual - 1
            : this.paginaActual;
          this.cargar(nuevaPagina);
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
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre = (Swal.getPopup()!.querySelector('#nombre') as HTMLInputElement).value;
        const apellido = (Swal.getPopup()!.querySelector('#apellido') as HTMLInputElement).value;
        const email = (Swal.getPopup()!.querySelector('#email') as HTMLInputElement).value;
        return { nombre, apellido, email };
      }
    }).then(result => {
      if (result.isConfirmed) {
        cliente.nombre = result.value!.nombre;
        cliente.apellido = result.value!.apellido;
        cliente.email = result.value!.email;
        this.clienteService.updateCliente(cliente).subscribe(() => {
          Swal.fire('Actualizado!', 'El cliente ha sido actualizado.', 'success');
          this.cargar(this.paginaActual);
        });
      }
    });
  }

  addCliente(): void {
    this.clienteService.getRegiones().subscribe((regiones: Region[]) => {
      const regionOptions = regiones
        .map(r => `<option value="${r.id}">${r.nombre}</option>`)
        .join('');

      Swal.fire({
        title: 'Añadir Cliente',
        html: `
          <input type="text" id="nombre" class="swal2-input" placeholder="Nombre">
          <input type="text" id="apellido" class="swal2-input" placeholder="Apellido">
          <input type="email" id="email" class="swal2-input" placeholder="Email">
          <select id="region" class="swal2-input" style="
            width: calc(100% - 2rem); padding: 0.75em; border-radius: 0.25em;
            border: 1px solid #dcdcdc; color: #6c757d; font-size: 1em;
            height: 2.5em; box-sizing: border-box; background-color: #f8f9fa;
            -webkit-appearance: none; appearance: none;
            margin-top: 1em; margin-bottom: 1em;">
            <option value="" disabled selected>Seleccione una región</option>
            ${regionOptions}
          </select>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Crear',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
          const nombre   = (document.getElementById('nombre') as HTMLInputElement).value;
          const apellido = (document.getElementById('apellido') as HTMLInputElement).value;
          const email    = (document.getElementById('email') as HTMLInputElement).value;
          const regionId = (document.getElementById('region') as HTMLSelectElement).value;
          if (!nombre || !apellido || !email || !regionId) {
            Swal.showValidationMessage('Todos los campos son obligatorios');
            return;
          }
          return { nombre, apellido, email, region: { id: +regionId } };
        }
      }).then(result => {
        if (result.isConfirmed) {
          const nuevoCliente: Cliente = {
            nombre: result.value!.nombre,
            apellido: result.value!.apellido,
            email: result.value!.email,
            region: result.value!.region,
            createAt: new Date()
          };
          this.clienteService.createCliente(nuevoCliente).subscribe(() => {
            Swal.fire('¡Creado!', 'El cliente ha sido creado exitosamente.', 'success');
            this.cargar(this.paginaActual);
          });
        }
      });
    });
  }
}
