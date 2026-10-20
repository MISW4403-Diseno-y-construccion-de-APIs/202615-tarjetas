import { Identificador } from '../dominio/identificador';

export interface RelojPort {
  ahora(): Date;
}
export const RELOJ_PORT = Symbol('RelojPort');

export interface GeneradorIdPort {
  siguiente(): Identificador;
}
export const GENERADOR_ID_PORT = Symbol('GeneradorIdPort');
