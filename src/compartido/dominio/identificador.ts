import { EntradaInvalida } from './errores';

const PATRON_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class Identificador {
  private constructor(public readonly valor: string) {}

  static desde(valor: string): Identificador {
    if (typeof valor !== 'string' || !PATRON_UUID.test(valor.trim())) {
      throw new EntradaInvalida(`Identificador invalido: "${valor}".`);
    }
    return new Identificador(valor.trim().toLowerCase());
  }

  esIgualA(otro: Identificador): boolean {
    return this.valor === otro.valor;
  }

  toString(): string {
    return this.valor;
  }
}
