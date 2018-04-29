import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdjuntoComponent } from './adjunto.component';

describe('AdjuntoComponent', () => {
   let component: AdjuntoComponent;
   let fixture: ComponentFixture<AdjuntoComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [ AdjuntoComponent ]
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(AdjuntoComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});