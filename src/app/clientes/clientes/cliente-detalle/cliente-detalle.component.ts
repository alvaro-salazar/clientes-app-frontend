import {Component, OnInit} from '@angular/core';
import {Cliente} from '../model/cliente';
import {ClienteService} from '../services/cliente.service';
import {ActivatedRoute, Router} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente-detalle',
  templateUrl: './cliente-detalle.component.html',
  styleUrl: './cliente-detalle.component.css'
})
export class ClienteDetalleComponent implements OnInit{
  cliente!: Cliente;

  constructor(private route: ActivatedRoute, private router: Router, private clienteService: ClienteService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.clienteService.getCliente(id).subscribe(data => this.cliente = data);
  }

  deleteCliente(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.deleteCliente(id).subscribe(() => {
          Swal.fire('¡Eliminado!', 'El cliente ha sido eliminado.', 'success');
          this.router.navigate(['/clientes']);  // Navegar de vuelta al listado de clientes
        });
      }
    });
  }
}
