import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import  { ActivatedRoute, Params } from '@angular/router'
import videojs from 'video.js';
import { IClip } from '../models/clip.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-clips',
  templateUrl: './clips.component.html',
  styleUrls: ['./clips.component.css'],
  encapsulation: ViewEncapsulation.None, //normally angular isolates css of every component by adding unique ids to every selector, this is deactivated here to allow for import of styles
  providers: [DatePipe]
})
export class ClipsComponent implements OnInit {
  //public id = ''; //not in use anymore
  @ViewChild('videoPlayer',{static: true}) target?: ElementRef;
  //usually elements gotten with viewchild should be modified in ngAfterInit
  //but because the Element does not bear structural directives we can use ngOnInit
  //to do so we need to add {static: true}, to tell angular the element is static
  player?: videojs.Player;
  clip?: IClip;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // this.id = this.route.snapshot.params.id; 
    // this Call is not suitable because the snapshot will not upload if the route parameter changes, solution: observable as below

    //alternative way to get the id, for demonstration only
    /*this.route.params.subscribe(
      (params): Params => this.id = params.id
    )*/

    this.player = videojs(this.target?.nativeElement);
    
    //get the clip data via the appRoutingModule and the clips-service's resolve function
    this.route.data.subscribe(data => {
      this.clip = data.clip as IClip

      this.player?.src({
        src: this.clip.url,
        type: 'video/mp4'
      })
    })

  }

}
