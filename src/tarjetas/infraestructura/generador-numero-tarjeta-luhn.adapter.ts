import { Injectable } from '@nestjs/common';
import { randomInt } from 'node:crypto';
import { NumeroTarjeta } from '../dominio/numero-tarjeta';
import { GeneradorNumeroTarjetaPort } from '../aplicacion/puertos';

@Injectable()
export class GeneradorNumeroTarjetaLuhnAdapter implements GeneradorNumeroTarjetaPort {

  private static readonly BIN = '453210';

  generar(): NumeroTarjeta {

    let base = GeneradorNumeroTarjetaLuhnAdapter.BIN;
    for (let i = 0; i < 9; i += 1) {
      base += String(randomInt(0, 10));
    }
    const verificador = this.digitoVerificadorLuhn(base);
    return NumeroTarjeta.desde(base + verificador);
  }

  private digitoVerificadorLuhn(parcial: string): string {
    let suma = 0;
    let doblar = true;
    for (let i = parcial.length - 1; i >= 0; i -= 1) {
      let d = parcial.charCodeAt(i) - 48;
      if (doblar) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      suma += d;
      doblar = !doblar;
    }
    return String((10 - (suma % 10)) % 10);
  }
}
