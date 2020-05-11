import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ZeroRPage } from './zero-r.page';

describe('ZeroRPage', () => {
  let component: ZeroRPage;
  let fixture: ComponentFixture<ZeroRPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZeroRPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ZeroRPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
