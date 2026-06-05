import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

function toUserMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'No se pudo conectar con el servidor. Revisa tu conexión.';
  }
  switch (error.status) {
    case 400:
      return 'La solicitud no es válida. Revisa los datos e inténtalo de nuevo.';
    case 401:
    case 403:
      return 'No tienes permisos para realizar esta acción.';
    case 404:
      return 'No se encontró el recurso solicitado.';
    case 500:
    case 502:
    case 503:
      return 'Ocurrió un error en el servidor. Inténtalo más tarde.';
    default:
      return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
  }
}

export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error(`[HTTP ${error.status}] ${req.method} ${req.url}`, error.message);
      return throwError(() => new Error(toUserMessage(error)));
    }),
  );