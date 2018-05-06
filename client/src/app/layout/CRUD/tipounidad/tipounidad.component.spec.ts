import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TipoUnidadComponent } from './tipounidad.component';

describe('TipoUnidadComponent', () => {
   let component: TipoUnidadComponent;
   let fixture: ComponentFixture<TipoUnidadComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [ TipoUnidadComponent ]
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(TipoUnidadComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});