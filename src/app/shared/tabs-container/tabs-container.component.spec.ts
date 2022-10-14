import { Component } from '@angular/core';
import { ComponentFixture, TestBed, } from '@angular/core/testing';
import { TabsContainerComponent } from './tabs-container.component';
import { TabComponent } from '../tab/tab.component';
import { By } from '@angular/platform-browser';

//EXAMPLE FOR NESTED COMPONENTS
//as TabsContainer has nested elements and they are nested using content project,
//we need to create a host component to wrap the container with some content components
@Component({
  template: `
    <app-tabs-container>
      <app-tab tabTitle = "Tab 1">Tab A</app-tab>
      <app-tab tabTitle = "Tab 2">Tab B</app-tab>
    </app-tabs-container>
  `
})
class TestHostComponent{}


describe('TabsContainerComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabsContainerComponent, TabComponent, TestHostComponent ] 
      //hostcomponent and all descendants must be declared
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 2 tabs', () => {
    //pattern 1
    const els = fixture.debugElement.queryAll(By.css('li')); //get all li-elements from the template
    //pattern 2
    const containerComponent = fixture.debugElement.query(By.directive(TabsContainerComponent)); //get tabs-container-component
    const tabsProperty = containerComponent.componentInstance.tabs; //get tabs-property from component

    // assertion pattern 1
    expect(els.length)
      .withContext("tabs did not render") //custom error message
      .toBe(2);
    //assertion passtern 2
    expect(tabsProperty.length)
      .withContext("tabs property could not be obtained")
      .toBe(2);
  });

});
