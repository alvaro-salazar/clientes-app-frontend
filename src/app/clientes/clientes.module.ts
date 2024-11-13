import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientesRoutingModule } from './clientes-routing.module';
import { ClientesComponent } from './clientes/clientes/clientes.component';
import { ClienteDetalleComponent } from './clientes/cliente-detalle/cliente-detalle.component';
import {provideHttpClient} from '@angular/common/http';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { ClienteFormComponent } from './clientes/cliente-form/cliente-form.component';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    ClientesComponent,
    ClienteDetalleComponent,
    ClienteFormComponent
  ],
  imports: [
    CommonModule,
    ClientesRoutingModule,
    FontAwesomeModule,
    FormsModule
  ],
  providers: [
    provideHttpClient()
  ]
})
export class ClientesModule { }
