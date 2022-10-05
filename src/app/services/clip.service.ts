import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import { IClip } from '../models/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, of, BehaviorSubject, combineLatest } from 'rxjs';
import { map, timestamp } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  public clipsCollection: AngularFirestoreCollection<IClip>;

  constructor(
      private db: AngularFirestore,
      private auth: AngularFireAuth,
      private storage: AngularFireStorage
    ) {
      this.clipsCollection = db.collection('clips')
    }

    createClip(data: IClip): Promise<DocumentReference<IClip>>{
      return this.clipsCollection.add(data);
    }

    findUserClips(sort$: BehaviorSubject<string>){
      return combineLatest([this.auth.user, sort$]) //listen to 2 observables at once, if one of them pushes latest values of both get pushed, nice!
        .pipe(
          switchMap(values => {
            const [user, sort] = values;

            if (!user){
              return of([])
            }
            const query = this.clipsCollection.ref.where(
              'uid', '==', user.uid
            ).orderBy(
              'timeStamp',
              sort === '1' ? 'desc' : 'asc'
            )
            return query.get();
            }
          ),
          map(
            snapshot => (snapshot as QuerySnapshot<IClip>).docs
          )
      )
    }

    async updateClip(id:string, title: string){
      await this.clipsCollection.doc(id).update(
        {title} 
        //shorthand for {title: title}
        //when a partial object is passed into a firebase collection only the relevant members will be updated, others remain unchanges
      )
    }

    async deleteClip(clip: IClip){
      const clipRef = this.storage.ref(`clips/${clip.fileName}`)
      await clipRef.delete();

      await this.clipsCollection.doc(clip.docId).delete();
      

    }
}
