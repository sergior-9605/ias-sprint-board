import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { errorInterceptor } from './error-interceptor';

// Ejecuta el interceptor funcional en contexto de inyección
const runInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): ReturnType<HttpInterceptorFn> =>
  TestBed.runInInjectionContext(() => errorInterceptor(req, next));

const fakeReq = new HttpRequest('GET', '/api/tasks');

describe('errorInterceptor (Unit)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
  });

  it('debería crearse como función interceptora', () => {
    expect(errorInterceptor).toBeInstanceOf(Function);
  });

  it('deja pasar una respuesta exitosa sin modificarla', (done) => {
    const next: HttpHandlerFn = () => of(new HttpResponse({ status: 200, body: { ok: true } }));
    runInterceptor(fakeReq, next).subscribe({
      next: (event) => {
        expect(event).toBeInstanceOf(HttpResponse);
        done();
      },
    });
  });

  it('mapea status 0 a mensaje de sin conexión', (done) => {
    const next: HttpHandlerFn = () =>
      throwError(() => new HttpErrorResponse({ status: 0 }));
    runInterceptor(fakeReq, next).subscribe({
      error: (err: Error) => {
        expect(err.message).toBe('No se pudo conectar con el servidor. Revisa tu conexión.');
        done();
      },
    });
  });

  it('mapea status 400 a mensaje de solicitud inválida', (done) => {
    const next: HttpHandlerFn = () =>
      throwError(() => new HttpErrorResponse({ status: 400 }));
    runInterceptor(fakeReq, next).subscribe({
      error: (err: Error) => {
        expect(err.message).toBe('La solicitud no es válida. Revisa los datos e inténtalo de nuevo.');
        done();
      },
    });
  });

  it('mapea status 401 a mensaje de sin permisos', (done) => {
    const next: HttpHandlerFn = () =>
      throwError(() => new HttpErrorResponse({ status: 401 }));
    runInterceptor(fakeReq, next).subscribe({
      error: (err: Error) => {
        expect(err.message).toBe('No tienes permisos para realizar esta acción.');
        done();
      },
    });
  });

  it('mapea status 403 al mismo mensaje de sin permisos que 401', (done) => {
    const next: HttpHandlerFn = () =>
      throwError(() => new HttpErrorResponse({ status: 403 }));
    runInterceptor(fakeReq, next).subscribe({
      error: (err: Error) => {
        expect(err.message).toBe('No tienes permisos para realizar esta acción.');
        done();
      },
    });
  });

  it('mapea status 404 a mensaje de recurso no encontrado', (done) => {
    const next: HttpHandlerFn = () =>
      throwError(() => new HttpErrorResponse({ status: 404 }));
    runInterceptor(fakeReq, next).subscribe({
      error: (err: Error) => {
        expect(err.message).toBe('No se encontró el recurso solicitado.');
        done();
      },
    });
  });

  it('mapea status 500 a mensaje de error en servidor', (done) => {
    const next: HttpHandlerFn = () =>
      throwError(() => new HttpErrorResponse({ status: 500 }));
    runInterceptor(fakeReq, next).subscribe({
      error: (err: Error) => {
        expect(err.message).toBe('Ocurrió un error en el servidor. Inténtalo más tarde.');
        done();
      },
    });
  });

  it('mapea status 502 al mismo mensaje de error en servidor', (done) => {
    const next: HttpHandlerFn = () =>
      throwError(() => new HttpErrorResponse({ status: 502 }));
    runInterceptor(fakeReq, next).subscribe({
      error: (err: Error) => {
        expect(err.message).toBe('Ocurrió un error en el servidor. Inténtalo más tarde.');
        done();
      },
    });
  });

  it('mapea status 503 al mismo mensaje de error en servidor', (done) => {
    const next: HttpHandlerFn = () =>
      throwError(() => new HttpErrorResponse({ status: 503 }));
    runInterceptor(fakeReq, next).subscribe({
      error: (err: Error) => {
        expect(err.message).toBe('Ocurrió un error en el servidor. Inténtalo más tarde.');
        done();
      },
    });
  });

  it('mapea status desconocido a mensaje genérico de error', (done) => {
    const next: HttpHandlerFn = () =>
      throwError(() => new HttpErrorResponse({ status: 418 }));
    runInterceptor(fakeReq, next).subscribe({
      error: (err: Error) => {
        expect(err.message).toBe('Ocurrió un error inesperado. Inténtalo de nuevo.');
        done();
      },
    });
  });

  it('lanza una instancia de Error (no HttpErrorResponse) al suscriptor', (done) => {
    const next: HttpHandlerFn = () =>
      throwError(() => new HttpErrorResponse({ status: 500 }));
    runInterceptor(fakeReq, next).subscribe({
      error: (err: unknown) => {
        expect(err).toBeInstanceOf(Error);
        expect(err).not.toBeInstanceOf(HttpErrorResponse);
        done();
      },
    });
  });

  it('registra el error en consola con el método y la URL', (done) => {
    spyOn(console, 'error');
    const next: HttpHandlerFn = () =>
      throwError(() => new HttpErrorResponse({ status: 404, url: '/api/tasks' }));
    runInterceptor(fakeReq, next).subscribe({
      error: () => {
        expect(console.error).toHaveBeenCalled();
        done();
      },
    });
  });
});
