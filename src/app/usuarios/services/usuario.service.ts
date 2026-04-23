import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../model/usuario';

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private readonly url = '/api/v1/usuario-service/usuarios';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url);
  }

  crearUsuario(dto: {
    username: string; email: string; firstName: string;
    lastName: string; password: string; rol: string;
  }): Observable<{ mensaje: string; id: string }> {
    return this.http.post<{ mensaje: string; id: string }>(this.url, dto);
  }

  actualizarUsuario(id: string, dto: {
    email: string; firstName: string; lastName: string;
    enabled: boolean; rol: string;
  }): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.url}/${id}`, dto);
  }

  eliminarUsuario(id: string): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.url}/${id}`);
  }
}
