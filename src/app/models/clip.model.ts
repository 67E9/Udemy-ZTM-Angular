import firebase from 'firebase/compat/app';

export interface IClip{
    docId?: string
    uid: string,
    displayName: string,
    title: string,
    fileName: string,
    url: string,
    timeStamp: firebase.firestore.FieldValue    
}