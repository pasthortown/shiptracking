import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ParadaComponent } from './parada.component';

describe('ParadaComponent', () => {
   let component: ParadaComponent;
   let fixture: ComponentFixture<ParadaComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [ ParadaComponent ]
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ParadaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});