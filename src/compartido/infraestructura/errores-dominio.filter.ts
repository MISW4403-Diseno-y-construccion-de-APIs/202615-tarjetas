import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class ErroresDominioFilter implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse();

    console.log(error);
    res.status(500).json({
      ok: false,
      message: error.message,
      stack: error.stack,
    });
  }
}
