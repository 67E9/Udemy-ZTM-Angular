import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { v4 as uuid } from 'uuid';
import { switchMap, combineLatest, forkJoin } from 'rxjs' 
import { ClipService } from 'src/app/services/clip.service';
import { FfmpegService } from 'src/app/services/ffmpeg.service';
import { IClip } from 'src/app/models/clip.model';

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
  screenshots: string[] = [];
  selectedScreenshot: string = ''
  screenshotTask?: AngularFireUploadTask;

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipService: ClipService,
    private router: Router,
    public ffmpegService: FfmpegService
  ) {
    auth.user.subscribe(user => this.user = user); //make data of logged in user available ahead of time for saving them with file data
    ffmpegService.init();
  }

  ngOnDestroy(): void {
    this.task?.cancel(); //cancel uplaod if user navigates away (whichd destroys the component)
  }

  async submitFile($event: Event){
    if(this.ffmpegService.isRunning){
      return; //prevent new input while screenshots are being processed
    }
    this.isDragOver = false;

    this.file = ($event as DragEvent).dataTransfer ?              //if the dataTranfer-Property associated with the drop-event is present
    ($event as DragEvent).dataTransfer?.files.item(0) ?? null     //bind its files-property to the this.file property
    : ($event.target as HTMLInputElement).files?.item(0) ?? null; //else bind the files property of the html-file-input

    if (!this.file||this.file.type !== 'video/mp4'){ //check if file exists and if files mime type is mp4
      return;
    }

    this.screenshots = await this.ffmpegService.getScreenShots(this.file);
    this.selectedScreenshot = this.screenshots[0];

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/,'')) //set initial value of title form input to filename (without extension)
    this.nextStep = true

    console.log(this.file)
  }

  async uploadFile(){
    this.uploadForm.disable(); //disable reactive form so that user cannot meddle with it during upload
    this.inSubmission = true;
    this.alertColor='blue';
    this.alertMessage = 'We are submitting your data. Please wait.';
    this.showAlert = true;
    this.showPercentage = true;

    const clipFileName = uuid();
    const uploadPath = `clips/${clipFileName}.mp4`;
    
    const screenshotPath = `screenshots/${clipFileName}.png`;
    const screenshotBlob = await this.ffmpegService.urlToBlob(this.selectedScreenshot);

    const clipRef = this.storage.ref(uploadPath); //tell firebase to create a reference url for our file
    this.task = this.storage.upload(uploadPath,this.file);

    const screenshotRef = this.storage.ref(screenshotPath);
    this.screenshotTask = this.storage.upload(screenshotPath,screenshotBlob);
    
  combineLatest( [this.task.percentageChanges(), this.screenshotTask.percentageChanges()]).subscribe(
      progress => {
        const [videoProgress, imgProgress] = progress;

        if (!videoProgress||!imgProgress){
          return;
        }

        this.percentage = ((videoProgress as number) + (imgProgress as number))/200;
      }
    )

    forkJoin([ //combine only the last values of 2 observables
      this.task.snapshotChanges(),
      this.screenshotTask.snapshotChanges()
    ]).pipe(
      switchMap(()=>forkJoin([
        clipRef.getDownloadURL(),
        screenshotRef.getDownloadURL()
      ])) // access the firebase reference url from inner observable
    ).subscribe(
      {
        next: async (urls) => {
          const [clipUrl, screenshotUrl] = urls;
          const clipData: IClip = {
            uid: this.user?.uid as string,
            displayName: this.user?.displayName as string,
            title: this.title.value,
            fileName: `${clipFileName}.mp4`,
            url: clipUrl,
            screenshotFileName: `${clipFileName}.png`,
            screenshotUrl, //shorthand syntax for screenshotUrl: screenShotUrl
            timeStamp: firebase.firestore.FieldValue.serverTimestamp()
          }

          const docRefClip = await this.clipService.createClip(clipData);

          this.alertColor='green';
          this.alertMessage = 'Your file has been uploaded. Success!';
          this.showAlert = true;
          this.showPercentage = false;

          setTimeout( ()=> 
          this.router.navigate(['clip', docRefClip.id])
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
