import { Module } from '@nestjs/common';
import {
  GENERADOR_ID_PORT,
  RELOJ_PORT,
} from '../compartido/aplicacion/puertos';
import { GeneradorIdUuidAdapter } from '../compartido/infraestructura/generador-id-uuid.adapter';
import { RelojSistemaAdapter } from '../compartido/infraestructura/reloj-sistema.adapter';

import { ExpedirTarjetaUseCase } from './aplicacion/expedir-tarjeta.use-case';
import { ConsultarTarjetasUseCase } from './aplicacion/consultar-tarjetas.use-case';
import { CambiarEstadoTarjetaUseCase } from './aplicacion/cambiar-estado-tarjeta.use-case';
import {
  GENERADOR_NUMERO_TARJETA_PORT,
  TARJETA_REPOSITORY_PORT,
} from './aplicacion/puertos';
import { TarjetaEnMemoriaRepository } from './infraestructura/tarjeta-en-memoria.repository';
import { GeneradorNumeroTarjetaLuhnAdapter } from './infraestructura/generador-numero-tarjeta-luhn.adapter';
import { TarjetasController } from './infraestructura/tarjetas.controller';

@Module({
  controllers: [TarjetasController],
  providers: [
    ExpedirTarjetaUseCase,
    ConsultarTarjetasUseCase,
    CambiarEstadoTarjetaUseCase,

    { provide: TARJETA_REPOSITORY_PORT, useClass: TarjetaEnMemoriaRepository },

    {
      provide: GENERADOR_NUMERO_TARJETA_PORT,
      useClass: GeneradorNumeroTarjetaLuhnAdapter,
    },

    { provide: GENERADOR_ID_PORT, useClass: GeneradorIdUuidAdapter },
    { provide: RELOJ_PORT, useClass: RelojSistemaAdapter },
  ],
  exports: [TARJETA_REPOSITORY_PORT],
})
export class TarjetasModule {}
