import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { IClip } from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  videoOrder = '1'
  //1 equals recent videos, 2 equals oldest video first (compare html template)
  sort$ = new BehaviorSubject<string>(this.videoOrder);
  clips: IClip[] = [];
  activeClip: IClip|null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    private modalService: ModalService
    ) {}

  ngOnInit(): void {

    this.route.queryParamMap.subscribe((params: Params) =>{
      this.videoOrder = params.get('sort') === '2' ? params.get('sort'): '1';
      this.sort$.next(params.get('sort'));
    })

    this.clipService.findUserClips(this.sort$).subscribe(
      docs => {
        this.clips=[];
        docs.forEach(
          doc => {
            this.clips.push({ 
              docId: doc.id,           
              ...doc.data()
            });
          }
        )
      }
    )
  }

  sort($event: Event){

    const { value } = ($event.target as HTMLSelectElement)

    this.router.navigateByUrl(`\manage?sort=${value}`)
    //alternatively queryParams can be set using the router.navigate function -> more complex, more powerful

  }

  openModal($event:Event, clip: IClip){
    $event.preventDefault
    this.activeClip = clip;
    this.modalService.toggleModal('editVideo');
  }

  updateClip($event: IClip){ //event is of type Iclip because it was sent by eventEmitter in edit-compontent
    this.clips.forEach(clip => {
        if (clip.docId === $event.docId){
          clip.title = $event.title;
        }
      }
    )
  }

  async deleteClip($event: Event, clip: IClip){
    $event.preventDefault();

    await this.clipService.deleteClip(clip);

    this.clips.forEach( (element, index) => {
        if(clip.docId === element.docId ){
            this.clips.splice(index, 1);
        }
      }
    )
  }

}
