import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser'
import { TabComponent } from './tab.component';

describe('TabComponent', () => {
  let component: TabComponent;
  let fixture: ComponentFixture<TabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have class .hidden', () => {
    const el = fixture.debugElement.query(By.css('.hidden'));   //select element idependent of platform using angular, recommended
    const el2 = fixture.nativeElement.querySelector(".hidden"); //select native dom-element via angular
    const el3 = document.querySelector(".hidden");              //select native dom element via browser's dom API

    expect(el).toBeTruthy();

  });

  it('should not have class .hidden', () => {

    component.active = true; //set element visible
    fixture.detectChanges();  //detect changes after changing attribute

    const el = fixture.debugElement.query(By.css('.hidden'));   //select element idependent of platform using angular, recommended
    const el2 = fixture.nativeElement.querySelector(".hidden"); //select native dom-element via angular
    const el3 = document.querySelector(".hidden");              //select native dom element via browser's dom API

    expect(el).not.toBeTruthy();

  });

});
