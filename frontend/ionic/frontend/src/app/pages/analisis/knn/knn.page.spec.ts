import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { KnnPage } from './knn.page';

describe('KnnPage', () => {
  let component: KnnPage;
  let fixture: ComponentFixture<KnnPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KnnPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(KnnPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
