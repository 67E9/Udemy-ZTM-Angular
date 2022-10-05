import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input() modalId = '';

  constructor(
    public modalService: ModalService,
    private el: ElementRef //allows to manipulate this as a DOM element in the browser
    ) { }

  ngOnInit(): void {
    document.body.appendChild(this.el.nativeElement)  
    //using ElementRef we move the DOM element so its directly below the body, this isolates it from its direct parents CSS
  }

  ngOnDestroy(){
    this.modalService.unregister(this.modalId); //removes modal from service to prevent memory leak
    document.body.removeChild(this.el.nativeElement);
  }

  closeModal(){
    this.modalService.toggleModal(this.modalId);
  }

}
