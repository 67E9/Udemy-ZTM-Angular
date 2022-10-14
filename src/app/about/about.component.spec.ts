import { TestBed, ComponentFixture } from '@angular/core/testing'
import { AboutComponent } from './about.component'

describe('about-component', ()=>{
  let fixture: ComponentFixture<AboutComponent>
  //this fixture will create the instance of the component to be tested
  let component: AboutComponent;
  //this will hold the test specific instance of the component

  beforeEach(async () => {
    await TestBed.configureTestingModule(
    {
      declarations: [AboutComponent]
      //this is the place where you declare the components needed for the test instead of importing all modules from app-module
    }).compileComponents();
  });
  
  beforeEach(()=>{ //run before every test
    fixture = TestBed.createComponent(AboutComponent);
    //initialize fixture with module
    component = fixture.componentInstance;
    //instantiate module for this test
    fixture.detectChanges();
    //run initial change detection (not automated in test mode, so you can run a test before change detection)
  })
  
  it('should create instance', ()=>{
    expect(component).toBeTruthy();
  });
})