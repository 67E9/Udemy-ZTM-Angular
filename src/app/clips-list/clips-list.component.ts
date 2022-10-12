import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClipService } from '../services/clip.service';
import { DatePipe } from '@angular/common';
import { Input } from '@angular/core';

@Component({
  selector: 'app-clips-list',
  templateUrl: './clips-list.component.html',
  styleUrls: ['./clips-list.component.css'],
  providers: [DatePipe] //make datepipe available to fbTimestampPipe (datepipe itself is not injectable)
})
export class ClipsListComponent implements OnInit, OnDestroy {
@Input() scrollable = true; 

  constructor(public clipService: ClipService) {
    this.clipService.fetchClips();
  }

  ngOnInit(): void {
    if (this.scrollable){
      window.addEventListener('scroll', this.handleScroll);
    }
  }

  ngOnDestroy(): void {
    if (this.scrollable){
      window.removeEventListener('scroll', this.handleScroll);
    }

    this.clipService.pageClips = []; //reset pageCLips array upon leaving the list
  }

  handleScroll = () => { //this must be an arrow function to stay in the context of the class
    const {scrollTop, offsetHeight} = document.documentElement;
    const innerHeight = window.innerHeight;

    if (offsetHeight === Math.round(innerHeight + scrollTop)){
      //alert("we hit the bottom");
      this.clipService.fetchClips();
    }
  }
}
