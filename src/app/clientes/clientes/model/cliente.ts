export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  createAt: string;
  foto: string;
  region: {
    id: number;
    nombre: string;
  };
}
