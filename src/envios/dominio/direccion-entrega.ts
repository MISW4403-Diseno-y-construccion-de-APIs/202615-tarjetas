export class DireccionEntrega {

  public calle: string;
  public ciudad: string;
  public pais: string;
  public codigoPostal: string;

  constructor(
    calle: string,
    ciudad: string,
    pais: string,
    codigoPostal: string,
  ) {
    this.calle = calle;
    this.ciudad = ciudad;
    this.pais = pais;
    this.codigoPostal = codigoPostal;
  }

  static desde(entrada: any): DireccionEntrega {

    return new DireccionEntrega(
      entrada.calle,
      entrada.ciudad,
      entrada.pais,
      entrada.codigoPostal,
    );
  }

  aDatos() {
    return {
      calle: this.calle,
      ciudad: this.ciudad,
      pais: this.pais,
      codigoPostal: this.codigoPostal,
    };
  }
}
