import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()

export class LocationService {
   private headers = new Headers({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
   private urlBase = 'http://dts.location-world.com/api/fleet/';

   constructor(private http: Http) {
   }

   baseUrl(): string {
       return this.urlBase;
   }

   getInformacionDiariaRutas(fecha: Date): Promise<any[]> {
      return this.http.get(this.urlBase+'dailyroutesinfo?token=EF5096EEFE544AB5B2F39B8C1EB736C5&date='+fecha.getFullYear().toString() + ',' + (fecha.getMonth() + 1).toString() + ',' + fecha.getDate().toString()).toPromise().then(response=>response.json() as any[]).catch(this.handleError);
   }

   getOnlineServiceInfo(): Promise<any[]> {
      return this.http.get(this.urlBase+'onlinedevicesinfo?token=EF5096EEFE544AB5B2F39B8C1EB736C5&time_zone_offset=-5&culture=es').toPromise().then(response=>response.json() as any[]).catch(this.handleError);
   }

   getOdometros(): Promise<any[]> {
      return this.http.get(this.urlBase+'odometers?token=EF5096EEFE544AB5B2F39B8C1EB736C5&time_zone_offset=-5').toPromise().then(response=>response.json() as any[]).catch(this.handleError);
   }

   handleError(error: any): Promise<any> {
      console.error('An error occurred', error); // for demo purposes only
      return Promise.reject(error.message || error);
   }
}
