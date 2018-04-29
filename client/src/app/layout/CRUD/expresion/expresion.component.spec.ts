import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpresionComponent } from './expresion.component';

describe('ExpresionComponent', () => {
   let component: ExpresionComponent;
   let fixture: ComponentFixture<ExpresionComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [ ExpresionComponent ]
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ExpresionComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});