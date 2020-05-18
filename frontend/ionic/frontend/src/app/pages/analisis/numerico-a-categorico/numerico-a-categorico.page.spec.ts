import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NumericoACategoricoPage } from './numerico-a-categorico.page';

describe('NumericoACategoricoPage', () => {
  let component: NumericoACategoricoPage;
  let fixture: ComponentFixture<NumericoACategoricoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumericoACategoricoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NumericoACategoricoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
