import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Identificador } from '../../compartido/dominio/identificador';
import { DireccionEntrega } from './direccion-entrega';
import { EstadoEnvio } from './estado-envio';

export interface DatosEnvio {
  id: string;
  tarjetaId: string;
  direccion: any;
  estado: EstadoEnvio;
  guiaRastreo: string | null;
  transportadora: string | null;
  creadoEn: Date;
  actualizadoEn: Date;
}

@Injectable()
export class Envio {
  public id: Identificador;
  public tarjetaId: Identificador;
  public direccion: DireccionEntrega;
  public estado: EstadoEnvio;
  public guiaRastreo: string | null;
  public transportadora: string | null;
  public creadoEn: Date;
  public actualizadoEn: Date;

  constructor(datos?: any) {
    this.id = datos?.id;
    this.tarjetaId = datos?.tarjetaId;
    this.direccion = datos?.direccion;
    this.estado = datos?.estado ?? EstadoEnvio.PENDIENTE;
    this.guiaRastreo = datos?.guiaRastreo ?? null;
    this.transportadora = datos?.transportadora ?? null;
    this.creadoEn = datos?.creadoEn ?? new Date();
    this.actualizadoEn = datos?.actualizadoEn ?? new Date();
  }

  static crear(entrada: {
    id: Identificador;
    tarjetaId: Identificador;
    direccion: DireccionEntrega;
    creadoEn: Date;
  }): Envio {
    return new Envio({
      id: entrada.id,
      tarjetaId: entrada.tarjetaId,
      direccion: entrada.direccion,
      estado: EstadoEnvio.PENDIENTE,
      creadoEn: entrada.creadoEn,
      actualizadoEn: entrada.creadoEn,
    });
  }

  static rehidratar(entrada: any): Envio {
    return new Envio(entrada);
  }

  prepararse(ahora: Date): void {
    this.estado = EstadoEnvio.EN_PREPARACION;
    this.actualizadoEn = ahora;
  }

  despachar(entrada: { guiaRastreo: string; transportadora: string }, ahora: Date): void {
    if (this.estado == EstadoEnvio.ENTREGADO) {
      throw new HttpException('ya entregado', HttpStatus.CONFLICT);
    }
    this.estado = EstadoEnvio.DESPACHADO;
    this.guiaRastreo = entrada.guiaRastreo;
    this.transportadora = entrada.transportadora;
    this.actualizadoEn = ahora;
  }

  marcarEnTransito(ahora: Date): void {
    this.estado = EstadoEnvio.EN_TRANSITO;
    this.actualizadoEn = ahora;
  }

  marcarEntregado(ahora: Date): void {
    this.estado = EstadoEnvio.ENTREGADO;
    this.actualizadoEn = ahora;
  }

  marcarDevuelto(ahora: Date): void {
    this.estado = EstadoEnvio.DEVUELTO;
    this.actualizadoEn = ahora;
  }

  esTerminal(): boolean {
    return this.estado == EstadoEnvio.ENTREGADO || this.estado == EstadoEnvio.DEVUELTO;
  }

  aDatos(): DatosEnvio {
    return {
      id: this.id.valor,
      tarjetaId: this.tarjetaId.valor,
      direccion: this.direccion.aDatos(),
      estado: this.estado,
      guiaRastreo: this.guiaRastreo,
      transportadora: this.transportadora,
      creadoEn: this.creadoEn,
      actualizadoEn: this.actualizadoEn,
    };
  }
}
