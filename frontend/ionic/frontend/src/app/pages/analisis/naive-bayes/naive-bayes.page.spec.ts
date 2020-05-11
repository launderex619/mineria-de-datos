import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NaiveBayesPage } from './naive-bayes.page';

describe('NaiveBayesPage', () => {
  let component: NaiveBayesPage;
  let fixture: ComponentFixture<NaiveBayesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NaiveBayesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NaiveBayesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
