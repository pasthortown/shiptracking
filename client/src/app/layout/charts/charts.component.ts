import { ToastContainer } from 'ng2-toastr/src/toast-container.component';
import { LocationService } from './../origenes_externos/location.service';
import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.scss'],
    animations: [routerTransition()]
})
export class ChartsComponent implements OnInit {
    OnlineServiceInfo = [];
    busy: Promise<any>;

    // bar chart
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabels: string[] = [
        '2012',
        '2013',
        '2014',
        '2015',
        '2016',
        '2017',
        '2018'
    ];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;

    public barChartData: any[] = [
        { data: [65, 59, 80, 81, 56, 55, 40], label: 'Taxis' },
        { data: [28, 48, 40, 19, 86, 27, 90], label: 'Buses' },
        { data: [15, 67, 100, 13, 34, 78, 113], label: 'Mascotas' }
    ];

    // Doughnut
    public doughnutChartLabels: string[] = [
        'Negativas',
        'No Específicas',
        'Positivas'
    ];
    public doughnutChartData: Array<any> = [{data: [10,20,40], label: 'Comentarios y Sugerencias'}];

    // Pie

    public pieChartData: Array<any> = [];
    public pieChartLabels: string[] = [];
    public pieChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };

    // lineChart
    public lineChartData: Array<any> = [];
    public lineChartLabels: Array<any> = [];
    public lineChartOptions: any = {
        responsive: true
    };
    public lineChartColors: Array<any> = [
        {
            borderColor: '#27ea2b',
            pointBackgroundColor: '#3aaa11',
            pointBorderColor: '#4a6d35',
            pointHoverBackgroundColor: '#f1f904',
            pointHoverBorderColor: '#c4c93e'
        },
        {
            borderColor: '#fc620f',
            pointBackgroundColor: '#f7370c',
            pointBorderColor: '#6d4035',
            pointHoverBackgroundColor: '#f1f904',
            pointHoverBorderColor: '#c4c93e'
        }
    ];
    public lineChartLegend: boolean = true;
    public lineChartType: string = 'line';

    public chartHovered(e: any): void {
        // console.log(e);
    }

    // lineChartTime
    public lineChartDataTime: Array<any> = [];
    public lineChartLabelsTime: Array<any> = [];
    public lineChartColorsTime: Array<any> = [
        {
            borderColor: '#27ea2b',
            pointBackgroundColor: '#3aaa11',
            pointBorderColor: '#4a6d35',
            pointHoverBackgroundColor: '#f1f904',
            pointHoverBorderColor: '#c4c93e'
        },
        {
            borderColor: '#fc620f',
            pointBackgroundColor: '#f7370c',
            pointBorderColor: '#6d4035',
            pointHoverBackgroundColor: '#f1f904',
            pointHoverBorderColor: '#c4c93e'
        }
    ];

    constructor(private locationService: LocationService) {}

    ngOnInit() {
        this.getInformacionDiariaRutas();
    }

    getInformacionDiariaRutas(){
        let fechaBuscar = new Date('2018-05-15');
        this.busy = this.locationService.getInformacionDiariaRutas(new Date(fechaBuscar.getFullYear().toString() + '-' + (fechaBuscar.getMonth() + 1).toString() + '-' + (fechaBuscar.getDate() - 5).toString()))
        .then(respuesta => {
            this.OnlineServiceInfo = respuesta[0];
            let etiquetas: string[] = [];
            let distanciaRecorrida: number[] = [];
            let velocidadMedia = [];
            let tiempoDetenido: number[] = [];
            let tiempoMovimiento = [];
            let pie0_20: number = 0;
            let pie20_40: number = 0;
            let pie40_60: number = 0;
            let pie60_80: number = 0;
            let pie80_100: number = 0;
            this.OnlineServiceInfo.forEach(element => {
                let tM = new Date('2018-05-10 ' + element.Tiempo_Detenido.split('.')[0]).getTime() - new Date('2018-05-10 00:00:00').getTime();
                let tD = new Date('2018-05-10 ' + element.Tiempo_Movimiento.split('.')[0]).getTime() - new Date('2018-05-10 00:00:00').getTime();
                tiempoDetenido.push(tM/3600000);
                tiempoMovimiento.push(tD/3600000);
                velocidadMedia.push(Number(element.Velocidad_Promedio));
                distanciaRecorrida.push(Number(element.Distancia_Recorrida));
                if(element.Calificacion_Conductor < 20){
                    pie0_20++;
                }else{
                    if(element.Calificacion_Conductor < 40){
                        pie20_40++;
                    }else{
                        if(element.Calificacion_Conductor < 60){
                            pie40_60++;
                        }else{
                            if(element.Calificacion_Conductor < 80){
                                pie60_80++;
                            }else{
                                pie80_100++;
                            }
                        }
                    }
                }
                etiquetas.push(element.Alias);
            });
            this.lineChartData.push({data: distanciaRecorrida, label: 'Distancia'});
            this.lineChartData.push({data: velocidadMedia, label: 'Velocidad Media'});
            this.lineChartDataTime.push({data: tiempoDetenido, label: 'Tiempo Detenido'});
            this.lineChartDataTime.push({data: tiempoMovimiento, label: 'Tiempo Movimiento'});
            this.lineChartLabels = etiquetas;
            this.lineChartLabelsTime = etiquetas;
            let datosPie = [];
            datosPie.push(pie0_20);
            datosPie.push(pie20_40);
            datosPie.push(pie40_60);
            datosPie.push(pie60_80);
            datosPie.push(pie80_100);
            this.pieChartData.push({data: datosPie, label:'Nivel de Conducción'});
            this.pieChartLabels = ['0-20','20-40','40-60','60-80','80-100'];
        })
        .catch(error => {

        });
    }

}
