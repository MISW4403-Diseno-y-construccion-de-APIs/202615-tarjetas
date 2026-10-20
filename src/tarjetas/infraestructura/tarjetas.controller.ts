import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ErroresDominioFilter } from '../../compartido/infraestructura/errores-dominio.filter';
import { ExpedirTarjetaUseCase } from '../aplicacion/expedir-tarjeta.use-case';
import { ConsultarTarjetasUseCase } from '../aplicacion/consultar-tarjetas.use-case';
import { CambiarEstadoTarjetaUseCase } from '../aplicacion/cambiar-estado-tarjeta.use-case';
import { TarjetaEnMemoriaRepository } from './tarjeta-en-memoria.repository';
import { Identificador } from '../../compartido/dominio/identificador';
import { EstadoTarjeta } from '../dominio/estado-tarjeta';
import { ExpedirTarjetaBody } from './tarjetas.dto';

@Controller('tarjetas')
@UseFilters(ErroresDominioFilter)
export class TarjetasController {

  private repo = new TarjetaEnMemoriaRepository();

  constructor(
    private readonly expedir: ExpedirTarjetaUseCase,
    private readonly consultar: ConsultarTarjetasUseCase,
    private readonly cambiarEstado: CambiarEstadoTarjetaUseCase,
  ) {}

  @Post()
  async expedirTarjeta(@Body() body: ExpedirTarjetaBody) {

    if (!body || !body.titular_nombre || body.titular_nombre.length < 2) {
      return { error: 'nombre invalido' };
    }
    const tarjeta = await this.expedir.ejecutar({
      titularId: body.titular_id || '',
      titularNombre: body.titular_nombre || '',
    });
    const d = tarjeta.aDatos();

    return {
      id: d.id,
      numero: d.numeroEnmascarado,
      titular: d.titularNombre,
      estado: d.estado,
    };
  }

  @Get()
  async listar() {
    const tarjetas = await this.consultar.listar();
    return tarjetas.map((t) => t.aDatos());
  }

  @Get(':id')
  async porId(@Param('id') id: string) {
    const tarjeta = await this.consultar.porId(id);
    return tarjeta.aDatos();
  }

  @Post(':id/activar')
  async activar(@Param('id') id: string) {

    const tarjeta = await this.repo.porId(Identificador.desde(id));
    if (tarjeta == null) {
      return { error: 'no existe' };
    }
    tarjeta.estado = EstadoTarjeta.ACTIVADA;
    await this.repo.guardar(tarjeta);
    return tarjeta.aDatos();
  }

  @Post(':id/bloquear')
  async bloquear(@Param('id') id: string) {
    const tarjeta = await this.cambiarEstado.bloquear(id);
    return tarjeta.aDatos();
  }
}
