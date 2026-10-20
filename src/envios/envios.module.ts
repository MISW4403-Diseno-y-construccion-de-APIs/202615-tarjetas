import { Module } from '@nestjs/common';
import { TarjetasModule } from '../tarjetas/tarjetas.module';
import {
  GENERADOR_ID_PORT,
  RELOJ_PORT,
} from '../compartido/aplicacion/puertos';
import { GeneradorIdUuidAdapter } from '../compartido/infraestructura/generador-id-uuid.adapter';
import { RelojSistemaAdapter } from '../compartido/infraestructura/reloj-sistema.adapter';

import { CrearEnvioUseCase } from './aplicacion/crear-envio.use-case';
import { DespacharEnvioUseCase } from './aplicacion/despachar-envio.use-case';
import { ActualizarSeguimientoUseCase } from './aplicacion/actualizar-seguimiento.use-case';
import { ConsultarEnviosUseCase } from './aplicacion/consultar-envios.use-case';
import {
  CONSULTA_TARJETA_PORT,
  ENVIO_REPOSITORY_PORT,
  TRANSPORTADORA_PORT,
} from './aplicacion/puertos';
import { EnvioEnMemoriaRepository } from './infraestructura/envio-en-memoria.repository';
import { TransportadoraSimuladaAdapter } from './infraestructura/transportadora-simulada.adapter';
import { ConsultaTarjetaAdapter } from './infraestructura/consulta-tarjeta.adapter';
import { EnviosController } from './infraestructura/envios.controller';

@Module({
  imports: [TarjetasModule],
  controllers: [EnviosController],
  providers: [
    CrearEnvioUseCase,
    DespacharEnvioUseCase,
    ActualizarSeguimientoUseCase,
    ConsultarEnviosUseCase,

    { provide: ENVIO_REPOSITORY_PORT, useClass: EnvioEnMemoriaRepository },
    { provide: TRANSPORTADORA_PORT, useClass: TransportadoraSimuladaAdapter },
    { provide: CONSULTA_TARJETA_PORT, useClass: ConsultaTarjetaAdapter },

    { provide: GENERADOR_ID_PORT, useClass: GeneradorIdUuidAdapter },
    { provide: RELOJ_PORT, useClass: RelojSistemaAdapter },
  ],
})
export class EnviosModule {}
