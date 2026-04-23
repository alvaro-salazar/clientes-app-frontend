import { Component, OnInit } from '@angular/core';
import { Usuario } from '../model/usuario';
import { UsuarioService } from '../services/usuario.service';
import Swal from 'sweetalert2';

type Estado = 'cargando' | 'ok' | 'error' | 'vacio';

const SW_STYLES = `<style>
  .sw-form { display:flex; flex-direction:column; gap:.75rem; text-align:left; margin-top:.25rem; }
  .sw-section { font-size:.7rem; font-weight:700; color:#adb5bd; text-transform:uppercase;
    letter-spacing:.08em; padding-bottom:.25rem; border-bottom:1px solid #f0f0f0; margin-top:.25rem; }
  .sw-row { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; }
  .sw-field { display:flex; flex-direction:column; gap:.3rem; }
  .sw-field > label { font-size:.78rem; font-weight:600; color:#495057; }
  .sw-field input[type=text], .sw-field input[type=email],
  .sw-field input[type=password], .sw-field input:not([type]) {
    padding:.5rem .7rem; font-size:.9rem; border:1.5px solid #dee2e6;
    border-radius:.4rem; outline:none; width:100%; box-sizing:border-box;
    transition:border-color .15s, box-shadow .15s;
  }
  .sw-field input:focus { border-color:#0d6efd; box-shadow:0 0 0 3px rgba(13,110,253,.12); }
  .sw-role-group { display:flex; gap:.5rem; }
  .sw-role-opt { display:flex; align-items:center; gap:.4rem; flex:1; cursor:pointer;
    padding:.45rem .7rem; border:1.5px solid #dee2e6; border-radius:.4rem;
    font-size:.88rem; color:#495057; transition:all .15s; user-select:none; }
  .sw-role-opt:has(input:checked) { border-color:#0d6efd; background:#e7f1ff; color:#0d47a1; font-weight:600; }
  .sw-role-opt input { display:none; }
  .sw-user-header { display:flex; align-items:center; gap:.75rem; padding:.5rem 0 .75rem;
    border-bottom:1px solid #f0f0f0; margin-bottom:.25rem; }
  .sw-avatar { width:2.5rem; height:2.5rem; border-radius:50%; background:#0d6efd;
    color:#fff; display:flex; align-items:center; justify-content:center;
    font-weight:700; font-size:.95rem; flex-shrink:0; }
  .sw-user-name { font-weight:600; font-size:.95rem; color:#212529; }
  .sw-user-sub  { font-size:.8rem; color:#6c757d; }
  .sw-switch-wrap { display:flex; align-items:center; gap:.6rem; margin-top:.1rem; cursor:pointer; }
  .sw-switch { position:relative; width:2.5rem; height:1.35rem; flex-shrink:0; }
  .sw-switch input { opacity:0; width:0; height:0; }
  .sw-slider { position:absolute; inset:0; background:#ced4da; border-radius:1rem;
    transition:background .2s; }
  .sw-slider:before { content:''; position:absolute; width:1rem; height:1rem;
    left:.18rem; top:.17rem; background:#fff; border-radius:50%; transition:transform .2s; }
  .sw-switch input:checked + .sw-slider { background:#198754; }
  .sw-switch input:checked + .sw-slider:before { transform:translateX(1.1rem); }
  .sw-switch-label { font-size:.88rem; color:#495057; min-width:3.5rem; }
</style>`;

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
      width: 480,
      html: `${SW_STYLES}
        <div class="sw-form">
          <div class="sw-section">Información personal</div>
          <div class="sw-row">
            <div class="sw-field">
              <label for="sw-firstname">Nombre</label>
              <input id="sw-firstname" placeholder="Juan" autocomplete="off">
            </div>
            <div class="sw-field">
              <label for="sw-lastname">Apellido</label>
              <input id="sw-lastname" placeholder="Pérez" autocomplete="off">
            </div>
          </div>
          <div class="sw-field">
            <label for="sw-email">Correo electrónico</label>
            <input id="sw-email" type="email" placeholder="juan.perez@ejemplo.com">
          </div>
          <div class="sw-section" style="margin-top:.4rem">Cuenta</div>
          <div class="sw-field">
            <label for="sw-username">Nombre de usuario</label>
            <input id="sw-username" placeholder="jperez" autocomplete="off">
          </div>
          <div class="sw-field">
            <label for="sw-password">Contraseña</label>
            <input id="sw-password" type="password" placeholder="Mínimo 8 caracteres">
          </div>
          <div class="sw-field">
            <label>Rol</label>
            <div class="sw-role-group">
              <label class="sw-role-opt">
                <input type="radio" name="sw-rol" value="USER" checked>
                <span>Usuario</span>
              </label>
              <label class="sw-role-opt">
                <input type="radio" name="sw-rol" value="ADMIN">
                <span>Admin</span>
              </label>
            </div>
          </div>
        </div>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Crear usuario',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const username  = (document.getElementById('sw-username')  as HTMLInputElement).value.trim();
        const email     = (document.getElementById('sw-email')     as HTMLInputElement).value.trim();
        const firstName = (document.getElementById('sw-firstname') as HTMLInputElement).value.trim();
        const lastName  = (document.getElementById('sw-lastname')  as HTMLInputElement).value.trim();
        const password  = (document.getElementById('sw-password')  as HTMLInputElement).value;
        const rol       = (document.querySelector('input[name="sw-rol"]:checked') as HTMLInputElement).value;
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
    const isAdmin = usuario.roles.includes('ADMIN');
    Swal.fire({
      title: 'Editar Usuario',
      width: 480,
      html: `${SW_STYLES}
        <div class="sw-form">
          <div class="sw-user-header">
            <div class="sw-avatar">${usuario.firstName.charAt(0)}${usuario.lastName.charAt(0)}</div>
            <div>
              <div class="sw-user-name">${usuario.firstName} ${usuario.lastName}</div>
              <div class="sw-user-sub">&#64;${usuario.username}</div>
            </div>
          </div>
          <div class="sw-field">
            <label for="sw-email">Correo electrónico</label>
            <input id="sw-email" type="email" value="${usuario.email}">
          </div>
          <div class="sw-row">
            <div class="sw-field">
              <label for="sw-firstname">Nombre</label>
              <input id="sw-firstname" value="${usuario.firstName}">
            </div>
            <div class="sw-field">
              <label for="sw-lastname">Apellido</label>
              <input id="sw-lastname" value="${usuario.lastName}">
            </div>
          </div>
          <div class="sw-row">
            <div class="sw-field">
              <label>Rol</label>
              <div class="sw-role-group">
                <label class="sw-role-opt">
                  <input type="radio" name="sw-rol" value="USER" ${!isAdmin ? 'checked' : ''}>
                  <span>Usuario</span>
                </label>
                <label class="sw-role-opt">
                  <input type="radio" name="sw-rol" value="ADMIN" ${isAdmin ? 'checked' : ''}>
                  <span>Admin</span>
                </label>
              </div>
            </div>
            <div class="sw-field">
              <label>Estado</label>
              <label class="sw-switch-wrap">
                <div class="sw-switch">
                  <input id="sw-enabled" type="checkbox" ${usuario.enabled ? 'checked' : ''}>
                  <span class="sw-slider"></span>
                </div>
                <span class="sw-switch-label">${usuario.enabled ? 'Activo' : 'Inactivo'}</span>
              </label>
            </div>
          </div>
        </div>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar cambios',
      cancelButtonText: 'Cancelar',
      didOpen: () => {
        const cb = document.getElementById('sw-enabled') as HTMLInputElement;
        const lbl = cb?.closest('.sw-switch-wrap')?.querySelector('.sw-switch-label') as HTMLElement;
        if (cb && lbl) cb.addEventListener('change', () => { lbl.textContent = cb.checked ? 'Activo' : 'Inactivo'; });
      },
      preConfirm: () => {
        const email     = (document.getElementById('sw-email')     as HTMLInputElement).value.trim();
        const firstName = (document.getElementById('sw-firstname') as HTMLInputElement).value.trim();
        const lastName  = (document.getElementById('sw-lastname')  as HTMLInputElement).value.trim();
        const rol       = (document.querySelector('input[name="sw-rol"]:checked') as HTMLInputElement).value;
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
