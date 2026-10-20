import { Injectable } from '@nestjs/common';
import { RelojPort } from '../aplicacion/puertos';

@Injectable()
export class RelojSistemaAdapter implements RelojPort {
  ahora(): Date {
    return new Date();
  }
}
