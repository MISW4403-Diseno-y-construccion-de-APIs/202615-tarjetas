import { Injectable, Inject } from '@nestjs/common';
import { Identificador } from '../../compartido/dominio/identificador';
import { RecursoNoEncontrado } from '../../compartido/dominio/errores';
import { Tarjeta } from '../dominio/tarjeta';
import { TARJETA_REPOSITORY_PORT, TarjetaRepositoryPort } from './puertos';

@Injectable()
export class CambiarEstadoTarjetaUseCase {
  constructor(
    @Inject(TARJETA_REPOSITORY_PORT)
    private readonly repositorio: TarjetaRepositoryPort,
  ) {}

  async activar(idTarjeta: string): Promise<Tarjeta> {
    const tarjeta = await this.cargar(idTarjeta);
    tarjeta.activar();
    await this.repositorio.guardar(tarjeta);
    return tarjeta;
  }

  async bloquear(idTarjeta: string): Promise<Tarjeta> {
    const tarjeta = await this.cargar(idTarjeta);
    tarjeta.bloquear();
    await this.repositorio.guardar(tarjeta);
    return tarjeta;
  }

  private async cargar(idTarjeta: string): Promise<Tarjeta> {
    const id = Identificador.desde(idTarjeta);
    const tarjeta = await this.repositorio.porId(id);
    if (!tarjeta) {
      throw new RecursoNoEncontrado(`La tarjeta ${idTarjeta} no existe.`);
    }
    return tarjeta;
  }
}
