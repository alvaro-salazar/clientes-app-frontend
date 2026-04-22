import { Component, OnInit } from '@angular/core';
import { Producto } from '../model/producto';
import { ProductoService } from '../services/producto.service';
import { Page } from '../../shared/page.model';
import Swal from 'sweetalert2';

type Estado = 'cargando' | 'ok' | 'error' | 'vacio';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html'
})
export class ProductosComponent implements OnInit {

  productos: Producto[] = [];
  estado: Estado = 'cargando';
  paginaActual = 0;
  totalPaginas = 0;
  totalElementos = 0;

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.cargar(0);
  }

  cargar(page: number): void {
    this.estado = 'cargando';
    this.productoService.getProductosPaginado(page).subscribe({
      next: (data: Page<Producto>) => {
        this.productos = data.content;
        this.paginaActual = data.number;
        this.totalPaginas = data.totalPages;
        this.totalElementos = data.totalElements;
        this.estado = data.content.length === 0 ? 'vacio' : 'ok';
      },
      error: () => { this.estado = 'error'; }
    });
  }

  private formularioHtml(p?: Producto): string {
    return `
      <input id="sw-nombre" class="swal2-input" placeholder="Nombre (2–20 caracteres)"
             value="${p?.nombre ?? ''}" maxlength="20">
      <input id="sw-descripcion" class="swal2-input" placeholder="Descripción (opcional)"
             value="${p?.descripcion ?? ''}" maxlength="255">
      <input id="sw-precio" type="number" class="swal2-input" placeholder="Precio"
             value="${p?.precio ?? ''}" min="0" step="0.01">
      <input id="sw-stock" type="number" class="swal2-input" placeholder="Stock"
             value="${p?.stock ?? ''}" min="0">
    `;
  }

  private leerFormulario(): Partial<Producto> | null {
    const nombre      = (document.getElementById('sw-nombre') as HTMLInputElement).value.trim();
    const descripcion = (document.getElementById('sw-descripcion') as HTMLInputElement).value.trim();
    const precioStr   = (document.getElementById('sw-precio') as HTMLInputElement).value;
    const stockStr    = (document.getElementById('sw-stock') as HTMLInputElement).value;

    if (nombre.length < 2) {
      Swal.showValidationMessage('El nombre debe tener al menos 2 caracteres.');
      return null;
    }
    if (!precioStr || +precioStr < 0) {
      Swal.showValidationMessage('El precio es obligatorio y no puede ser negativo.');
      return null;
    }
    if (stockStr === '' || +stockStr < 0) {
      Swal.showValidationMessage('El stock es obligatorio y no puede ser negativo.');
      return null;
    }

    return {
      nombre,
      descripcion: descripcion || undefined,
      precio: +precioStr,
      stock: +stockStr
    };
  }

  crear(): void {
    Swal.fire({
      title: 'Nuevo Producto',
      html: this.formularioHtml(),
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      preConfirm: () => this.leerFormulario()
    }).then(result => {
      if (result.isConfirmed && result.value) {
        this.productoService.save(result.value as Producto).subscribe({
          next: res => {
            Swal.fire('¡Creado!', res.mensaje, 'success');
            this.cargar(this.paginaActual);
          },
          error: err => {
            const msg = err.error?.errors
              ? Object.values(err.error.errors).join('\n')
              : 'Error al guardar el producto.';
            Swal.fire('Error de validación', msg, 'error');
          }
        });
      }
    });
  }

  editar(producto: Producto): void {
    Swal.fire({
      title: 'Editar Producto',
      html: this.formularioHtml(producto),
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      preConfirm: () => this.leerFormulario()
    }).then(result => {
      if (result.isConfirmed && result.value) {
        const actualizado: Producto = { ...producto, ...result.value };
        this.productoService.update(actualizado).subscribe({
          next: res => {
            Swal.fire('¡Actualizado!', res.mensaje, 'success');
            this.cargar(this.paginaActual);
          },
          error: err => {
            const msg = err.error?.errors
              ? Object.values(err.error.errors).join('\n')
              : 'Error al actualizar el producto.';
            Swal.fire('Error de validación', msg, 'error');
          }
        });
      }
    });
  }

  eliminar(producto: Producto): void {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: `Se eliminará "${producto.nombre}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar'
    }).then(result => {
      if (result.isConfirmed) {
        this.productoService.delete(producto).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El producto fue eliminado.', 'success');
            const nuevaPagina = this.productos.length === 1 && this.paginaActual > 0
              ? this.paginaActual - 1
              : this.paginaActual;
            this.cargar(nuevaPagina);
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar.', 'error')
        });
      }
    });
  }
}
