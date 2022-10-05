import { Component, OnInit, OnDestroy, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { IClip } from 'src/app/models/clip.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip|null = null;
  @Output() emitter: EventEmitter<IClip> = new EventEmitter<IClip>();
  title = new FormControl('',{
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true
  });
  clipId = new FormControl('',{
    nonNullable: true
  });
  updateForm = new FormGroup({
    id: this.clipId,
    title: this.title
  });
  inSubmission = false;
  showAlert = false;
  alertColor = "blue";
  alertMessage = "Please wait. We are commiting your changes.";


  constructor(
    private modalservice: ModalService,
    private clipService: ClipService
    ) { }

  ngOnInit(): void {
    this.modalservice.register("editVideo");
  }

  ngOnChanges(){
    if (!this.activeClip || !this.activeClip.docId){
      return;
    }
    this.updateForm.controls.title.setValue(this.activeClip?.title);
    this.updateForm.controls.id.setValue(this.activeClip?.docId);
  }

  ngOnDestroy(): void {
    this.modalservice.unregister("editVideo");
  }

  async submitChanges(){
    if (!this.activeClip){
      return;
    }

    this.updateForm.disable(); //disable reactive form so that user cannot meddle with it during upload
    this.inSubmission = true;
    this.alertColor = "blue"
    this.alertMessage = "Please wait. We are commiting your changes.";
    this.showAlert = true;
    try{
      await this.clipService.updateClip(this.clipId.value, this.title.value);
    } catch (e){
      this.updateForm.enable();
      this.inSubmission = false;
      this.alertColor = "red";
      this.alertMessage = "Submission failed, Please try again later";
    }
    this.alertColor = "green";
    this.alertMessage = "Success!";
    this.activeClip.title = this.title.value;
    this.emitter.emit(this.activeClip);
  }
}
