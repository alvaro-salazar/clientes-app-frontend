import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientesRoutingModule } from './clientes-routing.module';
import { ClientesComponent } from './clientes/clientes/clientes.component';
import { ClienteDetalleComponent } from './clientes/cliente-detalle/cliente-detalle.component';
import {provideHttpClient} from '@angular/common/http';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    ClientesComponent,
    ClienteDetalleComponent
  ],
  imports: [
    CommonModule,
    ClientesRoutingModule,
    FontAwesomeModule
  ],
  providers: [
    provideHttpClient()
  ]
})
export class ClientesModule { }
