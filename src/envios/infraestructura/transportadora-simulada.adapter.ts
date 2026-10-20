import { Injectable } from '@nestjs/common';
import { randomInt } from 'node:crypto';
import { ResultadoDespacho, TransportadoraPort } from '../aplicacion/puertos';
import { Identificador } from '../../compartido/dominio/identificador';

@Injectable()
export class TransportadoraSimuladaAdapter implements TransportadoraPort {
  private static readonly NOMBRE = 'CourierSimulado';

  async despachar(entrada: {
    envioId: Identificador;
    destino: { ciudad: string; pais: string; codigoPostal: string };
  }): Promise<ResultadoDespacho> {

    const prefijo = entrada.destino.pais.slice(0, 2).toUpperCase();
    const bloque = String(randomInt(100000000, 999999999));
    const sufijo = entrada.envioId.valor.slice(0, 4).toUpperCase();
    return {
      guiaRastreo: `${prefijo}-${bloque}-${sufijo}`,
      transportadora: TransportadoraSimuladaAdapter.NOMBRE,
    };
  }
}
