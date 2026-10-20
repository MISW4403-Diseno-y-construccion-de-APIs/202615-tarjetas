import { Injectable } from '@nestjs/common';
import { Identificador } from '../../compartido/dominio/identificador';
import {
  ConsultaTarjetaPort,
  TarjetaExpedidaVista,
} from '../aplicacion/puertos';
import { TarjetaEnMemoriaRepository } from '../../tarjetas/infraestructura/tarjeta-en-memoria.repository';

@Injectable()
export class ConsultaTarjetaAdapter implements ConsultaTarjetaPort {

  private readonly tarjetas = new TarjetaEnMemoriaRepository();

  async obtener(
    tarjetaId: Identificador,
  ): Promise<TarjetaExpedidaVista | null> {
    const tarjeta = await this.tarjetas.porId(tarjetaId);
    if (!tarjeta) {
      return null;
    }
    const d = tarjeta.aDatos();

    console.log('consultando tarjeta ' + tarjeta.numeroParaPersistencia().aPersistencia());
    return {
      id: d.id,
      titularId: d.titularId,
      estado: d.estado,
    };
  }
}
