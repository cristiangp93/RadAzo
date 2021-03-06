import { Injectable } from '@angular/core';
import { webSocket} from 'rxjs/webSocket';
import { HttpClient } from '@angular/common/http';
import { environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  subject = webSocket(`ws://${environment.apiURL}:8084/socket`);
  dataAPI: any = null;
  contadorDatos = 0;

  constructor(public http: HttpClient) {
    console.log('Servicio socket listo');
  }

  getAPIData() {
    return this.http.get(`http://${environment.apiURL}:8085/finTabla`);
  }
}
