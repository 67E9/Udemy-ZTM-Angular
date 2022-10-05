import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import  IUser from 'src/app/models/user.model';
import  { delay, map, filter } from 'rxjs/operators';
import { Observable, switchMap, of } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
 
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;
  redirect: boolean = false;

  constructor( 
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
    ) {
      this.usersCollection = db.collection<IUser>('users'); //avoid repetition by putting the collection with generic into a variable
      this.isAuthenticated$ = auth.user.pipe(
        map(user => !!user) // !! converts the object to a boolean 
      )
      this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
        delay(1000)
      )
      //listening to router events, because ActivatedRoute is not easily accessible from outside the router-outlet
      router.events.pipe(
        filter(event => event instanceof NavigationEnd), //only looking at NavigationEnd-Events
        map(event => route.firstChild), //get current router after navigation as ActivatedRouter-Observable (first element in routerstate-tree)
        switchMap(route => route?.data ?? of({})) //?? -> nullish coalescing oeprator, a ?? b returns b if a is nullish, else returns a
      ).subscribe(
        data => this.redirect = data.authOnly ?? false //we only redirect on logout if redirect is true, i.e. the route has data.authOnly.true
      );
    }

public async createUser (userData: IUser){
    if (!userData.password){
      throw new Error ("password not provided!");
    }

    const userCred = await this.auth
      .createUserWithEmailAndPassword(userData.email as string, userData.password as string);
    //firebase module automatically logs us in, after the account is created

    if (!userCred.user){
      throw new Error ("no user id provided")
    }

    //instead of the collection.add() function we use the collection.doc(id).set() function 
    // to set the collections id to the userID optained above
    //firebase module sends JWT with the request, so we do not have to send the token manually to authenticate db access
    this.usersCollection.doc(userCred.user.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber
    })
  }

public async logout($event?: Event){
    if ($event){
      $event.preventDefault(); //prevent Anchor tag from changing path
    }
    await this.auth.signOut();
    if (this.redirect){
      await this.router.navigateByUrl('/');
    }
  }


}


