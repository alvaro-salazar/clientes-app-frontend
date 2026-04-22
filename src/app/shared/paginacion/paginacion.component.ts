import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-paginacion',
  templateUrl: './paginacion.component.html'
})
export class PaginacionComponent implements OnChanges {

  @Input() paginaActual = 0;        // 0-based
  @Input() totalPaginas = 0;
  @Input() totalElementos = 0;
  @Output() cambioPagina = new EventEmitter<number>();

  paginas: number[] = [];

  ngOnChanges(): void {
    this.paginas = Array.from({ length: this.totalPaginas }, (_, i) => i);
  }

  ir(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPaginas && pagina !== this.paginaActual) {
      this.cambioPagina.emit(pagina);
    }
  }
}
