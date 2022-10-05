import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs' 
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {
  isDragOver = false;
  file: File|null = null;
  nextStep = false;
  title = new FormControl('',{
      validators: [Validators.required, Validators.minLength(3)],
      nonNullable: true
    })
  uploadForm = new FormGroup({
      title: this.title
    });
  showAlert = false;
  showPercentage = false;
  alertColor = 'blue';
  alertMessage = 'We are submitting your data. Please wait.';
  inSubmission = false;
  percentage = 0;
  user: firebase.User | null = null;
  task?: AngularFireUploadTask;

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipService: ClipService,
    private router: Router
    ) {
      auth.user.subscribe(user => this.user = user) //make data of logged in user available ahead of time for saving them with file data
     }

  ngOnDestroy(): void {
    this.task?.cancel(); //cancel uplaod if user navigates away (whichd destroys the component)
  }

  submitFile($event: Event){
    console.log($event)
    this.isDragOver = false;

    this.file = ($event as DragEvent).dataTransfer ?              //if the dataTranfer-Property associated with the drop-event is present
    ($event as DragEvent).dataTransfer?.files.item(0) ?? null     //bind its files-property to the this.file property
    : ($event.target as HTMLInputElement).files?.item(0) ?? null; //else bind the files property of the html-file-input

    if (!this.file||this.file.type !== 'video/mp4'){ //check if file exists and if files mime type is mp4
      return;
    }

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/,'')) //set initial value of title form input to filename (without extension)
    this.nextStep = true

    console.log(this.file)
  }

  uploadFile(){
    this.uploadForm.disable(); //disable reactive form so that user cannot meddle with it during upload
    this.inSubmission = true;
    this.alertColor='blue';
    this.alertMessage = 'We are submitting your data. Please wait.';
    this.showAlert = true;
    this.showPercentage = true;

    const clipFileName = uuid();
    const uploadPath = `clips/${clipFileName}.mp4`;
    const clipRef = this.storage.ref(uploadPath); //tell firebase to create a reference url for our file
    this.task = this.storage.upload(uploadPath,this.file)

    this.task.percentageChanges().subscribe(
      progress => {
        this.percentage = (progress as number)/100;
      }
    )

    this.task.snapshotChanges().pipe(
      last(), // only pushes the last value emitted from observable
      switchMap(()=>clipRef.getDownloadURL()) // access the firebase reference url from inner observable
    ).subscribe(
      {
        next: async (url) => {
          const clipData = {
            uid: this.user?.uid as string,
            displayName: this.user?.displayName as string,
            title: this.title.value,
            fileName: `${clipFileName}.mp4`,
            url, //shorthand syntax for url: url
            timeStamp: firebase.firestore.FieldValue.serverTimestamp()
          }

          const docRefClip = await this.clipService.createClip(clipData);

          this.alertColor='green';
          this.alertMessage = 'Your file has been uploaded. Success!';
          this.showAlert = true;
          this.showPercentage = false;

          setTimeout(
            ()=> this.router.navigate(['clip', docRefClip.id])
          ,1000)
        },
        error: () => {
          this.uploadForm.enable();
          this.alertColor='red';
          this.alertMessage = 'The upload has failed. Please try again later.';
          this.showAlert = true;
          this.inSubmission = false;
          this.showPercentage = false;
        }
      }
    )


    
  }

}
