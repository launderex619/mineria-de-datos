import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OneRPage } from './one-r.page';

describe('OneRPage', () => {
  let component: OneRPage;
  let fixture: ComponentFixture<OneRPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneRPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OneRPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
