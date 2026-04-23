import { Component, OnInit } from '@angular/core';
import { Usuario } from '../model/usuario';
import { UsuarioService } from '../services/usuario.service';
import Swal from 'sweetalert2';

type Estado = 'cargando' | 'ok' | 'error' | 'vacio';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  estado: Estado = 'cargando';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.estado = 'cargando';
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.estado = data.length === 0 ? 'vacio' : 'ok';
      },
      error: () => { this.estado = 'error'; }
    });
  }

  rolBadgeClass(rol: string): string {
    return rol === 'ADMIN' ? 'bg-danger' : 'bg-success';
  }

  crear(): void {
    Swal.fire({
      title: 'Nuevo Usuario',
      html: `
        <input id="sw-username"  class="swal2-input" placeholder="Username">
        <input id="sw-email"     class="swal2-input" placeholder="Email" type="email">
        <input id="sw-firstname" class="swal2-input" placeholder="Nombre">
        <input id="sw-lastname"  class="swal2-input" placeholder="Apellido">
        <input id="sw-password"  class="swal2-input" placeholder="Contraseña" type="password">
        <select id="sw-rol" class="swal2-input" style="height:2.6em">
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const username  = (document.getElementById('sw-username')  as HTMLInputElement).value.trim();
        const email     = (document.getElementById('sw-email')     as HTMLInputElement).value.trim();
        const firstName = (document.getElementById('sw-firstname') as HTMLInputElement).value.trim();
        const lastName  = (document.getElementById('sw-lastname')  as HTMLInputElement).value.trim();
        const password  = (document.getElementById('sw-password')  as HTMLInputElement).value;
        const rol       = (document.getElementById('sw-rol')       as HTMLSelectElement).value;
        if (!username || !email || !firstName || !lastName || !password) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
          return;
        }
        return { username, email, firstName, lastName, password, rol };
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        this.usuarioService.crearUsuario(result.value).subscribe({
          next: () => { Swal.fire('¡Creado!', 'El usuario fue creado.', 'success'); this.cargar(); },
          error: (err) => {
            const msg = err.status === 409 ? 'El username ya existe.' : 'Error al crear el usuario.';
            Swal.fire('Error', msg, 'error');
          }
        });
      }
    });
  }

  editar(usuario: Usuario): void {
    Swal.fire({
      title: 'Editar Usuario',
      html: `
        <input id="sw-email"     class="swal2-input" placeholder="Email" value="${usuario.email}" type="email">
        <input id="sw-firstname" class="swal2-input" placeholder="Nombre" value="${usuario.firstName}">
        <input id="sw-lastname"  class="swal2-input" placeholder="Apellido" value="${usuario.lastName}">
        <select id="sw-rol" class="swal2-input" style="height:2.6em">
          <option value="USER"  ${usuario.roles.includes('USER')  ? 'selected' : ''}>USER</option>
          <option value="ADMIN" ${usuario.roles.includes('ADMIN') ? 'selected' : ''}>ADMIN</option>
        </select>
        <label style="margin-top:.5rem;display:flex;align-items:center;gap:.5rem;justify-content:center">
          <input id="sw-enabled" type="checkbox" ${usuario.enabled ? 'checked' : ''}>
          <span>Activo</span>
        </label>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const email     = (document.getElementById('sw-email')     as HTMLInputElement).value.trim();
        const firstName = (document.getElementById('sw-firstname') as HTMLInputElement).value.trim();
        const lastName  = (document.getElementById('sw-lastname')  as HTMLInputElement).value.trim();
        const rol       = (document.getElementById('sw-rol')       as HTMLSelectElement).value;
        const enabled   = (document.getElementById('sw-enabled')   as HTMLInputElement).checked;
        if (!email || !firstName || !lastName) {
          Swal.showValidationMessage('Email, nombre y apellido son obligatorios');
          return;
        }
        return { email, firstName, lastName, rol, enabled };
      }
    }).then(result => {
      if (result.isConfirmed && result.value && usuario.id) {
        this.usuarioService.actualizarUsuario(usuario.id, result.value).subscribe({
          next: () => { Swal.fire('¡Actualizado!', 'El usuario fue actualizado.', 'success'); this.cargar(); },
          error: () => Swal.fire('Error', 'No se pudo actualizar.', 'error')
        });
      }
    });
  }

  confirmarEliminar(usuario: Usuario): void {
    Swal.fire({
      title: '¿Eliminar usuario?',
      text: `Se eliminará "${usuario.username}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed && usuario.id) {
        this.usuarioService.eliminarUsuario(usuario.id).subscribe({
          next: () => { Swal.fire('Eliminado', 'El usuario fue eliminado.', 'success'); this.cargar(); },
          error: () => Swal.fire('Error', 'No se pudo eliminar.', 'error')
        });
      }
    });
  }
}
