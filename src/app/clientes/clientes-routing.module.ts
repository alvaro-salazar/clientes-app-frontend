import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ClientesComponent} from './clientes/clientes/clientes.component';
import {ClienteDetalleComponent} from './clientes/cliente-detalle/cliente-detalle.component';

const routes: Routes = [
  { path: '', component: ClientesComponent },
  { path: 'detalle/:id', component: ClienteDetalleComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }
