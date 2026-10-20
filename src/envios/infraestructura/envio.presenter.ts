import { Envio } from '../dominio/envio';

export function presentarEnvio(envio: Envio) {
  const d = envio.aDatos();
  return {
    id: d.id,
    tarjeta_id: d.tarjetaId,
    estado: d.estado,
    guia_rastreo: d.guiaRastreo,
    transportadora: d.transportadora,
    direccion: {
      calle: d.direccion.calle,
      ciudad: d.direccion.ciudad,
      pais: d.direccion.pais,
      codigo_postal: d.direccion.codigoPostal,
    },
    creado_en: d.creadoEn.toISOString(),
    actualizado_en: d.actualizadoEn.toISOString(),
  };
}
