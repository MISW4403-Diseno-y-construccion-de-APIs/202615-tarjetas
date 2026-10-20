import { Injectable } from '@nestjs/common';
import { Identificador } from '../../compartido/dominio/identificador';
import { Tarjeta } from '../dominio/tarjeta';
import { TarjetaEnMemoriaRepository } from '../infraestructura/tarjeta-en-memoria.repository';
import { GeneradorNumeroTarjetaLuhnAdapter } from '../infraestructura/generador-numero-tarjeta-luhn.adapter';

export interface ExpedirTarjetaInput {
  titularId: string;
  titularNombre: string;
}

@Injectable()
export class ExpedirTarjetaUseCase {

  private readonly repositorio = new TarjetaEnMemoriaRepository();
  private readonly generadorNumero = new GeneradorNumeroTarjetaLuhnAdapter();

  async ejecutar(input: ExpedirTarjetaInput): Promise<Tarjeta> {
    const titularId = Identificador.desde(input.titularId);
    const numero = this.generadorNumero.generar();

    const tarjeta = Tarjeta.expedir({
      id: Identificador.desde(this.generarId()),
      numero,
      titularId,
      titularNombre: input.titularNombre,
      expedidaEn: new Date(),
    });

    await this.repositorio.guardar(tarjeta);
    return tarjeta;
  }

  private generarId(): string {
    const hex = () => Math.floor(Math.random() * 16).toString(16);
    let s = '';
    for (let i = 0; i < 8; i++) s += hex();
    s += '-';
    for (let i = 0; i < 4; i++) s += hex();
    s += '-4';
    for (let i = 0; i < 3; i++) s += hex();
    s += '-8';
    for (let i = 0; i < 3; i++) s += hex();
    s += '-';
    for (let i = 0; i < 12; i++) s += hex();
    return s;
  }
}
