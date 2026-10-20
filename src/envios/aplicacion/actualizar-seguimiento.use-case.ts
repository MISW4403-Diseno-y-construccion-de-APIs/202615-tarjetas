import { Injectable, Inject } from '@nestjs/common';
import { Identificador } from '../../compartido/dominio/identificador';
import {
  EntradaInvalida,
  RecursoNoEncontrado,
} from '../../compartido/dominio/errores';
import { RELOJ_PORT, RelojPort } from '../../compartido/aplicacion/puertos';
import { Envio } from '../dominio/envio';
import { EstadoEnvio } from '../dominio/estado-envio';
import { ENVIO_REPOSITORY_PORT, EnvioRepositoryPort } from './puertos';

export type EventoSeguimiento = 'EN_TRANSITO' | 'ENTREGADO' | 'DEVUELTO';

@Injectable()
export class ActualizarSeguimientoUseCase {
  constructor(
    @Inject(ENVIO_REPOSITORY_PORT)
    private readonly repositorio: EnvioRepositoryPort,
    @Inject(RELOJ_PORT)
    private readonly reloj: RelojPort,
  ) {}

  async ejecutar(idEnvio: string, evento: EventoSeguimiento): Promise<Envio> {
    const id = Identificador.desde(idEnvio);
    const envio = await this.repositorio.porId(id);
    if (!envio) {
      throw new RecursoNoEncontrado(`El envio ${idEnvio} no existe.`);
    }

    const ahora = this.reloj.ahora();
    switch (evento) {
      case 'EN_TRANSITO':
        envio.marcarEnTransito(ahora);
        break;
      case 'ENTREGADO':
        envio.marcarEntregado(ahora);
        break;
      case 'DEVUELTO':
        envio.marcarDevuelto(ahora);
        break;
      default:
        throw new EntradaInvalida(
          `Evento de seguimiento desconocido: "${evento}". Validos: ${Object.values(
            {
              EN_TRANSITO: EstadoEnvio.EN_TRANSITO,
              ENTREGADO: EstadoEnvio.ENTREGADO,
              DEVUELTO: EstadoEnvio.DEVUELTO,
            },
          ).join(', ')}.`,
        );
    }

    await this.repositorio.guardar(envio);
    return envio;
  }
}
