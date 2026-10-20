import { Injectable, Inject } from '@nestjs/common';
import { Identificador } from '../../compartido/dominio/identificador';
import { RecursoNoEncontrado } from '../../compartido/dominio/errores';
import { Tarjeta } from '../dominio/tarjeta';
import { TARJETA_REPOSITORY_PORT, TarjetaRepositoryPort } from './puertos';

@Injectable()
export class ConsultarTarjetasUseCase {
  constructor(
    @Inject(TARJETA_REPOSITORY_PORT)
    private readonly repositorio: TarjetaRepositoryPort,
  ) {}

  async porId(idTarjeta: string): Promise<Tarjeta> {
    const id = Identificador.desde(idTarjeta);
    const tarjeta = await this.repositorio.porId(id);
    if (!tarjeta) {
      throw new RecursoNoEncontrado(`La tarjeta ${idTarjeta} no existe.`);
    }
    return tarjeta;
  }

  async listar(): Promise<Tarjeta[]> {
    return this.repositorio.listar();
  }
}
