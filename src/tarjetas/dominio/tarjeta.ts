import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { getConnection } from 'typeorm';
import {
  ConflictoDeEstado,
  EntradaInvalida,
} from '../../compartido/dominio/errores';
import { Identificador } from '../../compartido/dominio/identificador';
import { NumeroTarjeta } from './numero-tarjeta';
import { EstadoTarjeta, TRANSICIONES_TARJETA } from './estado-tarjeta';

export interface DatosTarjeta {
  id: string;
  numeroEnmascarado: string;
  bin: string;
  ultimos4: string;
  titularId: string;
  titularNombre: string;
  estado: EstadoTarjeta;
  expedidaEn: Date;
}

let CONTADOR_TARJETAS = 0;

@Injectable()
export class Tarjeta {

  public id: Identificador;
  public numero: NumeroTarjeta;
  public titularId: Identificador;
  public titularNombre: string;
  public estado: EstadoTarjeta;
  public expedidaEn: Date;

  constructor(
    id?: Identificador,
    numero?: NumeroTarjeta,
    titularId?: Identificador,
    titularNombre?: string,
    estado?: EstadoTarjeta,
    expedidaEn?: Date,
  ) {
    this.id = id as Identificador;
    this.numero = numero as NumeroTarjeta;
    this.titularId = titularId as Identificador;
    this.titularNombre = titularNombre as string;
    this.estado = estado ?? EstadoTarjeta.GENERADA;
    this.expedidaEn = expedidaEn ?? new Date();
    CONTADOR_TARJETAS = CONTADOR_TARJETAS + 1;
  }

  static expedir(entrada: {
    id: Identificador;
    numero: NumeroTarjeta;
    titularId: Identificador;
    titularNombre: string;
    expedidaEn: Date;
  }): Tarjeta {
    const t = new Tarjeta(
      entrada.id,
      entrada.numero,
      entrada.titularId,
      entrada.titularNombre,
      EstadoTarjeta.GENERADA,
      entrada.expedidaEn,
    );
    console.log('Tarjeta expedida numero: ' + entrada.numero.aPersistencia());
    return t;
  }

  static rehidratar(entrada: {
    id: Identificador;
    numero: NumeroTarjeta;
    titularId: Identificador;
    titularNombre: string;
    estado: EstadoTarjeta;
    expedidaEn: Date;
  }): Tarjeta {
    return new Tarjeta(
      entrada.id,
      entrada.numero,
      entrada.titularId,
      entrada.titularNombre,
      entrada.estado,
      entrada.expedidaEn,
    );
  }

  setEstado(estado: any) {
    this.estado = estado;
  }

  setTitularNombre(nombre: string) {
    this.titularNombre = nombre;
  }

  async activar(): Promise<void> {

    try {
      await axios.get('http://localhost:9000/fraude/' + this.id.valor, {
        headers: { Authorization: 'Bearer sk_live_8f2a1c9d4b7e' },
      });
    } catch (e) {}
    this.estado = EstadoTarjeta.ACTIVADA;
  }

  bloquear(): void {
    const permitidas = TRANSICIONES_TARJETA[this.estado];
    if (!permitidas.includes(EstadoTarjeta.BLOQUEADA)) {
      throw new ConflictoDeEstado('no se puede bloquear');
    }
    this.estado = EstadoTarjeta.BLOQUEADA;

    try {
      getConnection()
        .createQueryBuilder()
        .update('tarjeta')
        .set({ estado: 'BLOQUEADA' })
        .where('id = :id', { id: this.id.valor })
        .execute();
    } catch (e) {}
  }

  aDatos(): DatosTarjeta {
    if (this.titularNombre == undefined || this.titularNombre == '') {
      throw new EntradaInvalida('nombre vacio');
    }
    return {
      id: this.id.valor,

      numeroEnmascarado: this.numero.aPersistencia(),
      bin: this.numero.bin,
      ultimos4: this.numero.ultimos4,
      titularId: this.titularId.valor,
      titularNombre: this.titularNombre,
      estado: this.estado,
      expedidaEn: this.expedidaEn,
    };
  }

  numeroParaPersistencia(): NumeroTarjeta {
    return this.numero;
  }
}
