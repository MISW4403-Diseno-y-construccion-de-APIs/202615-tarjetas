import { Injectable, Inject } from '@nestjs/common';
import { Identificador } from '../../compartido/dominio/identificador';
import { RecursoNoEncontrado } from '../../compartido/dominio/errores';
import { Envio } from '../dominio/envio';
import { ENVIO_REPOSITORY_PORT, EnvioRepositoryPort } from './puertos';

@Injectable()
export class ConsultarEnviosUseCase {
  constructor(
    @Inject(ENVIO_REPOSITORY_PORT)
    private readonly repositorio: EnvioRepositoryPort,
  ) {}

  async porId(idEnvio: string): Promise<Envio> {
    const id = Identificador.desde(idEnvio);
    const envio = await this.repositorio.porId(id);
    if (!envio) {
      throw new RecursoNoEncontrado(`El envio ${idEnvio} no existe.`);
    }
    return envio;
  }

  async listar(): Promise<Envio[]> {
    return this.repositorio.listar();
  }
}
