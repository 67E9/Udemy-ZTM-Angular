import { Component, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
  }

  openModal(e: Event){
    e.preventDefault(); //prevents default behaviour of the anchor tag, alternative: return false
    this.modalService.toggleModal('auth');
  }

}
