import { Injectable, Inject } from '@nestjs/common';
import { Identificador } from '../../compartido/dominio/identificador';
import {
  ConflictoDeEstado,
  RecursoNoEncontrado,
} from '../../compartido/dominio/errores';
import {
  GENERADOR_ID_PORT,
  GeneradorIdPort,
  RELOJ_PORT,
  RelojPort,
} from '../../compartido/aplicacion/puertos';
import { DireccionEntrega } from '../dominio/direccion-entrega';
import { Envio } from '../dominio/envio';
import {
  CONSULTA_TARJETA_PORT,
  ConsultaTarjetaPort,
  ENVIO_REPOSITORY_PORT,
  EnvioRepositoryPort,
} from './puertos';

export interface CrearEnvioInput {
  tarjetaId: string;
  direccion: {
    calle: string;
    ciudad: string;
    pais: string;
    codigoPostal: string;
  };
}

@Injectable()
export class CrearEnvioUseCase {
  constructor(
    @Inject(ENVIO_REPOSITORY_PORT)
    private readonly repositorio: EnvioRepositoryPort,
    @Inject(CONSULTA_TARJETA_PORT)
    private readonly consultaTarjeta: ConsultaTarjetaPort,
    @Inject(GENERADOR_ID_PORT)
    private readonly generadorId: GeneradorIdPort,
    @Inject(RELOJ_PORT)
    private readonly reloj: RelojPort,
  ) {}

  async ejecutar(input: CrearEnvioInput): Promise<Envio> {
    const tarjetaId = Identificador.desde(input.tarjetaId);

    const tarjeta = await this.consultaTarjeta.obtener(tarjetaId);
    if (!tarjeta) {
      throw new RecursoNoEncontrado(
        `No se puede crear el envio: la tarjeta ${input.tarjetaId} no existe.`,
      );
    }

    const existente = await this.repositorio.porTarjetaId(tarjetaId);
    if (existente) {
      throw new ConflictoDeEstado(
        `La tarjeta ${input.tarjetaId} ya tiene un envio asociado (${existente.id.valor}).`,
      );
    }

    const direccion = DireccionEntrega.desde(input.direccion);
    const envio = Envio.crear({
      id: this.generadorId.siguiente(),
      tarjetaId,
      direccion,
      creadoEn: this.reloj.ahora(),
    });

    await this.repositorio.guardar(envio);
    return envio;
  }
}
