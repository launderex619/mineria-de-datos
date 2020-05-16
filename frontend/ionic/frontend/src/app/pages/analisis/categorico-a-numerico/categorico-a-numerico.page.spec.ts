import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CategoricoANumericoPage } from './categorico-a-numerico.page';

describe('CategoricoANumericoPage', () => {
  let component: CategoricoANumericoPage;
  let fixture: ComponentFixture<CategoricoANumericoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoricoANumericoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoricoANumericoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
