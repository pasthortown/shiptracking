import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-experiencias',
    templateUrl: './experiencias.component.html',
    styleUrls: ['./experiencias.component.scss']
})
export class ExperienciasComponent implements OnInit {
    constructor(private modalService: NgbModal) {}

    ngOnInit() {}

    mostrarInfo(content, id){
        const options: NgbModalOptions = {
          size: 'lg'
        };
        this.modalService.open(content, options)
        .result
        .then((result => {
           if(result=='download'){

           }
        }),(result => {
           //Esto se ejecuta si la ventana se cierra sin aceptar los cambios
        }));
    }
}
