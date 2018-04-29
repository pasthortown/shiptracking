import { Component, OnInit, ViewChild } from '@angular/core';
import { } from '@types/googlemaps';

@Component({
    selector: 'app-monitoreo',
    templateUrl: './monitoreo.component.html',
    styleUrls: ['./monitoreo.component.scss']
})
export class MonitoreoComponent implements OnInit {
    @ViewChild('gmap') gmapElement: any;
    map: google.maps.Map;
    latitude: any;
    longitude: any;

    constructor() {}

    ngOnInit() {
        const mapProp = {
            center: new google.maps.LatLng(-0.224710, -78.516763),
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
        let location = new google.maps.LatLng(-0.224710, -78.516763);
        var contentString ='<div style="width:300px;float:left;">'+
            '<div class="col-12 text-center"><h3>PCO-9000 - H12</h3></div>'+
            '<div class="col-12"><strong>Atrás de la unidad:</strong> <strong>LE41</strong>, con <strong>3m 14s</strong></div>'+
            '<div class="col-12"><strong>Delante de la unidad:</strong> <strong>LE41</strong>, con <strong>3m 14s</strong></div>'+
            '<div class="col-12"><strong>Velocidad:</strong> 40Km/h</div>'+
            '</div>';

      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });

        var image = './../../../assets/images/bus.png';
        let marker = new google.maps.Marker({
          position: location,
          map: this.map,
          draggable: false,
          icon: image,
          title: 'YAVIRAC'
        });

        marker.addListener('click', function() {
            infowindow.open(this.map, marker);
          });
    }
}
