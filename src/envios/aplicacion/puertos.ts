import { Envio } from '../dominio/envio';
import { Identificador } from '../../compartido/dominio/identificador';

export interface EnvioRepositoryPort {
  guardar(envio: Envio): Promise<void>;
  porId(id: Identificador): Promise<Envio | null>;
  porTarjetaId(tarjetaId: Identificador): Promise<Envio | null>;
  listar(): Promise<Envio[]>;
}
export const ENVIO_REPOSITORY_PORT = Symbol('EnvioRepositoryPort');

export interface ResultadoDespacho {
  guiaRastreo: string;
  transportadora: string;
}

export interface TransportadoraPort {
  despachar(entrada: {
    envioId: Identificador;
    destino: { ciudad: string; pais: string; codigoPostal: string };
  }): Promise<ResultadoDespacho>;
}
export const TRANSPORTADORA_PORT = Symbol('TransportadoraPort');

export interface TarjetaExpedidaVista {
  id: string;
  titularId: string;
  estado: string;
}
export interface ConsultaTarjetaPort {
  obtener(tarjetaId: Identificador): Promise<TarjetaExpedidaVista | null>;
}
export const CONSULTA_TARJETA_PORT = Symbol('ConsultaTarjetaPort');
