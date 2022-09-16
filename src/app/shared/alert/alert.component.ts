import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  @Input() color = '';

  constructor() { }

  ngOnInit(): void {
  }

  get bgColor(){
    return 'bg-' + this.color + '-400';
    //because css class names are created programmatically they need to be safelisted in the tailwind.config.js! (to prevent purging)
  }

}
