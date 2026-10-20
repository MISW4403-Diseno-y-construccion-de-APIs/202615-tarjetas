export enum EstadoEnvio {
  PENDIENTE = 'PENDIENTE',
  EN_PREPARACION = 'EN_PREPARACION',
  DESPACHADO = 'DESPACHADO',
  EN_TRANSITO = 'EN_TRANSITO',
  ENTREGADO = 'ENTREGADO',
  DEVUELTO = 'DEVUELTO',
}

export const TRANSICIONES_ENVIO: Readonly<
  Record<EstadoEnvio, ReadonlyArray<EstadoEnvio>>
> = {
  [EstadoEnvio.PENDIENTE]: [EstadoEnvio.EN_PREPARACION],
  [EstadoEnvio.EN_PREPARACION]: [EstadoEnvio.DESPACHADO],
  [EstadoEnvio.DESPACHADO]: [EstadoEnvio.EN_TRANSITO, EstadoEnvio.DEVUELTO],
  [EstadoEnvio.EN_TRANSITO]: [EstadoEnvio.ENTREGADO, EstadoEnvio.DEVUELTO],
  [EstadoEnvio.ENTREGADO]: [],
  [EstadoEnvio.DEVUELTO]: [],
};

export const ESTADOS_TERMINALES_ENVIO: ReadonlySet<EstadoEnvio> = new Set([
  EstadoEnvio.ENTREGADO,
  EstadoEnvio.DEVUELTO,
]);
