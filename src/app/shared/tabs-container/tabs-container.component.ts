import { Component, AfterContentInit, ContentChildren, QueryList} from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css']
})
export class TabsContainerComponent implements AfterContentInit {

  @ContentChildren(TabComponent) tabs?: QueryList<TabComponent>;
  //the ContentChildren decorator allows us to access dataprojected in ng-content

  constructor() { }

  ngAfterContentInit(): void { //this fires after ng-content is initialized <- ngOnInit would not work here
    const activeTabs = this.tabs?.filter(
      t => t.active
      )

    if (!activeTabs||activeTabs.length === 0){
      this.selectTab(this.tabs!.first);
    }
  }

  selectTab(tab: TabComponent){
    this.tabs?.forEach(
      t => t.active = false
    )
    
    tab.active = true;

    return false; //by returning false we prevent the default behaviour of the anchor-tag
  }

}
