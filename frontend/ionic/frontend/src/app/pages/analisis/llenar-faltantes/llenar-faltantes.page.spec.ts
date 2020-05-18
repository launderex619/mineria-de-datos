import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LlenarFaltantesPage } from './llenar-faltantes.page';

describe('LlenarFaltantesPage', () => {
  let component: LlenarFaltantesPage;
  let fixture: ComponentFixture<LlenarFaltantesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LlenarFaltantesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LlenarFaltantesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
