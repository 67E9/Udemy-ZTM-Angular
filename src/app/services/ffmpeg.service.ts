import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {
  private ffmpeg;
  public isReady = false;
  public isRunning = false;

  constructor() { 
    this.ffmpeg = createFFmpeg({log: true}) 
  }

  async init(){ //initialisiere ffmpeg nur, wenn es noch nicht initilisiert ist (Dateien sind groß und brauchen Zeit)
    if(this.isReady){
      return
    }

    await this.ffmpeg.load()

    this.isReady = true;
  }

  async getScreenShots(file: File){
    this.isRunning = true;
    const data = await fetchFile(file);           //tranform file to binary data
    this.ffmpeg.FS('writeFile', file.name, data)  //save binary data to ffmpeg filesystem

    const seconds = [1,2,3];
    const commands: string[] = []
    
    seconds.forEach(second => commands.push(
      //input 
      '-i', file.name,
      //output options
      '-ss', `00:00:0${second}`, //set timestamp
      '-frames:v', '1', //select only one of the frames at the timestamp
      '-filter:v', 'scale=510:-1', //set width of screenshot to 510, -1 means set height automatically to maintain aspect ratio
      // Output
      `output_0${second}.png`
    ))

    await this.ffmpeg.run(
      ...commands     //spread out commands-array as options for ffmpeg
    )

    const screenShots: string[] = [];
    
    seconds.forEach(second => {
      const screenShotFile = this.ffmpeg.FS('readFile', `output_0${second}.png`);     //get screenshots from ffmpeg filesystem
      const screenShotBlob = new Blob([screenShotFile.buffer], {type: 'image/png'});  //convert buffered png to binary large objects
      const screenShotUrl = URL.createObjectURL(screenShotBlob);                      //convert Blob to data URl
      screenShots.push(screenShotUrl);                                                //collect data urls in array
    });

    console.log(screenShots);
    this.isRunning = false;
    return screenShots;
  }

  async urlToBlob(url: string){
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  }

}

/*
this class requires the following setup

npm-depencies
  "@ffmpeg/core": "^0.11.0",
  "@ffmpeg/ffmpeg": "^0.11.5",
  "@types/node": "^18.8.2",

angular.json: 
under projects/clips/architect/build/options/assets add (make file paths from ffmpeg accessible to angular app):
              {
                "input": "node_modules/@ffmpeg/core/dist",
                "output": "node_modules/@ffmpeg/core/dist",
                "glob": "*"
              } 
under projects/clips/architect/serve add (enable cross-origin protection for angular-server)

          "options": {
            "headers": {
              "Cross-Origin-Opener-Policy": "same-origin",
              "Cross-Origin-Embedder-Policy": "require-corp"
            }
          }
*/ 
