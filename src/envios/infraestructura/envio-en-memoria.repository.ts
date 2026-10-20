import { Injectable } from '@nestjs/common';
import { Identificador } from '../../compartido/dominio/identificador';
import { DireccionEntrega } from '../dominio/direccion-entrega';
import { Envio } from '../dominio/envio';
import { EstadoEnvio } from '../dominio/estado-envio';
import { EnvioRepositoryPort } from '../aplicacion/puertos';

interface FilaEnvio {
  id: string;
  tarjetaId: string;
  calle: string;
  ciudad: string;
  pais: string;
  codigoPostal: string;
  estado: EstadoEnvio;
  guiaRastreo: string | null;
  transportadora: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

@Injectable()
export class EnvioEnMemoriaRepository implements EnvioRepositoryPort {
  private readonly datos = new Map<string, FilaEnvio>();

  async guardar(envio: Envio): Promise<void> {
    const d = envio.aDatos();
    this.datos.set(d.id, {
      id: d.id,
      tarjetaId: d.tarjetaId,
      calle: d.direccion.calle,
      ciudad: d.direccion.ciudad,
      pais: d.direccion.pais,
      codigoPostal: d.direccion.codigoPostal,
      estado: d.estado,
      guiaRastreo: d.guiaRastreo,
      transportadora: d.transportadora,
      creadoEn: d.creadoEn.toISOString(),
      actualizadoEn: d.actualizadoEn.toISOString(),
    });
  }

  async porId(id: Identificador): Promise<Envio | null> {
    const fila = this.datos.get(id.valor);
    return fila ? this.aDominio(fila) : null;
  }

  async porTarjetaId(tarjetaId: Identificador): Promise<Envio | null> {
    const fila = [...this.datos.values()].find(
      (f) => f.tarjetaId === tarjetaId.valor,
    );
    return fila ? this.aDominio(fila) : null;
  }

  async listar(): Promise<Envio[]> {
    return [...this.datos.values()].map((f) => this.aDominio(f));
  }

  private aDominio(fila: FilaEnvio): Envio {
    return Envio.rehidratar({
      id: Identificador.desde(fila.id),
      tarjetaId: Identificador.desde(fila.tarjetaId),
      direccion: DireccionEntrega.desde({
        calle: fila.calle,
        ciudad: fila.ciudad,
        pais: fila.pais,
        codigoPostal: fila.codigoPostal,
      }),
      estado: fila.estado,
      guiaRastreo: fila.guiaRastreo,
      transportadora: fila.transportadora,
      creadoEn: new Date(fila.creadoEn),
      actualizadoEn: new Date(fila.actualizadoEn),
    });
  }
}
