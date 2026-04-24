export interface Usuario {
  id?: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  roles: string[];
  fotoUrl?: string;  // URL de la foto de perfil. Opcional: puede no existir.
}
