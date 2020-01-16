import { Component } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  lastLectura: any = 0;

  constructor( public http: HttpClient,
               public ws: SocketService) {
    this.ws.subject.subscribe(
        (msg: any) => {
          console.log('message received: ', msg);
          this.lastLectura = msg;
        },
        (err) => console.log(err),
        () => console.log('completado')
    );
    this.ws.subject.next( this.lastLectura = 0 );
  }

}
