import { NumeroTarjeta } from '../dominio/numero-tarjeta';
import { Tarjeta } from '../dominio/tarjeta';
import { Identificador } from '../../compartido/dominio/identificador';

export interface TarjetaRepositoryPort {
  guardar(tarjeta: Tarjeta): Promise<void>;
  porId(id: Identificador): Promise<Tarjeta | null>;
  listar(): Promise<Tarjeta[]>;
}
export const TARJETA_REPOSITORY_PORT = Symbol('TarjetaRepositoryPort');

export interface GeneradorNumeroTarjetaPort {
  generar(): NumeroTarjeta;
}
export const GENERADOR_NUMERO_TARJETA_PORT = Symbol(
  'GeneradorNumeroTarjetaPort',
);
