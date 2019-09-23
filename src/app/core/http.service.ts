import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    HttpClient,
    HttpHeaders,
    HttpHandler
} from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class CustomHttpService extends HttpClient {

    constructor(
        private httpHandler: HttpHandler,
        private loaderService: LoaderService
    ) {
        super(httpHandler);
    }

    get<T>(url: string, options?: any): Observable<any> {

        this.showLoader();

        return super.get<T>(url, options).pipe(
          finalize(() => this.onEnd())
        );
            // .catch(this.onCatch)
            // .do((res: Response) => {
            //     this.onSuccess(res);
            // }, (error: any) => {
            //     this.onError(error);
            // })
            // .finally(() => {
            //     this.onEnd();
            // });
    }

    post<T>(url: string, body: any, options?: any): Observable<any> {
      this.showLoader();
      return super.post<T>(url, body, options).pipe(
        finalize(() => this.onEnd())
      );
    }

    put<T>(url: string, body: any, options?: any): Observable<any> {
      this.showLoader();
      return super.put<T>(url, body, options).pipe(
        finalize(() => this.onEnd())
      );
    }

    delete<T>(url: string, options?: any): Observable<any> {
      this.showLoader();
      return super.delete<T>(url, options).pipe(
        finalize(() => this.onEnd())
      );
    }

    private onCatch(error: any, caught: Observable<any>): Observable<any> {
        return Observable.throw(error);
    }

    private onSuccess(res: Response): void {
        console.log('Request successful');
    }

    private onError(res: Response): void {
        console.log('Error, status code: ' + res.status);
    }

    private onEnd(): void {
        this.hideLoader();
    }

    private showLoader(): void {
      console.log('load');
      this.loaderService.show();
    }

    private hideLoader(): void {
      console.log('hide');
      this.loaderService.hide();
    }
}
