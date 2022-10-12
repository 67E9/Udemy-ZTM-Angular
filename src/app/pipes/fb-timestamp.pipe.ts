import { Pipe, PipeTransform } from '@angular/core';
import firebase from 'firebase/compat/app';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'fbTimestamp'
})
//this is a custom wrapper pipe that transforms a firebase timestamp into a js date object and applies angular's DatePipe to it
export class FbTimestampPipe implements PipeTransform {

  constructor(private datePipe: DatePipe){};

  transform(value: firebase.firestore.FieldValue, ) {
    const date = (value as firebase.firestore.Timestamp).toDate();
    return this.datePipe.transform(date, 'mediumDate');
  }

}
