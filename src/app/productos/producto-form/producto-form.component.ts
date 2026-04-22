import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from '../model/producto';
import { ProductoService } from '../services/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html'
})
export class ProductoFormComponent implements OnInit {

  producto: Producto = { nombre: '', precio: 0, stock: 0 };
  modoEdicion = false;
  titulo = 'Nuevo Producto';

  constructor(
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicion = true;
      this.titulo = 'Editar Producto';
      this.productoService.getProducto(+id).subscribe({
        next: res => { this.producto = res.producto; },
        error: () => {
          Swal.fire('Error', 'Producto no encontrado.', 'error');
          this.router.navigate(['/productos']);
        }
      });
    }
  }

  guardar(): void {
    const operacion = this.modoEdicion
      ? this.productoService.update(this.producto)
      : this.productoService.save(this.producto);

    operacion.subscribe({
      next: res => {
        Swal.fire('Guardado', res.mensaje, 'success');
        this.router.navigate(['/productos']);
      },
      error: err => {
        const msg = err.error?.errors
          ? Object.values(err.error.errors).join('\n')
          : 'Error al guardar el producto.';
        Swal.fire('Error de validación', msg, 'error');
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/productos']);
  }
}
