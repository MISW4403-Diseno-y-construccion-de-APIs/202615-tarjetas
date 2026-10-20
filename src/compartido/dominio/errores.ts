export abstract class ErrorDeDominio extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = new.target.name;
  }
}

export class EntradaInvalida extends ErrorDeDominio {}

export class ConflictoDeEstado extends ErrorDeDominio {}

export class RecursoNoEncontrado extends ErrorDeDominio {}
