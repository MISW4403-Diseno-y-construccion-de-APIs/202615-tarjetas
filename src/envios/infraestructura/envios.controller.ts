import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ErroresDominioFilter } from '../../compartido/infraestructura/errores-dominio.filter';
import { EntradaInvalida } from '../../compartido/dominio/errores';
import { CrearEnvioUseCase } from '../aplicacion/crear-envio.use-case';
import { DespacharEnvioUseCase } from '../aplicacion/despachar-envio.use-case';
import {
  ActualizarSeguimientoUseCase,
  EventoSeguimiento,
} from '../aplicacion/actualizar-seguimiento.use-case';
import { ConsultarEnviosUseCase } from '../aplicacion/consultar-envios.use-case';
import { CrearEnvioBody, SeguimientoBody } from './envios.dto';
import { presentarEnvio } from './envio.presenter';

const EVENTOS_VALIDOS: ReadonlyArray<EventoSeguimiento> = [
  'EN_TRANSITO',
  'ENTREGADO',
  'DEVUELTO',
];

@Controller('envios')
@UseFilters(ErroresDominioFilter)
export class EnviosController {
  constructor(
    private readonly crear: CrearEnvioUseCase,
    private readonly despachar: DespacharEnvioUseCase,
    private readonly seguimiento: ActualizarSeguimientoUseCase,
    private readonly consultar: ConsultarEnviosUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async crearEnvio(@Body() body: CrearEnvioBody) {
    const envio = await this.crear.ejecutar({
      tarjetaId: body?.tarjeta_id ?? '',
      direccion: {
        calle: body?.direccion?.calle ?? '',
        ciudad: body?.direccion?.ciudad ?? '',
        pais: body?.direccion?.pais ?? '',
        codigoPostal: body?.direccion?.codigo_postal ?? '',
      },
    });
    return presentarEnvio(envio);
  }

  @Get()
  async listar() {
    const envios = await this.consultar.listar();
    return envios.map(presentarEnvio);
  }

  @Get(':id')
  async porId(@Param('id') id: string) {
    const envio = await this.consultar.porId(id);
    return presentarEnvio(envio);
  }

  @Post(':id/despachar')
  async despacharEnvio(@Param('id') id: string) {
    const envio = await this.despachar.ejecutar(id);
    return presentarEnvio(envio);
  }

  @Post(':id/seguimiento')
  async actualizarSeguimiento(
    @Param('id') id: string,
    @Body() body: SeguimientoBody,
  ) {
    const evento = (body?.evento ?? '').toUpperCase() as EventoSeguimiento;
    if (!EVENTOS_VALIDOS.includes(evento)) {
      throw new EntradaInvalida(
        `Evento de seguimiento invalido. Validos: ${EVENTOS_VALIDOS.join(', ')}.`,
      );
    }
    const envio = await this.seguimiento.ejecutar(id, evento);
    return presentarEnvio(envio);
  }
}
