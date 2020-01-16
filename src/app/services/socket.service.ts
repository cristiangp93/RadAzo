import { Injectable } from '@angular/core';
import { webSocket} from 'rxjs/webSocket';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  subject = webSocket('ws://172.16.80.39:9090/socket');

  constructor(public http: HttpClient) {
    console.log('Servicio socket listo');
  }

  getData() {
    return this.http.get('http://172.16.80.39:8080/finTabla');
  }
}
