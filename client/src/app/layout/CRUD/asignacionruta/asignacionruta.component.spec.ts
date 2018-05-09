import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AsignacionRutaComponent } from './asignacionruta.component';

describe('AsignacionRutaComponent', () => {
   let component: AsignacionRutaComponent;
   let fixture: ComponentFixture<AsignacionRutaComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [ AsignacionRutaComponent ]
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(AsignacionRutaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});