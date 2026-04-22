import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Producto } from '../model/producto';
import { Page } from '../../shared/page.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {

  private readonly url = '/api/v1/producto-service/productos';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<{ productos: Producto[] }>(this.url).pipe(
      map(res => res.productos)
    );
  }

  getProducto(id: number): Observable<{ mensaje: string; producto: Producto }> {
    return this.http.get<{ mensaje: string; producto: Producto }>(`${this.url}/${id}`);
  }

  save(producto: Producto): Observable<{ mensaje: string; producto: Producto }> {
    return this.http.post<{ mensaje: string; producto: Producto }>(this.url, producto);
  }

  update(producto: Producto): Observable<{ mensaje: string; producto: Producto }> {
    return this.http.put<{ mensaje: string; producto: Producto }>(this.url, producto);
  }

  delete(producto: Producto): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(this.url, { body: producto });
  }

  getProductosPaginado(page: number): Observable<Page<Producto>> {
    return this.http.get<Page<Producto>>(`/api/v1/producto-service/producto/page/${page}`);
  }
}
