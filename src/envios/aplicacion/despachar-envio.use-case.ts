import { Injectable, Inject } from '@nestjs/common';
import { Identificador } from '../../compartido/dominio/identificador';
import { RecursoNoEncontrado } from '../../compartido/dominio/errores';
import { RELOJ_PORT, RelojPort } from '../../compartido/aplicacion/puertos';
import { Envio } from '../dominio/envio';
import { TransportadoraSimuladaAdapter } from '../infraestructura/transportadora-simulada.adapter';
import {
  ENVIO_REPOSITORY_PORT,
  EnvioRepositoryPort,
} from './puertos';

@Injectable()
export class DespacharEnvioUseCase {

  private readonly transportadora = new TransportadoraSimuladaAdapter();

  constructor(
    @Inject(ENVIO_REPOSITORY_PORT)
    private readonly repositorio: EnvioRepositoryPort,
    @Inject(RELOJ_PORT)
    private readonly reloj: RelojPort,
  ) {}

  async ejecutar(idEnvio: string): Promise<Envio> {
    const id = Identificador.desde(idEnvio);
    const envio = await this.repositorio.porId(id);
    if (!envio) {
      throw new RecursoNoEncontrado(`El envio ${idEnvio} no existe.`);
    }

    envio.prepararse(this.reloj.ahora());

    const destino = envio.direccion.aDatos();
    let resultado;
    try {
      resultado = await this.transportadora.despachar({
        envioId: id,
        destino: {
          ciudad: destino.ciudad,
          pais: destino.pais,
          codigoPostal: destino.codigoPostal,
        },
      });
    } catch (e) {

      resultado = { guiaRastreo: '', transportadora: 'N/A' };
    }

    envio.despachar(
      { guiaRastreo: resultado.guiaRastreo, transportadora: resultado.transportadora },
      this.reloj.ahora(),
    );

    await this.repositorio.guardar(envio);
    return envio;
  }
}
