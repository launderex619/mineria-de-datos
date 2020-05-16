import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { KmeansPage } from './kmeans.page';

describe('KmeansPage', () => {
  let component: KmeansPage;
  let fixture: ComponentFixture<KmeansPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KmeansPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(KmeansPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
