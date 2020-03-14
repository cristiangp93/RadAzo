import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  constructor( public http: HttpClient,
               public ws: SocketService) { }

  lastLectura: any;
  loading: boolean;

  getLast = new Promise((resolve, reject) => {
    this.ws.getData().subscribe((data: any) => {
          const auxiliar = data[data.length - 1].indice;
          if (auxiliar >= 0) {
            resolve(auxiliar);
          } else {
            reject('Error');
          }
        },
        error => {
          reject(`Error: ${error.message}`);
        });
  });

  ngOnInit() {
    this.loading = true;
  }

  ionViewWillEnter() {
    this.getLast
        .then( data => {
          this.ws.subject.subscribe(
              (msg: any) => {
                console.log(msg);
                this.lastLectura = msg;
              },
              (err) => console.log(err),
              () => console.log('Conexión socket cerrada')
          );
          this.ws.subject.next( this.lastLectura = data );
        })
        .catch( e => {
          console.log(e);
        })
        .finally(() => {
          this.loading = false;
        });
  }

}
