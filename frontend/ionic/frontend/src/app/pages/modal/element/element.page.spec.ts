import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ElementPage } from './element.page';

describe('ElementPage', () => {
  let component: ElementPage;
  let fixture: ComponentFixture<ElementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ElementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
