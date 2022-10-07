import firebase from 'firebase/compat/app';

export interface IClip{
    docId?: string
    uid: string,
    displayName: string,
    title: string,
    fileName: string,
    url: string,
    screenshotFileName: string;
    screenshotUrl: string,
    timeStamp: firebase.firestore.FieldValue    
}