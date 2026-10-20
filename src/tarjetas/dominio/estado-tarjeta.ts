export enum EstadoTarjeta {
  GENERADA = 'GENERADA',
  ACTIVADA = 'ACTIVADA',
  BLOQUEADA = 'BLOQUEADA',
}

export const TRANSICIONES_TARJETA: Readonly<
  Record<EstadoTarjeta, ReadonlyArray<EstadoTarjeta>>
> = {
  [EstadoTarjeta.GENERADA]: [EstadoTarjeta.ACTIVADA, EstadoTarjeta.BLOQUEADA],
  [EstadoTarjeta.ACTIVADA]: [EstadoTarjeta.BLOQUEADA],
  [EstadoTarjeta.BLOQUEADA]: [],
};
