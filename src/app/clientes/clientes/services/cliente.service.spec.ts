import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClienteService } from './cliente.service';
import { Cliente } from '../model/cliente';
import { Region } from '../model/region';

describe('ClienteService', () => {
  let service: ClienteService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8080/api/v1/cliente-service/clientes';

  const mockRegion: Region = { id: 1, nombre: 'Andina' };
  const mockCliente: Cliente = { id: 1, nombre: 'Ana', apellido: 'Pérez', email: 'ana@mail.com', region: mockRegion };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ClienteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('getClientes() realiza GET a la URL correcta y retorna la lista', () => {
    const mockClientes: Cliente[] = [mockCliente, { id: 2, nombre: 'Luis', apellido: 'García', email: 'luis@mail.com', region: mockRegion }];

    service.getClientes().subscribe(clientes => {
      expect(clientes.length).toBe(2);
      expect(clientes[0].nombre).toBe('Ana');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockClientes);
  });

  it('getCliente() realiza GET con el ID correcto', () => {
    service.getCliente('1').subscribe(cliente => {
      expect(cliente.id).toBe(1);
      expect(cliente.nombre).toBe('Ana');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCliente);
  });

  it('createCliente() realiza POST con Content-Type JSON', () => {
    const nuevoCliente: Cliente = { nombre: 'Carlos', apellido: 'López', email: 'carlos@mail.com', region: mockRegion };
    const respuesta: Cliente = { ...nuevoCliente, id: 3 };

    service.createCliente(nuevoCliente).subscribe(cliente => {
      expect(cliente.id).toBe(3);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(respuesta);
  });

  it('deleteCliente() realiza DELETE a la URL con el ID', () => {
    service.deleteCliente(1).subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
