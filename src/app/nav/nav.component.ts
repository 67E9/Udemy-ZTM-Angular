import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(
    private modalService: ModalService, 
    public auth: AuthService
    ) { }

  ngOnInit(): void {
  }

  openModal($event: Event){
    $event.preventDefault(); //prevents default behaviour of the anchor tag, alternative: return false
    this.modalService.toggleModal('auth');
  }

  logout($event: Event){
    this.auth.logout($event);
  }


}
