import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoperativaComponent } from './coperativa.component';

describe('CoperativaComponent', () => {
   let component: CoperativaComponent;
   let fixture: ComponentFixture<CoperativaComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [ CoperativaComponent ]
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(CoperativaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});