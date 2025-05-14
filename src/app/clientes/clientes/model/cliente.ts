import {Region} from './region';

export class Cliente {
  id?: number;
  nombre: string = '';
  apellido: string = '';
  email: string = '';
  createAt?: Date;
  foto?: string;
  region: Region = new Region();
}
