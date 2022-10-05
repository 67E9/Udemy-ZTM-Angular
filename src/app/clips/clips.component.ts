import { Component, OnInit } from '@angular/core';
import  { ActivatedRoute, Params } from '@angular/router'

@Component({
  selector: 'app-clips',
  templateUrl: './clips.component.html',
  styleUrls: ['./clips.component.css']
})
export class ClipsComponent implements OnInit {
  public id = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // this.id = this.route.snapshot.params.id; 
    // this Call is not suitable because the snapshot will not upload if the route parameter changes, solution: observable as below

    this.route.params.subscribe(
      (params): Params => this.id = params.id
    )

  }

}
