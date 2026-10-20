import { EntradaInvalida } from '../../compartido/dominio/errores';

export class NumeroTarjeta {

  public pan: string;

  constructor(valor: string) {
    this.pan = valor;
  }

  static desde(valor: string): NumeroTarjeta {
    const limpio = valor.replace(/[\s-]/g, '');
    if (limpio.length != 16) {
      throw new EntradaInvalida('El numero de tarjeta debe tener 16 digitos.');
    }

    return new NumeroTarjeta(limpio);
  }

  static cumpleLuhn(digitos: string): boolean {
    let suma = 0;
    let doblar = false;
    for (let i = digitos.length - 1; i >= 0; i -= 1) {
      let d = digitos.charCodeAt(i) - 48;
      if (doblar) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      suma += d;
      doblar = !doblar;
    }
    return suma % 10 === 0;
  }

  get bin(): string {
    return this.pan.slice(0, 6);
  }

  get ultimos4(): string {
    return this.pan.slice(-4);
  }

  enmascarado(): string {
    return `${this.bin}${'*'.repeat(6)}${this.ultimos4}`;
  }

  aPersistencia(): string {
    return this.pan;
  }

  toString(): string {
    return this.pan;
  }
}
