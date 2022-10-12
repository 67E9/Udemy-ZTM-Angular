import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import { IClip } from '../models/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, of, BehaviorSubject, combineLatest,firstValueFrom } from 'rxjs';
import { map, timestamp } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { runInThisContext } from 'vm';

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  public clipsCollection: AngularFirestoreCollection<IClip>;
  pageClips: IClip[] = [];
  pendingRequest = false;

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
      const clipRef = this.storage.ref(`clips/${clip.fileName}`);
      const screenshotRef = this.storage.storage.ref(`screenshots/${clip.screenshotFileName}`);
      clipRef.delete();
      screenshotRef.delete();

      await this.clipsCollection.doc(clip.docId).delete();
      
    }

    async fetchClips(){
      if (this.pendingRequest){
        return;
      }

      this.pendingRequest = true;
      let query = this.clipsCollection.ref.orderBy('timeStamp', 'desc').limit(6)

      const { length } = this.pageClips; 

      if (length) {
        const lastDocId = this.pageClips[length-1].docId;
        const lastDoc = await firstValueFrom(this.clipsCollection.doc(lastDocId)
          .get()) //toPromise is deprecated, replaced with firstValueFrom

        query = query.startAfter(lastDoc);
      }

       const snapshot = await query.get();

       console.log(snapshot)
      
       snapshot.forEach(doc=>{
        this.pageClips.push({
          docId: doc.id,
          ...doc.data()
        });
       })

       this.pendingRequest = false;
    }
}
