import {Component, OnInit} from '@angular/core';
import { SocketService } from '../services/socket.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  chart: Chart;
  datos: any;
  loading: boolean;

  constructor(public ws: SocketService) {
    // Realiza conexión a socket
    this.loading = true;
    this.ws.subject.next( {message: 'Conectado'});
  }

  // Obtienes datos del servicios
  private async getData() {
    await this.ws.getAPIData().toPromise().then((data: any[]) => {
      // cargamos los datos en memoria para evitar demoras en el servicio
      this.datos = data.map((item: any) => {
        return parseInt(item.indice, 10);
      });
      this.datos = this.datos.slice( this.datos.length - 10, this.datos.length);
    });
  }

  // dibuja el chart
  graficar() {
    this.chart = new Chart('realtime', {
      type: 'line',
      data: {
        labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H' , 'I', 'J'],
        datasets: [
          {
            label: 'Índice de radiación',
            fill: false,
            data: this.datos,
            backgroundColor: '#168ede',
            borderColor: '#168ede'
          }
        ]
      },
      options: {
        tooltips: {
          enabled: false
        },
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            fontColor: 'black'
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: 'black'
            }
          }],
          xAxes: [{
            ticks: {
              fontColor: 'black',
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  ngOnInit() {
    this.getData()
        .then(() => {
          this.graficar();
          this.loading = false;
          this.ws.subject.subscribe(
              (msg: any) => {
                if ( msg.message === 'Conectado') { // ignora el primer mensaje de conexión
                  return;
                } else {
                  this.datos.shift(); // quita el primer elemento
                  this.datos.push(msg); // agrega nuevo al final
                  this.chart.update({duration: 0.5}); // actualiza el gráfico
                }
              },
              (err) => console.log(err),
              () => console.log('Conexión socket cerrada')
          );
        });
  }

}
