import { Directive, HostListener } from '@angular/core'; //HostListener allows us to intercept event emitted from the host element

@Directive({
  selector: '[app-event-blocker]' //this selector msut be applied to html element
})
export class EventBlockerDirective {

                                        
  @HostListener('drop', ['$event'])     //prevents default behaviour, when drop a file into the browser window, i.e. open file
  @HostListener('dragover', ['$event']) //prevents default behaviour, when dragging a file over the browser window
  handleEvent(event: Event){
    event.preventDefault();
    // event.stopPropagation() //can be added to stop bubbling, not strictly required here
  }

}
