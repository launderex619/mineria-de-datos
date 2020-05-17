import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NormalizacionPage } from './normalizacion.page';

describe('NormalizacionPage', () => {
  let component: NormalizacionPage;
  let fixture: ComponentFixture<NormalizacionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NormalizacionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NormalizacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
