import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Cliente} from '../model/cliente';
import {Region} from '../model/region';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:8080/api/v1/cliente-service/clientes';

  constructor(private http: HttpClient) {}

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  getCliente(id: string | null): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo cliente
  createCliente(cliente: Cliente): Observable<Cliente> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Cliente>(this.apiUrl, cliente, { headers });
  }

  // Actualizar un cliente existente
  updateCliente(cliente: Cliente): Observable<Cliente> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Cliente>(`${this.apiUrl}/${cliente.id}`, cliente, { headers });
  }

  // Eliminar un cliente por ID
  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Método para obtener la lista de regiones desde el backend
  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.apiUrl}/regiones`);
  }
}
