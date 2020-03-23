import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { SocketService } from '../services/socket.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  loading: boolean; // ver si se encuentra en proceso de lectura de datos

  constructor( public http: HttpClient,
               public ws: SocketService,
               public toastController: ToastController) {
    // Realiza conexión a socket
    this.ws.subject.next( {message: 'Conectado'});
  }
  // presenta Toast
  async presentToast(item: {mensaje: string, color: string}) {
    const {mensaje, color} = item;
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color
    });
    toast.present();
  }
  // Obtienes datos del servicios
  private async getData() {
    await this.ws.getAPIData().toPromise().then((data: any[]) => {
      // cargamos los datos en memoria para evitar demoras en el servicio
      this.ws.dataAPI = data.map((item: any) => {
        return parseInt(item.indice, 10);
      });
      this.ws.contadorDatos = this.ws.dataAPI.length - 1;
    });
  }

  ngOnInit() {
    this.loading = true;
  }

  ionViewWillEnter() {
    this.getData()
        .then( () => {
          this.ws.subject.subscribe(
              (msg: any) => {
                if ( msg.message === 'Conectado') { // ignora el primer mensaje de conexión
                  return;
                } else {
                  this.ws.dataAPI.push(msg); // agregamos el dato en el arreglo de datos en memoria
                  this.ws.contadorDatos++;
                }
              },
              (err) => console.log(err),
              () => console.log('Conexión socket cerrada')
          );
        })
        .catch( e => {
          this.presentToast({mensaje: e.message, color: 'warning'});
        })
        .finally(() => {
          this.loading = false;
        });
  }

}
